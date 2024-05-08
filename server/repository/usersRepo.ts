import type { UserEntity } from 'api/@types/user';
import type { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { userIdParser } from 'service/idParsers';

export const usersRepo = {
  recordToModel: (user: UserRecord): UserEntity => ({
    id: userIdParser.parse(user.uid),
    email: user.email ?? '',
    displayName: user.displayName,
    photoURL: user.photoURL,
  }),
};
