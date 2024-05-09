import type { FirebaseOptions } from 'firebase/app';
import { getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';

export const createAuth = () => {
  if (getApps().length > 0) return getAuth();

  if (process.env.NEXT_PUBLIC_AUTH_EMULATOR_URL !== undefined) {
    // https://firebase.google.com/docs/emulator-suite/connect_auth
    const auth = getAuth(initializeApp({ apiKey: 'fake-api-key', authDomain: location.hostname }));
    connectAuthEmulator(auth, process.env.NEXT_PUBLIC_AUTH_EMULATOR_URL, { disableWarnings: true });

    return auth;
  } else {
    const firebaseConfig: FirebaseOptions = JSON.parse(
      process.env.NEXT_PUBLIC_FIREBASE_CONFIG ?? '{}',
    );

    return getAuth(initializeApp(firebaseConfig));
  }
};
