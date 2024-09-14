import type {
  SocialUserCreateVal,
  SocialUserEntity,
  SocialUserRequestTokensVal,
  SocialUserResponseTokensVal,
} from 'common/types/user';
import { userPoolQuery } from 'domain/userPool/repository/userPoolQuery';
import { transaction } from 'service/prismaClient';
import { socialUserMethod } from '../model/socialUserMethod';
import { userCommand } from '../repository/userCommand';
import { userQuery } from '../repository/userQuery';

export const socialUseCase = {
  createUser: (val: SocialUserCreateVal): Promise<SocialUserEntity> =>
    transaction(async (tx) => {
      const userPoolClient = await userPoolQuery.findClientById(tx, val.userPoolClientId);
      const user = socialUserMethod.create(userPoolClient.userPoolId, val);

      await userCommand.save(tx, user);

      return user;
    }),
  getTokens: (params: SocialUserRequestTokensVal): Promise<SocialUserResponseTokensVal> =>
    transaction(async (tx) => {
      const user = await userQuery.findByAuthorizationCode(tx, params.code);
      const pool = await userPoolQuery.findById(tx, user.userPoolId);
      const poolClient = await userPoolQuery.findClientById(tx, params.client_id);
      const jwks = await userPoolQuery.findJwks(tx, user.userPoolId);

      return socialUserMethod.createToken(user, params.code_verifier, pool, poolClient, jwks);
    }),
};
