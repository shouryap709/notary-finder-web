import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import JobCard from '../components/JobCard';
import Toast from '../components/Toast';
import { theme } from '../theme';
import { fetchMyProfile, fetchOpenJobs, Job } from '../lib/supabase';
import { distanceMiles } from '../lib/geo';
import { registerPush } from '../lib/push';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen({ navigation, route }: Props) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [home, setHome] = useState<{ lat?: number | null; lng?: number | null }>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Surface a one-shot confirmation passed back from BidPlacement.
  useEffect(() => {
    const flash = route.params?.flash;
    if (flash) {
      setToast(flash);
      navigation.setParams({ flash: undefined });
      load();
    }
  }, [route.params?.flash]); // eslint-disable-line react-hooks/exhaustive-deps

  const load = useCallback(async () => {
    try {
      const [data, profile] = await Promise.all([fetchOpenJobs(), fetchMyProfile()]);
      setJobs(data);
      if (profile) setHome({ lat: profile.home_lat, lng: profile.home_lng });
    } catch (e) {
      // network/offline — keep whatever we have
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Register for push notifications once when the dashboard first mounts.
  useEffect(() => { registerPush(); }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.headerLink}>Profile</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]} edges={['bottom']}>
        <ActivityIndicator color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={jobs}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        ListEmptyComponent={<Text style={styles.empty}>No open jobs right now. Pull to refresh.</Text>}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            distanceMi={distanceMiles(home.lat, home.lng, item.location_lat, item.location_lng)}
            onPress={() => navigation.navigate('JobDetail', { jobId: item.id })}
            onBid={() => navigation.navigate('BidPlacement', { jobId: item.id })}
          />
        )}
      />
      <Toast message={toast} onHide={() => setToast(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  center: { justifyContent: 'center', alignItems: 'center' },
  list: { padding: 18 },
  empty: { textAlign: 'center', color: theme.colors.muted, fontSize: 12, marginTop: 60 },
  headerLink: { color: theme.colors.text, fontSize: 13, fontWeight: '600' },
});
