import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Button from '../components/Button';
import { theme, FONT } from '../theme';
import { signOut } from '../lib/supabase';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  async function handleSignOut() {
    try { await signOut(); } catch {}
    navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
  }
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.body}>
        <Text style={styles.title}>Settings</Text>
        <Button title="Edit profile" variant="secondary" onPress={() => navigation.navigate('Profile')} style={styles.btn} />
        <Button title="Sign out" variant="secondary" onPress={handleSignOut} style={styles.btn} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  body: { flex: 1, padding: 22 },
  title: { fontSize: 18, fontWeight: '600', color: theme.colors.text, marginBottom: 16, fontFamily: FONT },
  btn: { marginBottom: 10 },
});
