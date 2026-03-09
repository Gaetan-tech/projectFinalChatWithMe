import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { subjectsAPI } from '../../api/subjects';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import Avatar from '../common/Avatar';
import Card from '../common/Card';

const SubjectCard = ({ subject, onPress, onJoin, onEdit, onDelete }) => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();

  const isCreator = subject?.creator?._id === user?._id;
  const canJoin = !isCreator &&
    subject?.creator?.flagStatus === 'red' &&
    user?.flagStatus === 'green';

  const handleDelete = () => {
    Alert.alert(
      t('subjects.deleteConfirm') || 'Supprimer le sujet',
      t('subjects.deleteConfirmMessage') || 'Êtes-vous sûr de vouloir supprimer ce sujet ?',
      [
        { text: t('common.cancel') || 'Annuler', style: 'cancel' },
        {
          text: t('common.delete') || 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              await subjectsAPI.closeSubject(subject._id);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              onDelete?.(subject._id);
            } catch (error) {
              console.error('Erreur suppression sujet:', error);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert(
                t('common.error') || 'Erreur',
                error.response?.data?.message || t('subjects.deleteError') || 'Impossible de supprimer le sujet'
              );
            }
          },
        },
      ]
    );
  };

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons
            name="flag"
            size={20}
            color={subject?.creator?.flagStatus === 'red' ? colors.flagRed : colors.textTertiary}
          />
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {subject.title ?? ''}
          </Text>
        </View>

        {subject?.creator?.isOnline && (
          <View style={[styles.onlineDot, { backgroundColor: colors.online }]} />
        )}
      </View>

      {subject.description && (
        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
          {subject.description}
        </Text>
      )}

      <View style={styles.footer}>
        <View style={styles.creatorInfo}>
          <Avatar
            username={subject?.creator?.username}
            size={32}
            showOnline
            isOnline={!!subject?.creator?.isOnline}
          />
          <View style={styles.creatorDetails}>
            <Text style={[styles.creatorName, { color: colors.text }]}>
              {subject?.creator?.username ?? '—'}
            </Text>
            <View style={styles.stats}>
              <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
              <Text style={[styles.statsText, { color: colors.textSecondary }]}>
                {subject?.participants?.length || 0}
              </Text>
            </View>
          </View>
        </View>

        {canJoin && (
          <TouchableOpacity
            style={[styles.joinButton, { backgroundColor: colors.primary }]}
            onPress={(e) => {
              e.stopPropagation();
              onJoin?.(subject?._id);
            }}
          >
            <Text style={styles.joinButtonText}>{t('subjects.join')}</Text>
          </TouchableOpacity>
        )}

        {isCreator && !canJoin && (
          <View style={styles.creatorActions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primaryLight }]}
              onPress={(e) => {
                e.stopPropagation();
                onEdit?.(subject);
              }}
            >
              <Ionicons name="pencil" size={18} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.errorLight }]}
              onPress={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              <Ionicons name="trash" size={18} color={colors.error} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.meta}>
        <Text style={[styles.time, { color: colors.textTertiary }]}>
          {new Date(subject?.createdAt || Date.now()).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: subject.status === 'active' ? colors.flagGreenLight : colors.border }
        ]}>
          <Text style={[
            styles.statusText,
            { color: subject.status === 'active' ? colors.flagGreen : colors.textSecondary }
          ]}>
            {t(`subjects.status_${subject.status}`)}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  creatorDetails: {
    flex: 1,
  },
  creatorName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statsText: {
    fontSize: 12,
  },
  joinButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  creatorActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  time: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
});

export default SubjectCard;