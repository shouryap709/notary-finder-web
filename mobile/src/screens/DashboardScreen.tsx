import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Button from '../components/Button';
import { theme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.body}>
        <Text style={styles.title}>Open jobs</Text>
        <Text style={styles.sub}>Job feed will appear here. (placeholder)</Text>
        <View style={styles.actions}>
          <Button title="View a job" onPress={() => navigation.navigate('JobDetail', { jobId: 'demo' })} style={styles.btn} />
          <Button title="My profile" variant="secondary" onPress={() => navigation.navigate('Profile')} style={styles.btn} />
          <Button title="Settings" variant="secondary" onPress={() => navigation.navigate('Settings')} style={styles.btn} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  body: { flex: 1, padding: 22 },
  title: { fontSize: 18, fontWeight: '600', color: theme.colors.text },
  sub: { fontSize: 12, color: theme.colors.muted, marginTop: 6, marginBottom: 24 },
  actions: { marginTop: 'auto', gap: 10 },
  btn: {},
});
