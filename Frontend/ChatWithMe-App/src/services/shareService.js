import { Share } from 'react-native';

class ShareService {
  // Partager l'application
  async shareApp() {
    try {
      await Share.share({
        message: '✨ Découvre Chat Flags, une nouvelle façon de communiquer et d\'obtenir de l\'aide ! Télécharge l\'app maintenant.',
        title: 'Chat Flags',
      });
    } catch (error) {
      console.error('Erreur lors du partage:', error);
    }
  }

  // Partager un sujet
  async shareSubject(subject) {
    try {
      await Share.share({
        message: `🔴 Nouveau sujet disponible : "${subject.title}"\n\n${subject.description || ''}\n\nRejoins-moi sur Chat Flags !`,
        title: subject.title,
      });
    } catch (error) {
      console.error('Erreur lors du partage du sujet:', error);
    }
  }

  // Partager un message
  async shareMessage(message, senderName) {
    try {
      await Share.share({
        message: `💬 Message de ${senderName}:\n\n"${message}"\n\nVia Chat Flags`,
        title: `Message de ${senderName}`,
      });
    } catch (error) {
      console.error('Erreur lors du partage du message:', error);
    }
  }
}

export default new ShareService();