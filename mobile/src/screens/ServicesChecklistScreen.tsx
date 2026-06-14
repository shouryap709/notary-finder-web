import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Button from '../components/Button';
import { theme, FONT } from '../theme';
import { updateMyProfile } from '../lib/supabase';

const SERVICES = ['Acknowledgment', 'Jurat', 'Loan Signing', 'Power of Attorney', 'Apostille', 'Real Estate'];

type Props = NativeStackScreenProps<RootStackParamList, 'ServicesChecklist'>;

export default function ServicesChecklistScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(s: string) {
    setSelected(prev => (prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]));
  }
  async function save() {
    try { await updateMyProfile({ services: selected }); } catch {}
    navigation.replace('Dashboard');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.body}>
        <Text style={styles.title}>What services do you offer?</Text>
        <Text style={styles.sub}>Pick the notarial services you handle.</Text>
        <View style={styles.grid}>
          {SERVICES.map(s => (
            <TouchableOpacity key={s} style={[styles.chip, selected.includes(s) && styles.chipOn]} onPress={() => toggle(s)}>
              <Text style={[styles.chipText, selected.includes(s) && styles.chipTextOn]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button title="Continue to dashboard" onPress={save} style={styles.btn} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  body: { flex: 1, padding: 22 },
  title: { fontSize: 18, fontWeight: '600', color: theme.colors.text, fontFamily: FONT },
  sub: { fontSize: 12, color: theme.colors.muted, marginTop: 6, marginBottom: 20, fontFamily: FONT },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderColor: theme.colors.line, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14 },
  chipOn: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  chipText: { fontSize: 12, color: theme.colors.text, fontFamily: FONT },
  chipTextOn: { color: theme.colors.primaryText },
  btn: { marginTop: 'auto' },
});
