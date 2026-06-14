import React, { useState } from 'react';
import { Text, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Button from '../components/Button';
import { theme, FONT } from '../theme';
import { placeBid } from '../lib/supabase';

type Props = NativeStackScreenProps<RootStackParamList, 'BidPlacement'>;

export default function BidPlacementScreen({ navigation, route }: Props) {
  const { jobId } = route.params;
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    const amount = parseFloat(price);
    if (!amount || amount <= 0) { Alert.alert('Enter a price', 'Please enter a valid bid amount.'); return; }
    setBusy(true);
    try {
      await placeBid(jobId, amount, message.trim());
      navigation.navigate('Dashboard', { flash: 'Bid placed' });
    } catch (e: any) {
      Alert.alert('Could not place bid', e?.message || 'Please try again.');
    } finally { setBusy(false); }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.body}>
        <Text style={styles.label}>Your bid (USD)</Text>
        <TextInput style={styles.input} placeholder="e.g. 75" placeholderTextColor={theme.colors.muted} value={price} onChangeText={setPrice} keyboardType="numeric" />
        <Text style={styles.label}>Message to customer (optional)</Text>
        <TextInput style={[styles.input, styles.textarea]} placeholder="Tell them why you're a great fit…" placeholderTextColor={theme.colors.muted} value={message} onChangeText={setMessage} multiline />
        <Button title={busy ? 'Submitting…' : 'Submit bid'} onPress={submit} disabled={busy} style={styles.btn} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  body: { flex: 1, padding: 22 },
  label: { fontSize: 11, color: theme.colors.muted, fontWeight: '600', marginBottom: 6, marginTop: 8, fontFamily: FONT },
  input: { borderWidth: 1, borderColor: theme.colors.line, borderRadius: theme.radius.sm, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: theme.colors.text, fontFamily: FONT },
  textarea: { height: 100, textAlignVertical: 'top' },
  btn: { marginTop: 'auto' },
});
