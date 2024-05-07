import type { UserModel } from 'api/@types/models';
import type { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { userIdParser } from 'service/idParsers';

export const usersRepo = {
  recordToModel: (user: UserRecord): UserModel => ({
    id: userIdParser.parse(user.uid),
    email: user.email ?? '',
    displayName: user.displayName,
    photoURL: user.photoURL,
  }),
};
