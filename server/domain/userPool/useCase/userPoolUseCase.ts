import assert from 'assert';
import type {
  CreateUserPoolClientTarget,
  CreateUserPoolTarget,
  ListUserPoolsTarget,
} from 'common/types/auth';
import { DEFAULT_USER_POOL_CLIENT_ID, DEFAULT_USER_POOL_ID } from 'service/envValues';
import { prismaClient, transaction } from 'service/prismaClient';
import { userPoolMethod } from '../model/userPoolMethod';
import { userPoolCommand } from '../repository/userPoolCommand';
import { userPoolQuery } from '../repository/userPoolQuery';

export const userPoolUseCase = {
  initDefaults: (): Promise<void> =>
    transaction(async (tx) => {
      await userPoolQuery
        .findById(prismaClient, DEFAULT_USER_POOL_ID)
        .catch(() =>
          userPoolCommand.save(
            tx,
            userPoolMethod.create({ id: DEFAULT_USER_POOL_ID, name: 'defaultPool' }),
          ),
        );

      await userPoolQuery.findClientById(prismaClient, DEFAULT_USER_POOL_CLIENT_ID).catch(() =>
        userPoolCommand.saveClient(
          tx,
          userPoolMethod.createClient({
            id: DEFAULT_USER_POOL_CLIENT_ID,
            userPoolId: DEFAULT_USER_POOL_ID,
            name: 'defaultPoolClient',
          }),
        ),
      );
    }),
  listUserPools: async (
    req: ListUserPoolsTarget['reqBody'],
  ): Promise<ListUserPoolsTarget['resBody']> => {
    const pools = await userPoolQuery.listAll(prismaClient, req.MaxResults);

    return { UserPools: pools.map((p) => ({ Id: p.id, Name: p.name })) };
  },
  createUserPool: (
    req: CreateUserPoolTarget['reqBody'],
  ): Promise<CreateUserPoolTarget['resBody']> =>
    transaction(async (tx) => {
      assert(req.PoolName);

      const pool = userPoolMethod.create({ name: req.PoolName });
      await userPoolCommand.save(tx, pool);

      return { UserPool: { Id: pool.id, Name: pool.name } };
    }),
  createUserPoolClient: (
    req: CreateUserPoolClientTarget['reqBody'],
  ): Promise<CreateUserPoolClientTarget['resBody']> =>
    transaction(async (tx) => {
      assert(req.ClientName);
      assert(req.UserPoolId);

      const pool = await userPoolQuery.findById(tx, req.UserPoolId);
      const client = userPoolMethod.createClient({ name: req.ClientName, userPoolId: pool.id });
      await userPoolCommand.saveClient(tx, client);

      return {
        UserPoolClient: { ClientId: client.id, UserPoolId: pool.id, ClientName: client.name },
      };
    }),
};
