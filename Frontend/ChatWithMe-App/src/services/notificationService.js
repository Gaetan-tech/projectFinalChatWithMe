import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
  }

  async registerForPushNotifications() {
    try {
      // NOTE: Les notifications push ne fonctionnent pas dans Expo Go
      // Utiliser seulement les notifications locales pour le développement
      
      // Demander les permissions pour les notifications locales
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Permission de notification refusée');
        return null;
      }

      console.log('✅ Notifications locales activées');

      // Configuration Android pour les notifications locales
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#6366f1',
        });
      }

      return 'local-notifications-enabled';
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des notifications:', error);
      return null;
    }
  }

  // Envoyer une notification locale
  async sendLocalNotification(title, body, data = {}) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: null, // Immédiatement
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
    }
  }

  // Notification pour un nouveau message
  async notifyNewMessage(senderName, message) {
    await this.sendLocalNotification(
      `Nouveau message de ${senderName}`,
      message,
      { type: 'new_message' }
    );
  }

  // Notification pour un nouveau sujet
  async notifyNewSubject(creatorName, subjectTitle) {
    await this.sendLocalNotification(
      'Nouveau sujet disponible',
      `${creatorName} a créé "${subjectTitle}"`,
      { type: 'new_subject' }
    );
  }

  // Notification quand quelqu'un rejoint votre sujet
  async notifyUserJoined(username) {
    await this.sendLocalNotification(
      'Nouveau participant',
      `${username} a rejoint votre sujet`,
      { type: 'user_joined' }
    );
  }

  // Écouter les notifications reçues
  addNotificationReceivedListener(callback) {
    this.notificationListener = Notifications.addNotificationReceivedListener(callback);
  }

  // Écouter les réponses aux notifications
  addNotificationResponseReceivedListener(callback) {
    this.responseListener = Notifications.addNotificationResponseReceivedListener(callback);
  }

  // Nettoyer les listeners
  removeListeners() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  // Définir le badge count
  async setBadgeCount(count) {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du badge:', error);
    }
  }

  // Effacer toutes les notifications
  async clearAllNotifications() {
    try {
      await Notifications.dismissAllNotificationsAsync();
    } catch (error) {
      console.error('Erreur lors de l\'effacement des notifications:', error);
    }
  }
}

export default new NotificationService();