import type { UserEntity } from 'api/@types/user';
import { userMethod } from 'domain/user/model/userMethod';
import { userCommand } from 'domain/user/repository/userCommand';
import { genCredentials } from 'domain/user/service/genCredentials';
import { genTokens } from 'domain/user/service/genTokens';
import { userPoolQuery } from 'domain/userPool/repository/userPoolQuery';
import { DEFAULT_USER_POOL_CLIENT_ID, DEFAULT_USER_POOL_ID } from 'service/envValues';
import { prismaClient } from 'service/prismaClient';
import { genJwks } from 'service/privateKey';
import { defineController } from './$relay';

// サインアップフローを省略してテストを書くためのエンドポイント
// 200行まではcontrollerにべた書きで良い
export default defineController(() => ({
  post: async ({ body }) => {
    const { salt, verifier } = genCredentials({
      poolId: DEFAULT_USER_POOL_ID,
      username: body.username,
      password: body.password,
    });
    const user: UserEntity = {
      ...userMethod.createUser({
        name: body.username,
        email: body.email,
        salt,
        verifier,
        userPoolId: DEFAULT_USER_POOL_ID,
      }),
      verified: true,
    };

    await userCommand.save(prismaClient, user);

    const pool = await userPoolQuery.findById(prismaClient, DEFAULT_USER_POOL_ID);
    const jwks = await genJwks(pool.privateKey);
    const tokens = genTokens({
      privateKey: pool.privateKey,
      userPoolClientId: DEFAULT_USER_POOL_CLIENT_ID,
      jwks,
      user,
    });

    return {
      status: 200,
      body: { ...tokens, ExpiresIn: 3600, RefreshToken: user.refreshToken, TokenType: 'Bearer' },
    };
  },
}));
