import type { ListUserPoolsTarget } from 'common/types/auth';
import { DEFAULT_USER_POOL_CLIENT_ID, DEFAULT_USER_POOL_ID } from 'service/envValues';
import { prismaClient } from 'service/prismaClient';
import { userPoolMethod } from '../model/userPoolMethod';
import { userPoolCommand } from '../repository/userPoolCommand';
import { userPoolQuery } from '../repository/userPoolQuery';

export const userPoolUseCase = {
  initDefaults: async (): Promise<void> => {
    const pool = userPoolMethod.create({ id: DEFAULT_USER_POOL_ID });
    const poolClient = userPoolMethod.createClient({
      id: DEFAULT_USER_POOL_CLIENT_ID,
      userPoolId: DEFAULT_USER_POOL_ID,
    });

    await userPoolCommand.save(pool);
    await userPoolCommand.saveClient(poolClient);
  },
  listUserPools: async (
    req: ListUserPoolsTarget['reqBody'],
  ): Promise<ListUserPoolsTarget['resBody']> => {
    const pools = await userPoolQuery.listAll(prismaClient, req.MaxResults);

    return { UserPools: pools.map((p) => ({ Id: p.id })) };
  },
};
