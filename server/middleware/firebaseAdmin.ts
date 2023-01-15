import { FIREBASE_AUTH_EMULATOR_HOST, FIREBASE_SERVER_KEY } from '$/service/envValues'
import admin from 'firebase-admin'

export const firebaseAdmin = admin.initializeApp(
  FIREBASE_AUTH_EMULATOR_HOST
    ? { projectId: 'emulator' }
    : { credential: admin.credential.cert(JSON.parse(FIREBASE_SERVER_KEY)) }
)

export const getVerifiedUser = async (cookieVal: string | undefined) => {
  const auth = firebaseAdmin.auth()
  const idToken = await auth.verifySessionCookie(cookieVal ?? '', true).catch(() => null)

  return idToken && (await auth.getUser(idToken.uid))
}
