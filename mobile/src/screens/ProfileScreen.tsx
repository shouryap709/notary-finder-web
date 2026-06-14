import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../../App';
import Button from '../components/Button';
import { FONT } from '../theme';
import { useTheme } from '../ThemeContext';
import { fetchMyProfile, updateMyProfile, NotaryProfile } from '../lib/supabase';

const SERVICES = ['Acknowledgment', 'Jurat', 'Loan Signing', 'Power of Attorney', 'Apostille', 'Real Estate'];

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { colors, radius } = useTheme();
  const styles = useMemo(() => makeStyles(colors, radius), [colors, radius]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [phone, setPhone] = useState('');
  const [license, setLicense] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [services, setServices] = useState<string[]>([]);

  useEffect(() => {
    fetchMyProfile().then((p: NotaryProfile | null) => {
      if (p) {
        setName(p.full_name || ''); setBusiness(p.business_name || ''); setPhone(p.phone || '');
        setLicense(p.license_number || ''); setState(p.state || ''); setAddress(p.home_address || '');
        setLat(p.home_lat ?? null); setLng(p.home_lng ?? null); setServices(p.services || []);
      }
    }).finally(() => setLoading(false));
  }, []);

  function toggleService(s: string) {
    setServices(prev => (prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]));
  }

  function useCurrentLocation() {
    const geo = (global as any).navigator?.geolocation;
    if (!geo) { Alert.alert('Location unavailable', 'Enter your address manually.'); return; }
    geo.getCurrentPosition(
      (pos: any) => { setLat(pos.coords.latitude); setLng(pos.coords.longitude); Alert.alert('Location set', 'Using your current location.'); },
      () => Alert.alert('Location error', 'Could not get your location.'),
      { enableHighAccuracy: false, timeout: 10000 },
    );
  }

  async function save() {
    setSaving(true);
    try {
      await updateMyProfile({
        full_name: name.trim(), business_name: business.trim(), phone: phone.trim(),
        license_number: license.trim(), state: state.trim(), services,
        home_address: address.trim(), home_lat: lat, home_lng: lng,
      });
      Alert.alert('Saved', 'Your profile has been updated.');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Save failed', e?.message || 'Please try again.');
    } finally { setSaving(false); }
  }

  const Field = (props: any) => (
    <View style={styles.field}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput style={styles.input} value={props.value} onChangeText={props.onChange} placeholderTextColor={colors.muted} {...props.inputProps} />
    </View>
  );

  if (loading) {
    return <SafeAreaView style={[styles.safe, styles.center]} edges={['bottom']}><ActivityIndicator color={colors.primary} /></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.body}>
        <Field label={t('profile.fullName')} value={name} onChange={setName} inputProps={{ autoCapitalize: 'words' }} />
        <Field label={t('profile.businessName')} value={business} onChange={setBusiness} inputProps={{ autoCapitalize: 'words' }} />
        <Field label={t('profile.phone')} value={phone} onChange={setPhone} inputProps={{ keyboardType: 'phone-pad' }} />
        <Field label={t('profile.license')} value={license} onChange={setLicense} />
        <Field label={t('profile.state')} value={state} onChange={setState} inputProps={{ autoCapitalize: 'characters', maxLength: 2 }} />

        <Text style={styles.label}>{t('profile.servicesOffered')}</Text>
        <View style={styles.grid}>
          {SERVICES.map(s => (
            <TouchableOpacity key={s} style={[styles.chip, services.includes(s) && styles.chipOn]} onPress={() => toggleService(s)}>
              <Text style={[styles.chipText, services.includes(s) && styles.chipTextOn]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t('profile.homeAddress')}</Text>
          <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="123 Main St, San Jose, CA" placeholderTextColor={colors.muted} />
          <TouchableOpacity style={styles.locBtn} onPress={useCurrentLocation}>
            <Text style={styles.locBtnText}>📍 {t('profile.useLocation')}{lat != null ? ` (${lat.toFixed(3)}, ${lng?.toFixed(3)})` : ''}</Text>
          </TouchableOpacity>
        </View>

        <Button title={saving ? t('profile.saving') : t('profile.save')} onPress={save} disabled={saving} style={{ marginTop: 12 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: any, radius: any) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { justifyContent: 'center', alignItems: 'center' },
  body: { padding: 22 },
  field: { marginBottom: 14 },
  label: { fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5, color: colors.muted, fontWeight: '600', marginBottom: 6, fontFamily: FONT },
  input: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm, paddingHorizontal: 12, paddingVertical: 11, fontSize: 14, color: colors.text, fontFamily: FONT },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 16 },
  chip: { borderWidth: 1, borderColor: colors.line, borderRadius: 20, paddingVertical: 7, paddingHorizontal: 13 },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 11, color: colors.text, fontFamily: FONT },
  chipTextOn: { color: colors.primaryText },
  locBtn: { marginTop: 8, paddingVertical: 8 },
  locBtnText: { fontSize: 11, color: colors.accent, fontWeight: '600', fontFamily: FONT },
});
