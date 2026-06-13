/**
 * Shared design tokens — mirrors the minimal black/white aesthetic of the web app.
 */
export const theme = {
  colors: {
    bg: '#ffffff',
    text: '#111111',
    muted: '#999999',
    line: '#ececec',
    primary: '#000000',
    primaryText: '#ffffff',
    accent: '#1f8a3b',
    danger: '#e53935',
    card: '#fafafa',
  },
  radius: { sm: 8, md: 12, lg: 16 },
  space: (n: number) => n * 4,
};
