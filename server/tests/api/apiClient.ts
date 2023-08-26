import { firebaseAdmin } from '$/middleware/firebaseAdmin';
import { API_BASE_PATH, FIREBASE_AUTH_EMULATOR_HOST, PORT } from '$/service/envValues';
import aspida from '@aspida/axios';
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import {
  GithubAuthProvider,
  connectAuthEmulator,
  getAuth,
  signInWithCredential,
} from 'firebase/auth';
import { afterAll, beforeAll } from 'vitest';
import api from '../../api/$api';

export const testUser = { name: 'vitest-user', email: 'vitest@example.com' };

const agent = axios.create();
export const apiClient = api(
  aspida(agent, { baseURL: `http://127.0.0.1:${PORT}${API_BASE_PATH}` })
);

beforeAll(async () => {
  const auth = getAuth(initializeApp({ apiKey: 'fake-api-key', authDomain: 'localhost' }));
  connectAuthEmulator(auth, `http://${FIREBASE_AUTH_EMULATOR_HOST}`, { disableWarnings: true });
  const result = await signInWithCredential(
    auth,
    GithubAuthProvider.credential(JSON.stringify({ sub: testUser.name, email: testUser.email }))
  );
  const idToken = await result.user.getIdToken();
  const res = await apiClient.session.post({ body: { idToken } });
  agent.defaults.headers.Cookie = res.headers['set-cookie'][0].split(';')[0];
});

afterAll(async () => {
  const user = await firebaseAdmin.auth().getUserByEmail(testUser.email);
  await firebaseAdmin.auth().deleteUser(user.uid);
});
