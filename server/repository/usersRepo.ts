import type { UserModel } from '$/commonTypesWithClient/models';
import { userIdParser } from '$/service/idParsers';
import type { UserRecord } from 'firebase-admin/lib/auth/user-record';

export const usersRepo = {
  recordToModel: (user: UserRecord): UserModel => ({
    id: userIdParser.parse(user.uid),
    email: user.email ?? '',
    displayName: user.displayName,
    photoURL: user.photoURL,
  }),
};
