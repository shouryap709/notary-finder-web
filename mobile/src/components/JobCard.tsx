import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { FONT } from '../theme';
import { useTheme } from '../ThemeContext';
import { Job } from '../lib/supabase';

type Props = { job: Job; onPress: () => void; onBid: () => void };

function jobLabel(job: Job) {
  if (job.services && job.services.length) return job.services.join(', ');
  return job.service_type || 'Notary job';
}

export default function JobCard({ job, onPress, onBid }: Props) {
  const { colors, radius } = useTheme();
  const styles = useMemo(() => makeStyles(colors, radius), [colors, radius]);
  const when = job.date_time
    ? new Date(job.date_time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    : 'Flexible';
  const price = job.suggested_price ?? job.starting_price ?? 0;
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.title} numberOfLines={1}>{jobLabel(job)}</Text>
        <Text style={styles.price}>${price}</Text>
      </View>
      <Text style={styles.meta} numberOfLines={1}>{job.location_address || 'Location TBD'}</Text>
      <Text style={styles.meta}>{when} · {job.signatures ?? 1} signature{(job.signatures ?? 1) === 1 ? '' : 's'}</Text>
      <TouchableOpacity activeOpacity={0.8} style={styles.bidBtn} onPress={onBid}>
        <Text style={styles.bidText}>Place Bid</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const makeStyles = (colors: any, radius: any) => StyleSheet.create({
  card: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: 14, marginBottom: 12, backgroundColor: colors.card },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text, marginRight: 10, fontFamily: FONT },
  price: { fontSize: 15, fontWeight: '600', color: colors.text, fontFamily: FONT },
  meta: { fontSize: 11, color: colors.muted, marginTop: 4, fontFamily: FONT },
  bidBtn: { marginTop: 12, backgroundColor: colors.primary, borderRadius: radius.sm, paddingVertical: 10, alignItems: 'center' },
  bidText: { color: colors.primaryText, fontSize: 13, fontWeight: '600', fontFamily: FONT },
});
