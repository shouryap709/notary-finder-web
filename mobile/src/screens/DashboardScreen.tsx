import React, { useCallback, useEffect, useState } from 'react';
import { Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import JobCard from '../components/JobCard';
import { theme, FONT } from '../theme';
import { fetchOpenJobs, Job } from '../lib/supabase';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen({ navigation }: Props) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try { setJobs(await fetchOpenJobs()); } catch {}
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.headerLink}>Settings</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (loading) {
    return <SafeAreaView style={[styles.safe, styles.center]} edges={['bottom']}><ActivityIndicator color={theme.colors.primary} /></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={jobs}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        ListEmptyComponent={<Text style={styles.empty}>No open jobs right now. Pull to refresh.</Text>}
        renderItem={({ item }) => (
          <JobCard job={item}
            onPress={() => navigation.navigate('JobDetail', { jobId: item.id })}
            onBid={() => navigation.navigate('BidPlacement', { jobId: item.id })} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  center: { justifyContent: 'center', alignItems: 'center' },
  list: { padding: 18 },
  empty: { textAlign: 'center', color: theme.colors.muted, fontSize: 12, marginTop: 60, fontFamily: FONT },
  headerLink: { color: theme.colors.text, fontSize: 13, fontWeight: '600', fontFamily: FONT },
});
