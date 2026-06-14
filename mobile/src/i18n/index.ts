import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import en from './en.json';
import es from './es.json';

const STORAGE_KEY = 'appLanguage';

function deviceLanguage(): 'en' | 'es' {
  try {
    const best = RNLocalize.findBestLanguageTag(['en', 'es']);
    return best?.languageTag?.startsWith('es') ? 'es' : 'en';
  } catch {
    return 'en';
  }
}

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, es: { translation: es } },
  lng: deviceLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v3',
});

// Apply a stored preference once it loads (overrides device default).
AsyncStorage.getItem(STORAGE_KEY).then(v => {
  if ((v === 'en' || v === 'es') && v !== i18n.language) i18n.changeLanguage(v);
});

export async function setLanguage(lng: 'en' | 'es') {
  await i18n.changeLanguage(lng);
  AsyncStorage.setItem(STORAGE_KEY, lng).catch(() => {});
}

export default i18n;
