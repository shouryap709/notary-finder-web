# NotaryFinder Mobile

React Native app for notaries — the mobile companion to the NotaryFinder web marketplace.

## Stack
- React Native 0.74 + TypeScript
- React Navigation (native-stack)
- Supabase JS client (shared backend with the web app)
- AsyncStorage for session persistence
- Notifee + Firebase Messaging for push (registration wired; send infra is a later Edge Function)
- react-native-biometrics for Face ID / Touch ID unlock

## Setup
```bash
cd mobile
npm install

# iOS only
cd ios && pod install && cd ..

# Run
npm run ios       # or: npm run android
npm start         # Metro bundler
```

## Configuration
Supabase URL + anon key live in `src/lib/supabase.ts`. They default to the same
project the web app uses; override via the `SUPABASE_URL` / `SUPABASE_ANON_KEY`
constants there (or wire your own env mechanism).

## Structure
```
App.tsx                     NavigationContainer + stack
src/theme.ts                shared design tokens (mirrors web aesthetic)
src/lib/supabase.ts         Supabase client + auth helpers
src/components/              shared UI (Button, JobCard)
src/screens/                Auth, ServicesChecklist, Dashboard,
                            JobDetail, BidPlacement, Profile, Settings
```

## Screen flow
Auth → ServicesChecklist → Dashboard → JobDetail → BidPlacement,
with Profile and Settings reachable from the Dashboard.
