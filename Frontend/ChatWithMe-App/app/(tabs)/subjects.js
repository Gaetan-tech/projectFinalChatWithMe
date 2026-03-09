import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Modal, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { subjectsAPI } from '../../src/api/subjects';
import Button from '../../src/components/common/Button';
import EmptyState from '../../src/components/common/EmptyState';
import Input from '../../src/components/common/Input';
import Loader from '../../src/components/common/Loader';
import SubjectCard from '../../src/components/subjects/SubjectCard';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { useTheme } from '../../src/contexts/ThemeContext';

const SubjectsScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useLanguage();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  // Edit
  const [editingSubject, setEditingSubject] = useState(null);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const response = await subjectsAPI.getMySubjects();
      // Filter out closed subjects
      const activeSubjects = (response.data.subjects || []).filter(s => s.status !== 'closed');
      setSubjects(activeSubjects);
    } catch (error) {
      console.error('Erreur chargement sujets:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadSubjects();
    setRefreshing(false);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = t('subjects.titleRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateSubject = async () => {
    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      setCreating(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      if (editingSubject) {
        // Update existing subject
        await subjectsAPI.updateSubject(editingSubject._id, title.trim(), description.trim());
      } else {
        // Create new subject
        await subjectsAPI.createSubject(title.trim(), description.trim());
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Réinitialiser le formulaire
      setTitle('');
      setDescription('');
      setEditingSubject(null);
      setModalVisible(false);
      
      // Recharger la liste
      await loadSubjects();
    } catch (error) {
      console.error('Erreur création/modification sujet:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(t('common.error'), error.response?.data?.message || 'Erreur');
    } finally {
      setCreating(false);
    }
  };

  const handleJoinSubject = async (subjectId) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      await subjectsAPI.joinSubject(subjectId);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Naviguer vers le chat
      router.push(`/subject/${subjectId}`);
    } catch (error) {
      console.error('Erreur rejoindre sujet:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(t('common.error'), error.response?.data?.message || 'Erreur');
    }
  };

  const handleSubjectPress = (subject) => {
    router.push(`/subject/${subject._id}`);
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setTitle(subject.title);
    setDescription(subject.description);
    setModalVisible(true);
  };

  const handleDeleteSubject = (subjectId) => {
    setSubjects(subjects.filter(s => s._id !== subjectId));
  };

  const renderSubject = ({ item }) => (
    <SubjectCard
      subject={item}
      onPress={() => handleSubjectPress(item)}
      onJoin={() => handleJoinSubject(item._id)}
      onEdit={handleEditSubject}
      onDelete={handleDeleteSubject}
    />
  );

  if (loading) {
    return <Loader fullScreen message={t('common.loading')} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('subjects.title')}
        </Text>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: colors.primary }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setModalVisible(true);
          }}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Liste des sujets */}
      <FlatList
        data={subjects}
        renderItem={renderSubject}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="chatbubbles-outline"
            title={t('subjects.noSubjects')}
            description="Aucun sujet disponible pour le moment"
            actionLabel={t('subjects.createSubject')}
            onAction={() => setModalVisible(true)}
          />
        }
      />

      {/* Modal Création */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {editingSubject ? t('subjects.editSubject') : t('subjects.createSubject')}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setEditingSubject(null);
                setTitle('');
                setDescription('');
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

            <Input
              label={t('subjects.subjectTitle')}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (errors.title) setErrors({ ...errors, title: null });
              }}
              placeholder="Ex: Besoin d'aide en JavaScript"
              leftIcon="chatbubble-outline"
              error={errors.title}
              maxLength={100}
            />

            <Input
              label={t('subjects.subjectDescription')}
              value={description}
              onChangeText={setDescription}
              placeholder="Décrivez votre sujet..."
              multiline
              numberOfLines={4}
              maxLength={500}
              leftIcon="document-text-outline"
            />

            <View style={styles.modalActions}>
              <Button
                title={t('common.cancel')}
                onPress={() => {
                  setModalVisible(false);
                  setEditingSubject(null);
                  setTitle('');
                  setDescription('');
                }}
                variant="outline"
                style={{ flex: 1 }}
              />
              <Button
                title={editingSubject ? t('subjects.update') : t('subjects.create')}
                onPress={handleCreateSubject}
                loading={creating}
                disabled={!title.trim()}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  createButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flexGrow: 1,
    padding: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
});

export default SubjectsScreen;