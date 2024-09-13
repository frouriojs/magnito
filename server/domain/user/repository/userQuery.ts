import type { Prisma } from '@prisma/client';
import { USER_KINDS } from 'common/constants';
import type { EntityId, MaybeId } from 'common/types/brandedId';
import type { CognitoUserEntity, SocialUserEntity } from 'common/types/user';
import { toCognitoUserEntity, toSocialUserEntity } from './toUserEntity';

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
    id: EntityId['cognitoUser'],
  ): Promise<CognitoUserEntity> =>
    tx.user
      .findUniqueOrThrow({ where: { id }, include: { attributes: true } })
      .then(toCognitoUserEntity),
  findByName: (tx: Prisma.TransactionClient, name: string): Promise<CognitoUserEntity> =>
    tx.user
      .findFirstOrThrow({ where: { name }, include: { attributes: true } })
      .then(toCognitoUserEntity),
  findByRefreshToken: (
    tx: Prisma.TransactionClient,
    refreshToken: string,
  ): Promise<CognitoUserEntity> =>
    tx.user
      .findFirstOrThrow({ where: { refreshToken }, include: { attributes: true } })
      .then(toCognitoUserEntity),
};
