import crypto from 'crypto';
import { infoBits } from './constants';
import { padHex } from './util';

export const calculateSignature = (params: {
  poolname: string;
  username: string;
  secretBlock: string;
  timestamp: string;
  scramblingParameter: Buffer;
  key: Buffer;
}): string => {
  const secretBlockBuffer = Buffer.from(params.secretBlock, 'base64');

  const prk = crypto
    .createHmac('sha256', Buffer.from(padHex(params.scramblingParameter), 'hex'))
    .update(Buffer.from(padHex(params.key), 'hex'))
    .digest();

  const hmac = crypto.createHmac('sha256', prk).update(infoBits).digest();
  const hkdf = hmac.subarray(0, 16);

  return crypto
    .createHmac('sha256', hkdf)
    .update(params.poolname)
    .update(params.username)
    .update(secretBlockBuffer)
    .update(params.timestamp)
    .digest('base64');
};
