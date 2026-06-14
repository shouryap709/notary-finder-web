import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchCamera } from 'react-native-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Button from '../components/Button';
import { FONT } from '../theme';
import { useTheme } from '../ThemeContext';
import { fetchJob, Job, supabase, uploadProofPhoto } from '../lib/supabase';

type Props = NativeStackScreenProps<RootStackParamList, 'JobDetail'>;

export default function JobDetailScreen({ navigation, route }: Props) {
  const { colors, radius } = useTheme();
  const styles = useMemo(() => makeStyles(colors, radius), [colors, radius]);
  const { jobId } = route.params;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function load() {
    const j = await fetchJob(jobId);
    setJob(j);
    setLoading(false);
    if (j?.proof_photo_path) {
      const { data } = await supabase.storage.from('job-documents').createSignedUrl(j.proof_photo_path, 120);
      if (data?.signedUrl) setProofUrl(data.signedUrl);
    }
  }
  useEffect(() => { load(); }, [jobId]);

  async function addProofPhoto() {
    const result = await launchCamera({ mediaType: 'photo', includeBase64: true, quality: 0.7 });
    if (result.didCancel) return;
    const asset = result.assets?.[0];
    if (!asset?.base64) { Alert.alert('No photo', 'Could not capture a photo.'); return; }
    const ext = (asset.fileName?.split('.').pop() || (asset.type?.includes('png') ? 'png' : 'jpg')).toLowerCase();
    setUploading(true);
    try {
      await uploadProofPhoto(jobId, asset.base64, ext, asset.type || 'image/jpeg');
      if (asset.uri) setProofUrl(asset.uri);
      Alert.alert('Uploaded', 'Proof photo added to this job.');
    } catch (e: any) {
      Alert.alert('Upload failed', e?.message || 'Please try again.');
    } finally { setUploading(false); }
  }

  const Row = ({ label, value }: { label: string; value?: string | number | null }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value != null && value !== '' ? String(value) : '—'}</Text>
    </View>
  );

  if (loading) {
    return <SafeAreaView style={[styles.safe, styles.center]} edges={['bottom']}><ActivityIndicator color={colors.primary} /></SafeAreaView>;
  }
  if (!job) {
    return <SafeAreaView style={[styles.safe, styles.center]} edges={['bottom']}><Text style={styles.muted}>Job not found.</Text></SafeAreaView>;
  }

  const service = job.services?.length ? job.services.join(', ') : job.service_type || 'Notary job';
  const when = job.date_time ? new Date(job.date_time).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'Flexible';

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.title}>{service}</Text>
        <Row label="When" value={when} />
        <Row label="Location" value={job.location_address} />
        <Row label="Preference" value={job.notary_preference} />
        <Row label="Signatures" value={job.signatures} />
        <Row label="Customer max" value={job.starting_price != null ? `$${job.starting_price}` : null} />
        <Row label="Notes" value={job.notes} />
        {proofUrl && (
          <>
            <Text style={[styles.label, { marginTop: 16 }]}>Proof photo</Text>
            <Image source={{ uri: proofUrl }} style={styles.proof} resizeMode="cover" />
          </>
        )}
        {job.status === 'completed' && (
          <Button title={uploading ? 'Uploading…' : proofUrl ? 'Replace proof photo' : 'Add proof photo'} variant="secondary" disabled={uploading} onPress={addProofPhoto} style={{ marginTop: 16 }} />
        )}
      </ScrollView>
      <View style={styles.footer}>
        <Button title="Place Bid" onPress={() => navigation.navigate('BidPlacement', { jobId: job.id })} />
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors: any, radius: any) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { justifyContent: 'center', alignItems: 'center' },
  body: { padding: 22 },
  title: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12, fontFamily: FONT },
  row: { borderBottomWidth: 1, borderBottomColor: colors.line, paddingVertical: 12 },
  label: { fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5, color: colors.muted, fontWeight: '600', fontFamily: FONT },
  value: { fontSize: 14, color: colors.text, marginTop: 3, fontFamily: FONT },
  muted: { color: colors.muted, fontSize: 13, fontFamily: FONT },
  proof: { width: '100%', height: 200, borderRadius: radius.md, marginTop: 8 },
  footer: { padding: 18, borderTopWidth: 1, borderTopColor: colors.line },
});
