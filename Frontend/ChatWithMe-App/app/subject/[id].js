// app/subject/[id].js
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { messagesAPI } from '../../src/api/messages';
import ErrorBoundary from '../../src/components/common/ErrorBoundary';
import Loader from '../../src/components/common/Loader';
import { useAuth } from '../../src/contexts/AuthContext';
import { useSocket } from '../../src/contexts/SocketContext';
import { useTheme } from '../../src/contexts/ThemeContext';

export default function SubjectChat() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { isConnected } = useSocket();
  const { id, title } = useLocalSearchParams();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [accessError, setAccessError] = useState(null);
  const scrollViewRef = useRef(null);

  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      setAccessError(null);

      // Charger les messages directement
      const response = await messagesAPI.getMessages(id);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
      
      // Vérifier si c'est un erreur d'accès (403)
      if (error.response?.status === 403) {
        setAccessError(error.response?.data?.message || 'Vous n\'avez pas accès à ce sujet');
      }
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleSendMessage = useCallback(async () => {
    if (!messageText.trim() || !user) return;

    try {
      setSending(true);
      // Ajouter le message à la liste immédiatement (optimistic update)
      const optimisticMessage = {
        _id: `temp-${Date.now()}`,
        content: messageText,
        sender: { _id: user._id, username: user.username },
        subjectId: id,
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, optimisticMessage]);
      setMessageText('');

      // Envoyer le message au serveur
      const response = await messagesAPI.sendMessage(id, messageText);

      // Remplacer le message temporaire par le vrai message
      if (response.data && response.data.data) {
        setMessages(prev =>
          prev.map(msg =>
            msg._id.startsWith('temp-') ? response.data.data : msg
          )
        );
      }

      // Scroller vers le bas
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Erreur envoi message:', error);
      // Retirer le message optimiste en cas d'erreur
      setMessages(prev => prev.filter(msg => !msg._id.startsWith('temp-')));
    } finally {
      setSending(false);
    }
  }, [messageText, id, user]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Loader />
      </View>
    );
  }

  if (accessError) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={28} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
            {title || 'Chat'}
          </Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="lock-closed" size={64} color={colors.error} />
          <Text style={[styles.errorTitle, { color: colors.text }]}>Accès refusé</Text>
          <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>
            {accessError}
          </Text>
          <TouchableOpacity
            style={[styles.backButton, { borderColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.backButtonText, { color: colors.primary }]}>Retour</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { backgroundColor: colors.background }]}
        keyboardVerticalOffset={100}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={28} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
              {title || 'Chat'}
            </Text>
            {isConnected && (
              <View style={styles.onlineIndicator}>
                <View style={[styles.onlineDot, { backgroundColor: colors.online }]} />
                <Text style={[styles.onlineText, { color: colors.textSecondary }]}>
                  Connected
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length > 0 ? (
            messages.map((message) => {
              // Vérifier que le message et son expéditeur existent
              if (!message || !message.sender || !user) {
                return null;
              }
              
              const isFromCurrentUser = message.sender._id === user._id;
              return (
                <View
                  key={message._id}
                  style={[
                    styles.messageWrapper,
                    isFromCurrentUser ? styles.sentWrapper : styles.receivedWrapper,
                  ]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      isFromCurrentUser
                        ? { backgroundColor: colors.primary }
                        : { backgroundColor: colors.card },
                    ]}
                  >
                    {!isFromCurrentUser && (
                      <Text style={[styles.senderName, { color: colors.textSecondary }]}>
                        {message.sender?.username || 'Unknown'}
                      </Text>
                    )}
                    <Text
                      style={[
                        styles.messageText,
                        isFromCurrentUser ? { color: '#fff' } : { color: colors.text },
                      ]}
                    >
                      {message.content}
                    </Text>
                    <Text
                      style={[
                        styles.timestamp,
                        isFromCurrentUser ? { color: 'rgba(255,255,255,0.7)' } : { color: colors.textTertiary },
                      ]}
                    >
                      {new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No messages yet. Start the conversation!
            </Text>
          )}
        </ScrollView>

        {/* Input */}
        <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.textTertiary,
              },
            ]}
            placeholder="Type a message..."
            placeholderTextColor={colors.textSecondary}
            value={messageText}
            onChangeText={setMessageText}
            editable={!sending}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: colors.primary,
                opacity: sending || !messageText.trim() ? 0.6 : 1,
              },
            ]}
            onPress={handleSendMessage}
            disabled={sending || !messageText.trim()}
          >
            {sending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  onlineText: {
    fontSize: 12,
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 24,
  },
  messageWrapper: {
    marginBottom: 12,
    flexDirection: 'row',
  },
  sentWrapper: {
    justifyContent: 'flex-end',
  },
  receivedWrapper: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});