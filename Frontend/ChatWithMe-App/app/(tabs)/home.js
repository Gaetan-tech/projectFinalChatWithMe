import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { subjectsAPI } from '../../src/api/subjects';
import { usersAPI } from '../../src/api/users';
import Avatar from '../../src/components/common/Avatar';
import Card from '../../src/components/common/Card';
import Loader from '../../src/components/common/Loader';
import FlagSelector from '../../src/components/profile/FlagSelector';
import { useAuth } from '../../src/contexts/AuthContext';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { useSocket } from '../../src/contexts/SocketContext';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useUserSubjectsModal } from '../../src/contexts/UserSubjectsModalContext';

const HomeScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { isConnected } = useSocket();
  const { openModal } = useUserSubjectsModal();

  const [redFlagUsers, setRedFlagUsers] = useState([]);
  const [greenFlagUsers, setGreenFlagUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.flagStatus]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      let usersToLoad = [];

      if (user?.flagStatus === 'green') {
        // Si j'ai le flag vert, je vois les utilisateurs avec flag rouge CONNECTÉS
        const response = await usersAPI.getRedFlagUsers();
        usersToLoad = (response.data.users || []).filter(u => u.isOnline);
        setRedFlagUsers(usersToLoad);
        setGreenFlagUsers([]);
      } else if (user?.flagStatus === 'red') {
        // Si j'ai le flag rouge, je vois les utilisateurs avec flag vert CONNECTÉS
        const response = await usersAPI.getGreenFlagUsers();
        usersToLoad = (response.data.users || []).filter(u => u.isOnline);
        setGreenFlagUsers(usersToLoad);
        setRedFlagUsers([]);
      } else {
        setRedFlagUsers([]);
        setGreenFlagUsers([]);
      }


    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.flagStatus]);

  const handleFlagChange = () => {
    loadUsers();
  };

  const handleUserPress = async (userData) => {
    try {
      // Charger les sujets de l'utilisateur
      const response = await subjectsAPI.getUserSubjects(userData._id);
      const userSubjects = response.data?.subjects || [];
      
      // Ouvrir la modale avec les sujets
      openModal(userData, userSubjects);
    } catch (error) {
      console.error('Erreur chargement sujets utilisateur:', error);
      // Fallback: ouvrir la modale sans sujets
      openModal(userData, []);
    }
  };

  const renderUserCard = (userData) => {
    const handlePress = () => {
      console.log('Opening user subjects modal:', userData._id, userData.username);
      handleUserPress(userData);
    };

    return (
      <TouchableOpacity
        key={userData._id}
        onPress={handlePress}
        activeOpacity={0.7}
        style={styles.userCardWrapper}
      >
        <Card style={styles.userCard}>
          <View style={styles.userHeader}>
            <Avatar
              username={userData.username}
              size={48}
              showOnline
              isOnline={userData.isOnline}
            />
            <View style={styles.userInfo}>
              <Text style={[styles.username, { color: colors.text }]}>
                {userData.username}
              </Text>
              <Text style={[styles.email, { color: colors.textSecondary }]}>
                {userData.email}
              </Text>
            </View>
            <View
              style={[
                styles.flagBadge,
                {
                  backgroundColor:
                    userData.flagStatus === 'red'
                      ? colors.flagRedLight
                      : colors.flagGreenLight,
                },
              ]}
            >
              <Ionicons
                name="flag"
                size={16}
                color={
                  userData.flagStatus === 'red' ? colors.flagRed : colors.flagGreen
                }
              />
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('tabs.home')}
        </Text>
        <View style={styles.headerRight}>
          <View
            style={[
              styles.socketIndicator,
              {
                backgroundColor: isConnected
                  ? colors.online
                  : colors.offline,
              },
            ]}
          />
          <Text style={[styles.socketText, { color: colors.textSecondary }]}>
            {isConnected ? t('common.connected') : t('common.disconnected')}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Flag Selector */}
        <FlagSelector onFlagChange={handleFlagChange} />

        {/* Liste des utilisateurs */}
        {loading ? (
          <Loader message={t('common.loading')} />
        ) : user?.flagStatus === 'none' ? (
          <Card style={styles.emptyCard}>
            <Ionicons
              name="flag-outline"
              size={48}
              color={colors.textTertiary}
            />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {t('home.selectFlag')}
            </Text>
            <Text
              style={[styles.emptyDescription, { color: colors.textSecondary }]}
            >
              {t('home.selectFlagDescription')}
            </Text>
          </Card>
        ) : (
          <View style={styles.usersSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {user?.flagStatus === 'green'
                ? t('home.usersNeedHelp')
                : t('home.usersAvailable')}
            </Text>

            {redFlagUsers.length === 0 && greenFlagUsers.length === 0 ? (
              <Card style={styles.emptyCard}>
                <Ionicons
                  name="people-outline"
                  size={48}
                  color={colors.textTertiary}
                />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                  {t('common.noResults')}
                </Text>
                <Text
                  style={[
                    styles.emptyDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  Aucun utilisateur disponible pour le moment
                </Text>
              </Card>
            ) : (
              <>
                {redFlagUsers.map(renderUserCard)}
                {greenFlagUsers.map(renderUserCard)}
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  socketIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  socketText: {
    fontSize: 12,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  usersSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  userCard: {
    marginBottom: 12,
  },
  userCardWrapper: {
    marginBottom: 12,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
  },
  flagBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  subjectsTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  subjectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingLeft: 8,
    borderLeftWidth: 3,
    marginBottom: 4,
  },
  subjectText: {
    fontSize: 13,
    flex: 1,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default HomeScreen;