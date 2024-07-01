import type { AdminDeleteUserTarget } from 'api/@types/auth';
import assert from 'assert';
import { transaction } from 'service/prismaClient';
import { userMethod } from '../model/userMethod';
import { userCommand } from '../repository/userCommand';
import { userQuery } from '../repository/userQuery';

export const adminUseCase = {
  deleteUser: (req: AdminDeleteUserTarget['reqBody']): Promise<AdminDeleteUserTarget['resBody']> =>
    transaction(async (tx) => {
      assert(req.Username);
      assert(req.UserPoolId);

      const user = await userQuery.findByName(tx, req.Username);
      const deletableId = userMethod.delete({ user, userPoolId: req.UserPoolId });

      await userCommand.delete(tx, deletableId);

      return {};
    }),
};
