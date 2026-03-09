// src/components/subjects/CreateSubjectModal.js
import { Modal, Text, View } from 'react-native';

export default function CreateSubjectModal({ visible, onClose }) {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ padding: 20 }}>
        <Text>Create subject</Text>
      </View>
    </Modal>
  );
}
