import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Button from '../components/Button';
import { theme } from '../theme';
import { fetchMyProfile, NotaryProfile } from '../lib/supabase';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value != null && value !== '' ? String(value) : '—'}</Text>
    </View>
  );
}

export default function ProfileScreen({ navigation }: Props) {
  const [profile, setProfile] = useState<NotaryProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProfile()
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]} edges={['bottom']}>
        <ActivityIndicator color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.body}>
        <Text style={styles.name}>{profile?.full_name || 'Your profile'}</Text>
        {profile?.verification_status === 'approved' && <Text style={styles.verified}>Verified ✓</Text>}

        <Field label="Business" value={profile?.business_name} />
        <Field label="Email" value={profile?.email} />
        <Field label="Phone" value={profile?.phone} />
        <Field label="Commission #" value={profile?.license_number} />
        <Field label="Rating" value={profile?.rating != null ? `${profile.rating} ★ (${profile.reviews_count ?? 0})` : null} />

        <Button title="Settings" variant="secondary" onPress={() => navigation.navigate('Settings')} style={styles.btn} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  center: { justifyContent: 'center', alignItems: 'center' },
  body: { flex: 1, padding: 22 },
  name: { fontSize: 20, fontWeight: '700', color: theme.colors.text },
  verified: { fontSize: 11, color: theme.colors.accent, fontWeight: '600', marginTop: 4, marginBottom: 10 },
  field: { borderBottomWidth: 1, borderBottomColor: theme.colors.line, paddingVertical: 12 },
  label: { fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5, color: theme.colors.muted, fontWeight: '600' },
  value: { fontSize: 14, color: theme.colors.text, marginTop: 3 },
  btn: { marginTop: 'auto' },
});
