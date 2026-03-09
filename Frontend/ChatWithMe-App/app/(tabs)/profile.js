import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Avatar from '../../src/components/common/Avatar';
import Card from '../../src/components/common/Card';
import FlagSelector from '../../src/components/profile/FlagSelector';
import { useAuth } from '../../src/contexts/AuthContext';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { useSocket } from '../../src/contexts/SocketContext';
import { useTheme } from '../../src/contexts/ThemeContext';
import shareService from '../../src/services/shareService';

const ProfileScreen = () => {
  const { colors, themeMode, changeTheme } = useTheme();
  const { t, language, changeLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const { isConnected } = useSocket();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      t('profile.logout'),
      t('profile.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.logout'),
          style: 'destructive',
          onPress: async () => {
            await logout();
            // After logout, navigate to the login screen
            try {
              router.replace('/login');
            } catch (_) {
              // fallback to push if replace fails
              router.push('/login');
            }
          },
        },
      ]
    );
  };

  const handleShareApp = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await shareService.shareApp();
  };

  const renderSettingItem = (icon, label, value, onPress, color) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: (color || colors.primary) + '20' }]}>
          <Ionicons name={icon} size={24} color={color || colors.primary} />
        </View>
        <Text style={[styles.settingLabel, { color: colors.text }]}>
          {label}
        </Text>
      </View>
      <View style={styles.settingRight}>
        {value && (
          <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
            {value}
          </Text>
        )}
        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Avatar
            username={user?.username}
            size={80}
            showOnline
            isOnline={isConnected}
          />
          <View style={styles.userInfo}>
            <Text style={[styles.username, { color: colors.text }]}>
              {user?.username}
            </Text>
            <Text style={[styles.email, { color: colors.textSecondary }]}>
              {user?.email}
            </Text>
            <View style={styles.statusBadge}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isConnected ? colors.online : colors.offline },
                ]}
              />
              <Text style={[styles.statusText, { color: colors.textSecondary }]}>
                {isConnected ? t('common.online') : t('common.offline')}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Flag Selector */}
      <FlagSelector />

      {/* Settings */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('profile.settings')}
        </Text>

        {renderSettingItem(
          themeMode === 'dark' ? 'moon' : 'sunny',
          t('profile.theme'),
          t(`profile.${themeMode}Theme`),
          () => {
            const newTheme = themeMode === 'dark' ? 'light' : 'dark';
            changeTheme(newTheme);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        )}

        {renderSettingItem(
          'language',
          t('profile.language'),
          language === 'fr' ? 'Français' : 'English',
          () => {
            const newLang = language === 'fr' ? 'en' : 'fr';
            changeLanguage(newLang);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        )}

        {renderSettingItem(
          'notifications',
          t('profile.notifications'),
          null,
          () => {
            Alert.alert(t('common.info'), t('profile.notificationsInfo'));
          }
        )}
      </Card>

      {/* Actions */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('profile.actions')}
        </Text>

        {renderSettingItem(
          'share-social',
          t('profile.shareApp'),
          null,
          handleShareApp,
          colors.primary
        )}

        {renderSettingItem(
          'information-circle',
          t('profile.about'),
          'v1.0.0',
          () => {
            Alert.alert(
              'Chat Flags',
              'Une application de chat avec système de flags\n\nVersion 1.0.0\n\n© 2025'
            );
          },
          colors.info
        )}
      </Card>

      {/* Logout */}
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: colors.error }]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.logoutText}>{t('common.logout')}</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textTertiary }]}>
          Chat Flags © 2025
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
  },
  section: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    flex: 1,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
  },
  footerText: {
    fontSize: 12,
  },
});

export default ProfileScreen;