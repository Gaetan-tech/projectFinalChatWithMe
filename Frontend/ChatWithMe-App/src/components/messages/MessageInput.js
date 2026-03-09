// src/components/messages/MessageInput.js
import { useState } from 'react';
import { Button, TextInput, View } from 'react-native';

export default function MessageInput({ onSend }) {
  const [text, setText] = useState('');
  return (
    <View style={{ flexDirection: 'row', padding: 8 }}>
      <TextInput style={{ flex: 1 }} value={text} onChangeText={setText} />
      <Button title="Send" onPress={() => { onSend(text); setText(''); }} />
    </View>
  );
}
