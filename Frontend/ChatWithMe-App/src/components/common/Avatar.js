import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const Avatar = ({
  username,
  imageUri,
  size = 48,
  backgroundColor,
  textColor,
  showOnline = false,
  isOnline = false,
}) => {
  const { colors } = useTheme();

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const bgColor = backgroundColor || colors.primary;
  const txtColor = textColor || '#fff';

  return (
    <View style={{ position: 'relative' }}>
      <View
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: bgColor,
          },
        ]}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
            }}
          />
        ) : (
          <Text
            style={[
              styles.initials,
              {
                color: txtColor,
                fontSize: size / 2.5,
              },
            ]}
          >
            {getInitials(username)}
          </Text>
        )}
      </View>

      {showOnline && (
        <View
          style={[
            styles.onlineDot,
            {
              width: size / 4,
              height: size / 4,
              borderRadius: size / 8,
              backgroundColor: isOnline ? colors.online : colors.offline,
              borderWidth: 2,
              borderColor: colors.card,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  initials: {
    fontWeight: '600',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

export default Avatar;