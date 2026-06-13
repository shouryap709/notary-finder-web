import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Button from '../components/Button';
import { theme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'BidPlacement'>;

export default function BidPlacementScreen({ navigation, route }: Props) {
  const { jobId } = route.params;
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.body}>
        <Text style={styles.title}>Place a bid</Text>
        <Text style={styles.sub}>Bid form for job {jobId} (placeholder)</Text>
        <Button title="Submit bid" onPress={() => navigation.goBack()} style={styles.btn} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  body: { flex: 1, padding: 22 },
  title: { fontSize: 18, fontWeight: '600', color: theme.colors.text },
  sub: { fontSize: 12, color: theme.colors.muted, marginTop: 6, marginBottom: 24 },
  btn: { marginTop: 'auto' },
});
