// src/components/common/NetworkBanner.js
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNetworkContext } from '../../contexts/NetworkContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function NetworkBanner() {
  const { isConnected } = useNetworkContext();
  const { colors } = useTheme();
  const { t } = useLanguage();

  if (isConnected) return null;

  return (
    <View style={[styles.banner, { backgroundColor: colors.error }]}>
      <Ionicons name="cloud-offline-outline" size={20} color="#fff" />
      <Text style={styles.text}>{t('errors.noInternet')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 8,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});