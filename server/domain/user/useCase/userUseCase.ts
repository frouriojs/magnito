import type { UserEntity } from 'api/@types/user';
import type { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { transaction } from 'service/prismaClient';
import { userMethod } from '../model/userMethod';
import { userCommand } from '../repository/userCommand';
import { userQuery } from '../repository/userQuery';

export const userUseCase = {
  findOrCreateUser: (record: UserRecord): Promise<UserEntity> =>
    transaction('RepeatableRead', async (tx) => {
      const user = await userQuery.findById(tx, record.uid).catch(async () => {
        const newUser = userMethod.create(record);
        await userCommand.save(tx, newUser);

        return newUser;
      });

      return user;
    }),
};
