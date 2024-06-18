import type { EntityId } from 'api/@types/brandedId';
import crypto from 'crypto';
import { g, N, Nbytes } from './srp/constants';
import { calculatePrivateKey, getPoolName, toBufferWithLength } from './srp/util';

export const genCredentials = (params: {
  poolId: EntityId['userPool'];
  username: string;
  password: string;
  salt?: string;
}): { salt: string; verifier: string } => {
  const salt = params.salt || crypto.randomBytes(16).toString('hex');
  // extract pool name from poolId (poolId format: userPoolId_poolName)
  const poolName = getPoolName(params.poolId);
  const privateKey = calculatePrivateKey(poolName, params.username, params.password, salt);
  // verifier = g^privateKey % N
  const verifier = toBufferWithLength(g.modPow(privateKey, N), Nbytes).toString('hex');
  return { salt, verifier };
};
