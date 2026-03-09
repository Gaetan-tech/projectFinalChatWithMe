// src/components/common/Card.js
import { Pressable, View } from 'react-native';

export default function Card({ children, style, onPress }) {
  if (onPress) {
    return (
      <Pressable 
        onPress={onPress}
        style={({ pressed }) => [
          style,
          pressed && { opacity: 0.7 }
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={style}>{children}</View>;
}
