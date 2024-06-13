import crypto from 'crypto';
import { assert } from 'vitest';
import { N, calculatePrivateKey, g } from './srp';
import { toBuffer } from './srp/util';
export const genCredentials = (params: {
  poolId: string;
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
