import type { Jwks } from 'api/@types/auth';
import { createPublicKey, generateKeyPairSync } from 'crypto';
import { JWK } from 'node-jose';

export const genPrivatekey = (): string => {
  const { privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  return privateKey;
};

export const genJwks = async (privateKey: string): Promise<Jwks> => {
  const keystore = JWK.createKeyStore();
  const publicKey = createPublicKey(privateKey);
  await keystore.add(publicKey.export({ type: 'spki', format: 'pem' }), 'pem', {
    alg: 'RS256',
    use: 'sig',
  });

  return keystore.toJSON(true) as Jwks;
};
