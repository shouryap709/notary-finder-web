import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Button from '../components/Button';
import { theme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ServicesChecklist'>;

export default function ServicesChecklistScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.body}>
        <Text style={styles.title}>What services do you offer?</Text>
        <Text style={styles.sub}>Pick the notarial services you handle. (placeholder)</Text>
        <Button title="Continue to dashboard" onPress={() => navigation.replace('Dashboard')} style={styles.btn} />
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
