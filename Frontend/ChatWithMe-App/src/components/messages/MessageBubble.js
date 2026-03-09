import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Avatar from '../common/Avatar';

const MessageBubble = ({ message, showAvatar = true }) => {
  const { colors } = useTheme();
  const { user } = useAuth();

  const isMe = message.sender._id === user._id;

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View
      style={[
        styles.container,
        isMe ? styles.myMessageContainer : styles.otherMessageContainer,
      ]}
    >
      {!isMe && showAvatar && (
        <Avatar
          username={message.sender.username}
          size={32}
          style={styles.avatar}
        />
      )}

      <View
        style={[
          styles.bubble,
          isMe ? styles.myBubble : styles.otherBubble,
          {
            backgroundColor: isMe ? colors.primary : colors.card,
            maxWidth: '75%',
          },
          !isMe && !showAvatar && { marginLeft: 44 },
        ]}
      >
        {!isMe && (
          <Text style={[styles.senderName, { color: colors.primary }]}>
            {message.sender.username}
          </Text>
        )}

        <Text
          style={[
            styles.text,
            { color: isMe ? '#fff' : colors.text },
          ]}
        >
          {message.content}
        </Text>

        <View style={styles.footer}>
          <Text
            style={[
              styles.time,
              { color: isMe ? 'rgba(255,255,255,0.7)' : colors.textTertiary },
            ]}
          >
            {formatTime(message.createdAt)}
          </Text>

          {isMe && message.isRead && (
            <Text style={styles.readReceipt}>✓✓</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    marginRight: 8,
  },
  bubble: {
    borderRadius: 16,
    padding: 12,
  },
  myBubble: {
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  time: {
    fontSize: 11,
  },
  readReceipt: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
  },
});

export default MessageBubble;