import { checkSmtpHealth } from 'service/sendMail';
import { defineController } from './$relay';

const check = async () => ({
  server: 'ok' as const,
  smtp: await checkSmtpHealth().then(() => 'ok' as const),
});

export default defineController(() => ({
  get: () => check().then((body) => ({ status: 200, body })),
}));
