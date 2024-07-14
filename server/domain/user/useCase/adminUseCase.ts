import type { Prisma } from '@prisma/client';
import assert from 'assert';
import type {
  AdminCreateUserTarget,
  AdminDeleteUserTarget,
  AdminGetUserTarget,
  AdminInitiateAuthTarget,
  AdminSetUserPasswordTarget,
} from 'common/types/auth';
import type { UserEntity } from 'common/types/user';
import { userPoolQuery } from 'domain/userPool/repository/userPoolQuery';
import { brandedId } from 'service/brandedId';
import { prismaClient, transaction } from 'service/prismaClient';
import { genJwks } from 'service/privateKey';
import { adminMethod } from '../model/adminMethod';
import { userCommand } from '../repository/userCommand';
import { userQuery } from '../repository/userQuery';
import { genTokens } from '../service/genTokens';
import { sendTemporaryPassword } from '../service/sendAuthMail';

const resendTempPass = async (
  tx: Prisma.TransactionClient,
  req: AdminCreateUserTarget['reqBody'],
): Promise<UserEntity> => {
  assert(req.Username);

  const user = await userQuery.findByName(tx, req.Username);
  await sendTemporaryPassword(user, user.password);

  return user;
};

const createUser = async (
  tx: Prisma.TransactionClient,
  req: AdminCreateUserTarget['reqBody'],
): Promise<UserEntity> => {
  const email = req.UserAttributes?.find((attr) => attr.Name === 'email')?.Value;

  assert(req.Username);
  assert(email);
  assert(req.UserPoolId);

  const userPool = await userPoolQuery.findById(tx, req.UserPoolId);
  const idCount = await userQuery.countId(tx, req.Username);
  const password = req.TemporaryPassword ?? `TempPass-${Date.now()}`;
  const user = adminMethod.createVerifiedUser(idCount, {
    name: req.Username,
    password,
    email,
    userPoolId: userPool.id,
  });

  await userCommand.save(tx, user);
  if (req.MessageAction !== 'SUPPRESS') await sendTemporaryPassword(user, password);

  return user;
};

export const adminUseCase = {
  getUser: async (req: AdminGetUserTarget['reqBody']): Promise<AdminGetUserTarget['resBody']> => {
    assert(req.Username);
    const user = await userQuery.findByName(prismaClient, req.Username);
    assert(user.userPoolId === req.UserPoolId);

    return {
      Username: user.name,
      UserAttributes: [{ Name: 'email', Value: user.email }],
      UserStatus: user.status,
    };
  },
  createUser: (req: AdminCreateUserTarget['reqBody']): Promise<AdminCreateUserTarget['resBody']> =>
    transaction(async (tx) => {
      const user = await (req.MessageAction === 'RESEND' ? resendTempPass : createUser)(tx, req);

      return {
        User: {
          Username: user.name,
          Attributes: [{ Name: 'email', Value: user.email }],
          UserStatus: user.status,
        },
      };
    }),
  deleteUser: (req: AdminDeleteUserTarget['reqBody']): Promise<AdminDeleteUserTarget['resBody']> =>
    transaction(async (tx) => {
      assert(req.Username);
      assert(req.UserPoolId);

      const user = await userQuery.findByName(tx, req.Username);
      const deletableId = adminMethod.deleteUser({ user, userPoolId: req.UserPoolId });

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
  setUserPassword: (
    req: AdminSetUserPasswordTarget['reqBody'],
  ): Promise<AdminSetUserPasswordTarget['resBody']> =>
    transaction(async (tx) => {
      assert(req.Username);

      const user = await userQuery.findByName(tx, req.Username);

      await userCommand.save(tx, adminMethod.setUserPassword({ user, req }));

      return {};
    }),
};
