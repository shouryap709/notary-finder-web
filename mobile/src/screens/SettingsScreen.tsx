import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { FONT } from '../theme';
import { useTheme } from '../ThemeContext';
import { signOut, fetchMyProfile, updateMyProfile } from '../lib/supabase';
import pkg from '../../package.json';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const PRIVACY_URL = 'https://notaryfinder.com/privacy';
const FAQ_URL = 'https://notaryfinder.com/faq';

export default function SettingsScreen({ navigation }: Props) {
  const { colors, mode, toggleMode } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [notif, setNotif] = useState(true);

  useEffect(() => {
    fetchMyProfile().then(p => { if (p?.notifications_enabled != null) setNotif(!!p.notifications_enabled); });
  }, []);

  function toggleNotif(v: boolean) {
    setNotif(v);
    updateMyProfile({ notifications_enabled: v }).catch(() => {});
  }

  async function handleSignOut() {
    try { await signOut(); } catch {}
    navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
  }

  const Row = ({ label, value, onPress, right }: { label: string; value?: string; onPress?: () => void; right?: React.ReactNode }) => (
    <TouchableOpacity style={styles.row} onPress={onPress} disabled={!onPress} activeOpacity={onPress ? 0.6 : 1}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        {right ?? (onPress ? <Text style={styles.chevron}>›</Text> : null)}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.section}>Account</Text>
        <Row label="Edit profile" onPress={() => navigation.navigate('Profile')} />

        <Text style={styles.section}>Preferences</Text>
        <Row label="Push notifications" right={<Switch value={notif} onValueChange={toggleNotif} />} />
        <Row label="Dark mode" right={<Switch value={mode === 'dark'} onValueChange={toggleMode} />} />

        <Text style={styles.section}>About</Text>
        <Row label="Privacy policy" onPress={() => Linking.openURL(PRIVACY_URL)} />
        <Row label="Help & FAQ" onPress={() => Linking.openURL(FAQ_URL)} />
        <Row label="Version" value={pkg.version} />

        <TouchableOpacity style={styles.signOut} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: any) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  body: { padding: 18 },
  section: { fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.6, color: colors.muted, fontWeight: '700', marginTop: 22, marginBottom: 6, fontFamily: FONT },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.line },
  rowLabel: { fontSize: 14, color: colors.text, fontFamily: FONT },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowValue: { fontSize: 13, color: colors.muted, fontFamily: FONT },
  chevron: { fontSize: 20, color: colors.muted, marginLeft: 4 },
  signOut: { marginTop: 30, alignItems: 'center', paddingVertical: 12 },
  signOutText: { color: colors.danger, fontSize: 14, fontWeight: '600', fontFamily: FONT },
});
