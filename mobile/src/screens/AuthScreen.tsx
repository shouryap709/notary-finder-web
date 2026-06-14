import React, { useEffect, useMemo, useState } from 'react';
import { Text, StyleSheet, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Button from '../components/Button';
import { FONT } from '../theme';
import { useTheme } from '../ThemeContext';
import { getSession, signInNotary, signUpOrInNotary } from '../lib/supabase';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

export default function AuthScreen({ navigation }: Props) {
  const { colors, radius } = useTheme();
  const styles = useMemo(() => makeStyles(colors, radius), [colors, radius]);
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getSession().then(s => { if (s) navigation.replace('Dashboard'); }).finally(() => setChecking(false));
  }, [navigation]);

  async function submit() {
    if (!email || !password || (mode === 'up' && !name)) { Alert.alert('Missing info', 'Please fill in all fields.'); return; }
    setBusy(true);
    try {
      if (mode === 'up') {
        const res = await signUpOrInNotary(email.trim(), password, name.trim());
        if ('pendingVerification' in res) { Alert.alert('Check your email', `We sent a confirmation link to ${res.email}.`); return; }
        navigation.replace('ServicesChecklist');
      } else {
        await signInNotary(email.trim(), password);
        navigation.replace('Dashboard');
      }
    } catch (e: any) {
      Alert.alert('Sign in failed', e?.message || 'Please try again.');
    } finally { setBusy(false); }
  }

  if (checking) {
    return <SafeAreaView style={[styles.safe, styles.center]}><ActivityIndicator color={colors.primary} /></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.center}>
        <Text style={styles.logo}>Notary<Text style={styles.logoEm}>Finder</Text></Text>
        <Text style={styles.tagline}>{mode === 'up' ? 'Create your notary profile' : 'Notary sign in'}</Text>
        {mode === 'up' && <TextInput style={styles.input} placeholder="Full name" placeholderTextColor={colors.muted} value={name} onChangeText={setName} autoCapitalize="words" />}
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor={colors.muted} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor={colors.muted} value={password} onChangeText={setPassword} secureTextEntry />
        <Button title={busy ? 'Please wait…' : mode === 'up' ? 'Sign up' : 'Sign in'} onPress={submit} disabled={busy} style={styles.btn} />
        <Text style={styles.switch} onPress={() => setMode(mode === 'in' ? 'up' : 'in')}>
          {mode === 'in' ? 'New here? Create a profile' : 'Already have an account? Sign in'}
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: any, radius: any) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  logo: { fontSize: 26, fontWeight: '700', textAlign: 'center', color: colors.text, fontFamily: FONT },
  logoEm: { color: colors.muted },
  tagline: { fontSize: 13, color: colors.muted, textAlign: 'center', marginTop: 8, marginBottom: 24, fontFamily: FONT },
  input: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, marginBottom: 12, color: colors.text, fontFamily: FONT },
  btn: { marginTop: 4 },
  switch: { textAlign: 'center', color: colors.muted, fontSize: 12, marginTop: 18, fontFamily: FONT },
});
