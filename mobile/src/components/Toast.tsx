import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { theme } from '../theme';

/** Minimal auto-dismissing toast. Render with a `message` to show; clears via onHide. */
export default function Toast({ message, onHide }: { message: string | null; onHide: () => void }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!message) return;
    Animated.timing(opacity, { toValue: 1, duration: 160, useNativeDriver: true }).start();
    const t = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => onHide());
    }, 1800);
    return () => clearTimeout(t);
  }, [message, opacity, onHide]);

  if (!message) return null;
  return (
    <Animated.View style={[styles.wrap, { opacity }]} pointerEvents="none">
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 20, right: 20, bottom: 40, backgroundColor: '#111', borderRadius: theme.radius.sm, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center' },
  text: { color: '#fff', fontSize: 13, fontWeight: '500' },
});
