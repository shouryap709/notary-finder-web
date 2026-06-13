import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { getSession, supabase } from './supabase';

let unsubscribeForeground: (() => void) | null = null;

/** Save the device's FCM token to the signed-in notary's profile. */
async function saveToken(token: string) {
  const session = await getSession();
  if (!session) return;
  await supabase.from('profiles').update({ push_token: token }).eq('id', session.user.id);
}

/**
 * Request notification permission, register the FCM device token, persist it,
 * and wire a foreground listener that surfaces incoming messages via Notifee.
 *
 * NOTE: the actual push *send* infrastructure is stubbed — it will live in a
 * Supabase Edge Function that reads profiles.push_token and calls FCM.
 */
export async function registerPush(): Promise<void> {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (!enabled) return;

    if (Platform.OS === 'android') {
      await notifee.createChannel({ id: 'jobs', name: 'New jobs', importance: AndroidImportance.HIGH });
    }

    const token = await messaging().getToken();
    if (token) await saveToken(token);

    // Keep the stored token fresh.
    messaging().onTokenRefresh(saveToken);

    // Foreground messages don't display automatically — render them ourselves.
    if (unsubscribeForeground) unsubscribeForeground();
    unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      await notifee.displayNotification({
        title: remoteMessage.notification?.title ?? 'NotaryFinder',
        body: remoteMessage.notification?.body ?? 'You have a new update.',
        android: { channelId: 'jobs', pressAction: { id: 'default' } },
      });
    });
  } catch (e) {
    // Permission denied or FCM not configured (e.g. simulator) — non-fatal.
  }
}

export function unregisterPush(): void {
  if (unsubscribeForeground) {
    unsubscribeForeground();
    unsubscribeForeground = null;
  }
}
