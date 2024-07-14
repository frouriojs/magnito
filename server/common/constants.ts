export const APP_NAME = 'Magnito';

export const BRANDED_ID_NAMES = [
  'user',
  'deletableUser',
  'userPool',
  'userPoolClient',
  'task',
] as const;

export const USER_STATUSES = [
  'UNCONFIRMED',
  'CONFIRMED',
  // 'EXTERNAL_PROVIDER',
  // 'UNKNOWN',
  'RESET_REQUIRED',
  'FORCE_CHANGE_PASSWORD',
] as const;
