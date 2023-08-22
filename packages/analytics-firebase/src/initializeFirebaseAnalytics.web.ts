import { initializeApp } from 'firebase/app';

export function initializeFirebaseAnalytics(config: string) {
  if (!config) {
    throw new Error(
      'Firebase environment configuration not found (env variable - FIREBASE_CONFIG)',
    );
  }
  const decodedConfig = atob(config);
  initializeApp(JSON.parse(decodedConfig));
}
