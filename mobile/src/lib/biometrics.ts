import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';

const FLAG_KEY = 'biometricEnabled';
const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });

/** Whether the device has Face ID / Touch ID / fingerprint available. */
export async function isBiometricAvailable(): Promise<boolean> {
  try {
    const { available } = await rnBiometrics.isSensorAvailable();
    return available;
  } catch {
    return false;
  }
}

export async function isBiometricEnabled(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(FLAG_KEY)) === 'true';
  } catch {
    return false;
  }
}

export async function setBiometricEnabled(on: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(FLAG_KEY, on ? 'true' : 'false');
  } catch {}
}

/** Run the biometric prompt. Resolves true on success, false otherwise. */
export async function authenticateBiometric(reason = 'Unlock NotaryFinder'): Promise<boolean> {
  try {
    if (!(await isBiometricAvailable())) return false;
    const { success } = await rnBiometrics.simplePrompt({ promptMessage: reason });
    return success;
  } catch {
    return false;
  }
}

/**
 * After a first successful login, offer to enable biometric unlock.
 * No-op if biometrics aren't available or the user already opted in.
 */
export async function maybeOfferBiometric(): Promise<void> {
  if (!(await isBiometricAvailable())) return;
  if (await isBiometricEnabled()) return;
  Alert.alert(
    'Use Face ID next time?',
    'Unlock NotaryFinder with Face ID or Touch ID instead of your password.',
    [
      { text: 'Not now', style: 'cancel', onPress: () => setBiometricEnabled(false) },
      { text: 'Enable', onPress: () => setBiometricEnabled(true) },
    ],
  );
}
