/**
 * Shared design tokens — minimal black/white aesthetic mirroring the web app.
 * DM Sans is used when bundled; falls back to the system font otherwise.
 */
export const FONT = 'System'; // swap to 'DMSans-Regular' once the font is linked

export const lightColors = {
  bg: '#ffffff',
  text: '#111111',
  muted: '#999999',
  line: '#ececec',
  primary: '#000000',
  primaryText: '#ffffff',
  card: '#fafafa',
  accent: '#1f8a3b',
  danger: '#e53935',
};

export const darkColors = {
  bg: '#0e0e0e',
  text: '#f3f3f3',
  muted: '#888888',
  line: '#262626',
  primary: '#ffffff',
  primaryText: '#000000',
  card: '#1a1a1a',
  accent: '#3ecf6b',
  danger: '#ff6b66',
};

export const theme = {
  colors: lightColors,
  radius: { sm: 8, md: 12, lg: 16 },
  space: (n: number) => n * 4,
};

export type ThemeColors = typeof lightColors;
