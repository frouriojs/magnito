import type { SocialUserCreateVal, SocialUserEntity } from 'common/types/user';
import { userPoolQuery } from 'domain/userPool/repository/userPoolQuery';
import { transaction } from 'service/prismaClient';
import { socialUserMethod } from '../model/socialUserMethod';
import { userCommand } from '../repository/userCommand';

export const socialUseCase = {
  createUser: (val: SocialUserCreateVal): Promise<SocialUserEntity> =>
    transaction(async (tx) => {
      const userPoolClient = await userPoolQuery.findClientById(tx, val.userPoolClientId);
      const user = socialUserMethod.create(userPoolClient.userPoolId, val);

      await userCommand.save(tx, user);

      return user;
    }),
};
