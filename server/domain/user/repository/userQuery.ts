import type { Prisma } from '@prisma/client';
import { USER_KINDS } from 'common/constants';
import type { MaybeId } from 'common/types/brandedId';
import type { CognitoUserEntity, SocialUserEntity, UserEntity } from 'common/types/user';
import { toCognitoUserEntity, toSocialUserEntity, toUserEntity } from './toUserEntity';

export const userQuery = {
  countId: (tx: Prisma.TransactionClient, id: string): Promise<number> =>
    tx.user.count({ where: { id } }),
  listSocials: (
    tx: Prisma.TransactionClient,
    userPoolClientId: MaybeId['userPoolClient'],
  ): Promise<SocialUserEntity[]> =>
    tx.user
      .findMany({
        where: {
          UserPool: { userPoolClients: { some: { id: userPoolClientId } } },
          kind: USER_KINDS.social,
        },
        include: { attributes: true },
      })
      .then((users) => users.map(toSocialUserEntity)),
  listCognitos: (tx: Prisma.TransactionClient, userPoolId: string): Promise<CognitoUserEntity[]> =>
    tx.user
      .findMany({ where: { userPoolId, kind: USER_KINDS.cognito }, include: { attributes: true } })
      .then((users) => users.map(toCognitoUserEntity)),
  findById: (
    tx: Prisma.TransactionClient,
    id: UserEntity['id'] | MaybeId['socialUser'],
  ): Promise<UserEntity> =>
    tx.user.findUniqueOrThrow({ where: { id }, include: { attributes: true } }).then(toUserEntity),
  findByName: (tx: Prisma.TransactionClient, name: string): Promise<CognitoUserEntity> =>
    tx.user
      .findFirstOrThrow({ where: { name }, include: { attributes: true } })
      .then(toCognitoUserEntity),
  findByRefreshToken: (tx: Prisma.TransactionClient, refreshToken: string): Promise<UserEntity> =>
    tx.user
      .findFirstOrThrow({ where: { refreshToken }, include: { attributes: true } })
      .then(toUserEntity),
  findByAuthorizationCode: (
    tx: Prisma.TransactionClient,
    authorizationCode: string,
  ): Promise<SocialUserEntity> =>
    tx.user
      .findFirstOrThrow({ where: { authorizationCode }, include: { attributes: true } })
      .then(toSocialUserEntity),
};
