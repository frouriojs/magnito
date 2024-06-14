import { DEFAULT_USER_POOL_CLIENT_ID, DEFAULT_USER_POOL_ID } from 'service/envValues';
import { userPoolMethod } from '../model/userPoolMethod';
import { userPoolCommand } from '../repository/userPoolCommand';

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
};
