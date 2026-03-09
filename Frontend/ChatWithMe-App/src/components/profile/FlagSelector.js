import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usersAPI } from '../../api/users';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

const FlagSelector = ({ onFlagChange }) => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleFlagChange = async (flagStatus) => {
    if (loading || user.flagStatus === flagStatus) return;

    try {
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const response = await usersAPI.changeFlagStatus(flagStatus);
      await updateUser(response.data.user);
      
      onFlagChange?.(flagStatus);
    } catch (error) {
      console.error('Erreur changement flag:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderFlagOption = (status, icon, label, description, color) => {
    const isActive = user?.flagStatus === status;

    return (
      <TouchableOpacity
        style={[
          styles.option,
          {
            backgroundColor: isActive ? color : colors.card,
            borderColor: color,
            borderWidth: 2,
          },
        ]}
        onPress={() => handleFlagChange(status)}
        disabled={loading}
      >
        <View style={styles.optionHeader}>
          <Ionicons
            name={icon}
            size={32}
            color={isActive ? '#fff' : color}
          />
          {isActive && (
            <View style={styles.checkmark}>
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
            </View>
          )}
        </View>

        <Text
          style={[
            styles.label,
            { color: isActive ? '#fff' : colors.text },
          ]}
        >
          {label}
        </Text>

        <Text
          style={[
            styles.description,
            { color: isActive ? 'rgba(255,255,255,0.8)' : colors.textSecondary },
          ]}
        >
          {description}
        </Text>

        {loading && isActive && (
          <ActivityIndicator
            size="small"
            color="#fff"
            style={styles.loader}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        {t('flags.selectYourStatus')}
      </Text>

      <View style={styles.options}>
        {renderFlagOption(
          'green',
          'checkmark-circle',
          t('flags.green'),
          t('flags.greenDescription'),
          colors.flagGreen
        )}

        {renderFlagOption(
          'red',
          'help-circle',
          t('flags.red'),
          t('flags.redDescription'),
          colors.flagRed
        )}
      </View>

      {user?.flagStatus !== 'none' && (
        <TouchableOpacity
          style={[styles.resetButton, { borderColor: colors.border }]}
          onPress={() => handleFlagChange('none')}
          disabled={loading}
        >
          <Text style={[styles.resetText, { color: colors.textSecondary }]}>
            {t('flags.reset')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  options: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    minHeight: 160,
  },
  optionHeader: {
    position: 'relative',
    marginBottom: 12,
  },
  checkmark: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  loader: {
    marginTop: 12,
  },
  resetButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default FlagSelector;