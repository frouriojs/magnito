import dotenv from 'dotenv';

dotenv.config();

const PORT = +(process.env.PORT ?? '8080');
const API_BASE_PATH = process.env.API_BASE_PATH ?? '';
const API_ORIGIN = process.env.API_ORIGIN ?? '';
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? '';
const FIREBASE_AUTH_EMULATOR_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST;
const FIREBASE_SERVER_KEY = process.env.FIREBASE_SERVER_KEY ?? '';

export {
  API_BASE_PATH,
  API_ORIGIN,
  CORS_ORIGIN,
  FIREBASE_AUTH_EMULATOR_HOST,
  FIREBASE_SERVER_KEY,
  PORT,
};
