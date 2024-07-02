import type {
  AdminCreateUserTarget,
  AdminDeleteUserTarget,
  AdminInitiateAuthTarget,
} from 'api/@types/auth';
import assert from 'assert';
import { userPoolQuery } from 'domain/userPool/repository/userPoolQuery';
import { brandedId } from 'service/brandedId';
import { transaction } from 'service/prismaClient';
import { genJwks } from 'service/privateKey';
import { userMethod } from '../model/userMethod';
import { userCommand } from '../repository/userCommand';
import { userQuery } from '../repository/userQuery';
import { genCredentials } from '../service/genCredentials';
import { genTokens } from '../service/genTokens';

export const adminUseCase = {
  createUser: (req: AdminCreateUserTarget['reqBody']): Promise<AdminCreateUserTarget['resBody']> =>
    transaction(async (tx) => {
      const email = req.UserAttributes?.find((attr) => attr.Name === 'email')?.Value;

      assert(email);
      assert(req.UserPoolId);
      assert(req.Username);
      assert(req.TemporaryPassword);

      const userPool = await userPoolQuery.findById(tx, req.UserPoolId);
      const { salt, verifier } = genCredentials({
        poolId: userPool.id,
        username: req.Username,
        password: req.TemporaryPassword,
      });
      const idCount = await userQuery.countId(tx, req.Username);
      const user = userMethod.createVerifiedUser(idCount, {
        name: req.Username,
        password: req.TemporaryPassword,
        email,
        salt,
        verifier,
        userPoolId: userPool.id,
      });

      await userCommand.save(tx, user);

      return { User: { Username: user.name, Attributes: [{ Name: 'email', Value: user.email }] } };
    }),
  deleteUser: (req: AdminDeleteUserTarget['reqBody']): Promise<AdminDeleteUserTarget['resBody']> =>
    transaction(async (tx) => {
      assert(req.Username);
      assert(req.UserPoolId);

      const user = await userQuery.findByName(tx, req.Username);
      const deletableId = userMethod.delete({ user, userPoolId: req.UserPoolId });

      await userCommand.delete(tx, deletableId);

      return {};
    }),
  initiateAuth: (
    req: AdminInitiateAuthTarget['reqBody'],
  ): Promise<AdminInitiateAuthTarget['resBody']> =>
    transaction(async (tx) => {
      assert(req.UserPoolId);
      assert(req.AuthParameters);

      const user = await userQuery.findByName(tx, req.AuthParameters.USERNAME);
      const pool = await userPoolQuery.findById(tx, req.UserPoolId);
      const poolClient = await userPoolQuery.findClientById(
        tx,
        brandedId.userPoolClient.maybe.parse(req.ClientId),
      );
      const jwks = await genJwks(pool.privateKey);
      const tokens = genTokens({
        privateKey: pool.privateKey,
        userPoolClientId: poolClient.id,
        jwks,
        user,
      });

      return {
        AuthenticationResult: {
          ...tokens,
          ExpiresIn: 3600,
          RefreshToken: user.refreshToken,
          TokenType: 'Bearer',
        },
      };
    }),
};
