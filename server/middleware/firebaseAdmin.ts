import { FIREBASE_AUTH_EMULATOR_HOST, FIREBASE_SERVER_KEY } from '$/service/envValues';
import admin from 'firebase-admin';
import type { UserRecord } from 'firebase-admin/lib/auth/user-record';

export const firebaseAdmin = admin.initializeApp(
  FIREBASE_AUTH_EMULATOR_HOST !== undefined
    ? { projectId: 'emulator' }
    : { credential: admin.credential.cert(JSON.parse(FIREBASE_SERVER_KEY)) }
);

export const getUserRecord = async (cookieVal: string | undefined): Promise<UserRecord | null> => {
  const auth = firebaseAdmin.auth();
  const idToken = await auth.verifySessionCookie(cookieVal ?? '', true).catch(() => null);

  return idToken && (await auth.getUser(idToken.uid));
};
