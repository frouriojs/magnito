import type { UserEntity } from 'common/types/user';
import { sendMail } from 'service/sendMail';

export const sendConfirmationCode = (user: UserEntity): Promise<void> =>
  sendMail({
    to: { name: user.name, address: user.email },
    subject: 'Your verification code',
    text: `Your confirmation code is ${user.confirmationCode}`,
  });
