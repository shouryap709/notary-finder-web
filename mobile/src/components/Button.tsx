import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { theme, FONT } from '../theme';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  style?: ViewStyle;
};

export default function Button({ title, onPress, variant = 'primary', disabled, style }: Props) {
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress}
      style={[styles.base, isPrimary ? styles.primary : styles.secondary, disabled && styles.disabled, style]}>
      <Text style={[styles.text, isPrimary ? styles.primaryText : styles.secondaryText]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { paddingVertical: 14, paddingHorizontal: 18, borderRadius: theme.radius.sm, alignItems: 'center' },
  primary: { backgroundColor: theme.colors.primary },
  secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.line },
  disabled: { opacity: 0.45 },
  text: { fontSize: 14, fontWeight: '600', fontFamily: FONT },
  primaryText: { color: theme.colors.primaryText },
  secondaryText: { color: theme.colors.text },
});
