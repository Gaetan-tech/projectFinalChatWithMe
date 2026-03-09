import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useUserSubjectsModal } from '../contexts/UserSubjectsModalContext';

export const UserSubjectsModal = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { isVisible, userData, subjects, closeModal } = useUserSubjectsModal();

  if (!userData) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={closeModal}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <TouchableOpacity onPress={closeModal} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="chevron-down" size={28} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.userInfo}>
            {userData.avatar && (
              <Image
                source={{ uri: userData.avatar }}
                style={styles.avatar}
              />
            )}
            <View>
              <Text style={[styles.userName, { color: colors.text }]}>
                {userData.username}
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {subjects.length} sujet{subjects.length > 1 ? 's' : ''}
              </Text>
            </View>
          </View>
          <View style={{ width: 28 }} />
        </View>

        {/* Subjects List */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {subjects.length > 0 ? (
            subjects.map((subject) => (
              <TouchableOpacity
                key={subject._id}
                style={[styles.subjectCard, { backgroundColor: colors.card }]}
                onPress={() => {
                  closeModal();
                  router.push(`/subject/${subject._id}`);
                }}
              >
                <View>
                  <Text style={[styles.subjectTitle, { color: colors.text }]}>
                    {subject.title || subject.name}
                  </Text>
                  {subject.description && (
                    <Text style={[styles.subjectDescription, { color: colors.textSecondary }]}>
                      {subject.description}
                    </Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Aucun sujet disponible
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  subjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  subjectTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  subjectDescription: {
    fontSize: 12,
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
  },
});
