# NotaryFinder Mobile

React Native companion app for notaries — shares the Supabase backend with the web marketplace.

## Stack
- React Native 0.74 + TypeScript
- React Navigation (native-stack)
- Supabase JS client + AsyncStorage session persistence
- react-native-image-picker (photo proof)
- i18next + react-native-localize (English / Spanish)
- Light + dark theme via React Context

## Setup
```bash
cd mobile
npm install
cd ios && pod install && cd ..   # iOS only
npm run ios                       # or: npm run android
npm start                         # Metro bundler
```

## Configuration
Supabase URL + anon key live in `src/lib/supabase.ts` (defaults to the same
project as the web app).

## Structure
```
App.tsx                 NavigationContainer + stack
src/theme.ts            design tokens (light + dark)
src/lib/supabase.ts     client + auth/data helpers
src/components/         Button, JobCard
src/screens/            Auth, ServicesChecklist, Dashboard,
                        JobDetail, BidPlacement, Profile, Settings
src/i18n/               en.json, es.json
```

## Screen flow
Auth → ServicesChecklist → Dashboard → JobDetail → BidPlacement,
with Profile and Settings reachable from the Dashboard.
