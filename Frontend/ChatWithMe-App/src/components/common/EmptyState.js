import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const Card = ({
  children,
  onPress,
  style,
  elevation = 2,
  padding = 16,
  borderRadius = 12,
}) => {
  const { colors, isDark } = useTheme();

  const cardStyle = [
    styles.card,
    {
      backgroundColor: colors.card,
      padding,
      borderRadius,
      shadowColor: isDark ? '#000' : colors.cardShadow,
      shadowOffset: {
        width: 0,
        height: elevation,
      },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: elevation * 2,
      elevation: elevation * 2,
    },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});

export default Card;