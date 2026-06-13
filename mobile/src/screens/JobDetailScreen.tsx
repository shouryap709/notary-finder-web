import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Button from '../components/Button';
import { theme } from '../theme';
import { fetchJob, Job } from '../lib/supabase';

type Props = NativeStackScreenProps<RootStackParamList, 'JobDetail'>;

function Row({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value != null && value !== '' ? String(value) : '—'}</Text>
    </View>
  );
}

export default function JobDetailScreen({ navigation, route }: Props) {
  const { jobId } = route.params;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJob(jobId).then(setJob).finally(() => setLoading(false));
  }, [jobId]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]} edges={['bottom']}>
        <ActivityIndicator color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]} edges={['bottom']}>
        <Text style={styles.muted}>Job not found.</Text>
      </SafeAreaView>
    );
  }

  const service = job.services?.length ? job.services.join(', ') : job.service_type || 'Notary job';
  const when = job.date_time
    ? new Date(job.date_time).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    : 'Flexible';

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.title}>{service}</Text>
        <Row label="When" value={when} />
        <Row label="Location" value={job.location_address} />
        <Row label="Preference" value={job.notary_preference} />
        <Row label="Signatures" value={job.signatures} />
        <Row label="Customer max" value={job.starting_price != null ? `$${job.starting_price}` : null} />
        <Row label="Suggested price" value={job.suggested_price != null ? `$${job.suggested_price}` : null} />
        <Row label="Notes" value={job.notes} />
      </ScrollView>
      <View style={styles.footer}>
        <Button title="Place Bid" onPress={() => navigation.navigate('BidPlacement', { jobId: job.id })} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  center: { justifyContent: 'center', alignItems: 'center' },
  body: { padding: 22 },
  title: { fontSize: 18, fontWeight: '700', color: theme.colors.text, marginBottom: 12 },
  row: { borderBottomWidth: 1, borderBottomColor: theme.colors.line, paddingVertical: 12 },
  label: { fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5, color: theme.colors.muted, fontWeight: '600' },
  value: { fontSize: 14, color: theme.colors.text, marginTop: 3 },
  muted: { color: theme.colors.muted, fontSize: 13 },
  footer: { padding: 18, borderTopWidth: 1, borderTopColor: theme.colors.line },
});
