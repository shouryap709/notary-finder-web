import React, { useMemo } from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { FONT } from '../theme';
import { useTheme } from '../ThemeContext';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  style?: ViewStyle;
};

export default function Button({ title, onPress, variant = 'primary', disabled, style }: Props) {
  const { colors, radius } = useTheme();
  const styles = useMemo(() => makeStyles(colors, radius), [colors, radius]);
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

const makeStyles = (colors: any, radius: any) => StyleSheet.create({
  base: { paddingVertical: 14, paddingHorizontal: 18, borderRadius: radius.sm, alignItems: 'center' },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.line },
  disabled: { opacity: 0.45 },
  text: { fontSize: 14, fontWeight: '600', fontFamily: FONT },
  primaryText: { color: colors.primaryText },
  secondaryText: { color: colors.text },
});
