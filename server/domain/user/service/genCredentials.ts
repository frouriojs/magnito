import type { EntityId } from 'api/@types/brandedId';
import assert from 'assert';
import crypto from 'crypto';
import { g, N } from './srp/constants';
import { calculatePrivateKey, toBuffer } from './srp/util';

export const genCredentials = (params: {
  poolId: EntityId['userPool'];
  username: string;
  password: string;
}): { salt: string; verifier: string } => {
  const salt = crypto.randomBytes(16).toString('hex');
  // extract pool name from poolId (poolId format: userPoolId_poolName)
  const poolName = params.poolId.split('_')[1];
  assert(poolName, 'Invalid poolId');
  const privateKey = calculatePrivateKey(poolName, params.username, params.password, salt);
  // verifier = g^privateKey % N
  const verifier = toBuffer(g.modPow(privateKey, N)).toString('hex');
  return { salt, verifier };
};
