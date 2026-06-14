import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../../App';
import Button from '../components/Button';
import { FONT } from '../theme';
import { useTheme } from '../ThemeContext';
import { updateMyProfile } from '../lib/supabase';

const SERVICES = ['Acknowledgment', 'Jurat', 'Loan Signing', 'Power of Attorney', 'Apostille', 'Real Estate'];

type Props = NativeStackScreenProps<RootStackParamList, 'ServicesChecklist'>;

export default function ServicesChecklistScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
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
        <Text style={styles.title}>{t('services.title')}</Text>
        <Text style={styles.sub}>{t('services.sub')}</Text>
        <View style={styles.grid}>
          {SERVICES.map(s => (
            <TouchableOpacity key={s} style={[styles.chip, selected.includes(s) && styles.chipOn]} onPress={() => toggle(s)}>
              <Text style={[styles.chipText, selected.includes(s) && styles.chipTextOn]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button title={t('services.continue')} onPress={save} style={styles.btn} />
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors: any) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  body: { flex: 1, padding: 22 },
  title: { fontSize: 18, fontWeight: '600', color: colors.text, fontFamily: FONT },
  sub: { fontSize: 12, color: colors.muted, marginTop: 6, marginBottom: 20, fontFamily: FONT },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderColor: colors.line, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14 },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 12, color: colors.text, fontFamily: FONT },
  chipTextOn: { color: colors.primaryText },
  btn: { marginTop: 'auto' },
});
