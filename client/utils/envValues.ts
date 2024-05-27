import { z } from 'zod';

const APP_VERSION = z.string().parse(process.env.APP_VERSION);
const NEXT_PUBLIC_COGNITO_POOL_ID = z.string().parse(process.env.NEXT_PUBLIC_COGNITO_POOL_ID);
const NEXT_PUBLIC_COGNITO_CLIENT_ID = z.string().parse(process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID);
const NEXT_PUBLIC_COGNITO_POOL_ENDPOINT = z
  .string()
  .optional()
  .parse(process.env.NEXT_PUBLIC_COGNITO_POOL_ENDPOINT);

export {
  APP_VERSION,
  NEXT_PUBLIC_COGNITO_CLIENT_ID,
  NEXT_PUBLIC_COGNITO_POOL_ENDPOINT,
  NEXT_PUBLIC_COGNITO_POOL_ID,
};
