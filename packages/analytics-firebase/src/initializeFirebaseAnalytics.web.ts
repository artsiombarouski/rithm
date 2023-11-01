import { initializeApp } from 'firebase/app';

export function initializeFirebaseAnalytics(config: { [key: string]: any }) {
  if (!config) {
    throw new Error(
      'Firebase environment configuration not found (env variable - FIREBASE_CONFIG)',
    );
  }
  initializeApp(config);
}