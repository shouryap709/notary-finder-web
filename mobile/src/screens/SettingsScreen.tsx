import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme, FONT } from '../theme';
import { signOut, fetchMyProfile, updateMyProfile } from '../lib/supabase';
import pkg from '../../package.json';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const PRIVACY_URL = 'https://notaryfinder.com/privacy';
const FAQ_URL = 'https://notaryfinder.com/faq';

function Row({ label, value, onPress, right }: { label: string; value?: string; onPress?: () => void; right?: React.ReactNode }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} disabled={!onPress} activeOpacity={onPress ? 0.6 : 1}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        {right ?? (onPress ? <Text style={styles.chevron}>›</Text> : null)}
      </View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen({ navigation }: Props) {
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

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.section}>Account</Text>
        <Row label="Edit profile" onPress={() => navigation.navigate('Profile')} />

        <Text style={styles.section}>Notifications</Text>
        <Row label="Push notifications" right={<Switch value={notif} onValueChange={toggleNotif} />} />

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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  body: { padding: 18 },
  section: { fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.6, color: theme.colors.muted, fontWeight: '700', marginTop: 22, marginBottom: 6, fontFamily: FONT },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: theme.colors.line },
  rowLabel: { fontSize: 14, color: theme.colors.text, fontFamily: FONT },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowValue: { fontSize: 13, color: theme.colors.muted, fontFamily: FONT },
  chevron: { fontSize: 20, color: theme.colors.muted, marginLeft: 4 },
  signOut: { marginTop: 30, alignItems: 'center', paddingVertical: 12 },
  signOutText: { color: theme.colors.danger, fontSize: 14, fontWeight: '600', fontFamily: FONT },
});
