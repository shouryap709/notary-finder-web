import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Button from '../components/Button';
import { theme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

export default function AuthScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <Text style={styles.logo}>Notary<Text style={styles.logoEm}>Finder</Text></Text>
        <Text style={styles.tagline}>Notary sign in (placeholder)</Text>
        <Button title="Continue" onPress={() => navigation.replace('ServicesChecklist')} style={styles.btn} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  center: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  logo: { fontSize: 26, fontWeight: '700', textAlign: 'center', color: theme.colors.text },
  logoEm: { color: theme.colors.muted },
  tagline: { fontSize: 13, color: theme.colors.muted, textAlign: 'center', marginTop: 8, marginBottom: 28 },
  btn: { marginTop: 4 },
});
