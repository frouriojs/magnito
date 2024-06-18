import crypto from 'crypto';
import { BigInteger } from 'jsbn';
import { N, g, multiplierParam } from './constants';
import { fromBuffer, toBuffer } from './util';

export const calculateSrpB = (
  v: string,
): {
  b: string;
  B: string;
} => {
  const b = crypto.randomBytes(32);
  const bInt = fromBuffer(b);
  const vInt = new BigInteger(v, 16);
  // kv + g^b
  const B = toBuffer(multiplierParam.multiply(vInt).add(g.modPow(bInt, N)).mod(N));
  return { b: b.toString('hex'), B: B.toString('hex') };
};
