import crypto from 'crypto';
import { BigInteger } from 'jsbn';
import { HASH_TYPE, Nbytes } from './constants';

export const getHash = (data: Buffer | string, length: number): string => {
  const hash = crypto.createHash(HASH_TYPE).update(data).digest('hex');

  return hash.padStart(length * 2, '0');
};

export const calculatePrivateKey = (
  poolname: string,
  username: string,
  password: string,
  salt: string,
): BigInteger => {
  const hash = getHash(`${poolname}${username}:${password}`, 32);
  const buffer = Buffer.from(salt + hash, 'hex');
  return new BigInteger(getHash(buffer, 32), 16);
};

export const toBuffer = (bigInt: BigInteger): Buffer => {
  return Buffer.from(bigInt.toString(16).padStart(Nbytes * 2, '0'), 'hex');
};
