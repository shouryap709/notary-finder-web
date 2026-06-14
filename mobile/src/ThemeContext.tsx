import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors, ThemeColors } from './theme';

type Mode = 'light' | 'dark';

type ThemeValue = {
  mode: Mode;
  colors: ThemeColors;
  radius: { sm: number; md: number; lg: number };
  space: (n: number) => number;
  toggleMode: () => void;
  setMode: (m: Mode) => void;
};

const STORAGE_KEY = 'themeMode';
const radius = { sm: 8, md: 12, lg: 16 };
const space = (n: number) => n * 4;

const ThemeContext = createContext<ThemeValue>({
  mode: 'light', colors: lightColors, radius, space, toggleMode: () => {}, setMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>(Appearance.getColorScheme() === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(v => { if (v === 'light' || v === 'dark') setModeState(v); });
  }, []);

  const setMode = (m: Mode) => { setModeState(m); AsyncStorage.setItem(STORAGE_KEY, m).catch(() => {}); };
  const toggleMode = () => setMode(mode === 'dark' ? 'light' : 'dark');

  const value = useMemo<ThemeValue>(() => ({
    mode, colors: mode === 'dark' ? darkColors : lightColors, radius, space, toggleMode, setMode,
  }), [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() { return useContext(ThemeContext); }
