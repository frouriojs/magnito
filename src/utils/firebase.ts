import type { FirebaseOptions } from 'firebase/app'
import { initializeApp } from 'firebase/app'
import type { Auth } from 'firebase/auth'
import { connectAuthEmulator, getAuth } from 'firebase/auth'

let cachedAuth: Auth

export const createAuth = () => {
  if (cachedAuth) return cachedAuth

  if (process.env.NEXT_PUBLIC_AUTH_EMULATOR_URL) {
    // https://firebase.google.com/docs/emulator-suite/connect_auth
    const auth = getAuth(initializeApp({ apiKey: 'fake-api-key', authDomain: location.hostname }))
    connectAuthEmulator(auth, process.env.NEXT_PUBLIC_AUTH_EMULATOR_URL, { disableWarnings: true })
    cachedAuth = auth

    return auth
  } else {
    const firebaseConfig: FirebaseOptions = JSON.parse(
      process.env.NEXT_PUBLIC_FIREBASE_CONFIG ?? ''
    )
    const auth = getAuth(initializeApp(firebaseConfig))
    cachedAuth = auth

    return auth
  }
}
