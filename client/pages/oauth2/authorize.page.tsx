import type { OAuthConfig } from '@aws-amplify/core';
import word from '@fakerjs/word';
import type { MaybeId } from 'common/types/brandedId';
import { Spacer } from 'components/Spacer';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { z } from 'zod';
import styles from './authorize.module.css';

export type Query = {
  redirect_uri: string;
  response_type: OAuthConfig['responseType'];
  client_id: MaybeId['userPoolClient'];
  identity_provider: string;
  scope: OAuthConfig['scopes'];
  state: string;
};

const AddAccount = (props: { provider: string; onBack: () => void }) => {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const data = z
    .object({
      email: z.string().email(),
      displayName: z.string(),
      photoUrl: z.literal('').or(z.string().url().optional()),
    })
    .safeParse({ email, displayName, photoUrl });
  const setFakeVals = () => {
    const fakeWord = word({ length: 8 });

    setEmail(`${fakeWord}@${props.provider.toLowerCase()}.com`);
    setDisplayName(fakeWord);
  };

  return (
    <div>
      <button className={styles.btn} onClick={setFakeVals}>
        Auto-generate user information
      </button>
      <Spacer axis="y" size={20} />
      <form>
        <div className={styles.inputLabel}>Email</div>
        <Spacer axis="y" size={4} />
        <input
          type="email"
          className={styles.textInput}
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <Spacer axis="y" size={16} />
        <div className={styles.inputLabel}>Display name (optional)</div>
        <Spacer axis="y" size={4} />
        <input
          type="text"
          className={styles.textInput}
          value={displayName}
          onChange={(e) => setDisplayName(e.currentTarget.value)}
        />
        <Spacer axis="y" size={16} />
        <div className={styles.inputLabel}>Profile photo URL (optional)</div>
        <Spacer axis="y" size={4} />
        <input
          type="text"
          className={styles.textInput}
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.currentTarget.value)}
        />
        <Spacer axis="y" size={24} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button className={styles.btn} onClick={props.onBack}>
            ← Back
          </button>
          <button type="submit" className={styles.submitBtn} disabled={!data.success}>
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
};

const Authorize = () => {
  const router = useRouter();
  const provider = z
    .enum(['Google', 'Apple', 'Amazon', 'Facebook'])
    .parse((router.query.identity_provider as string).replace(/^.+([A-Z][a-z]+)$/, '$1'));
  const [mode, setMode] = useState<'default' | 'add'>('default');

  return (
    <div className={styles.container}>
      <h1>Sign-in with {provider}</h1>
      <Spacer axis="y" size={8} />
      <div>No {provider} accounts exist in Magnito.</div>
      <Spacer axis="y" size={20} />
      {mode === 'default' ? (
        <button className={styles.btn} onClick={() => setMode('add')}>
          + Add new account
        </button>
      ) : (
        <AddAccount provider={provider} onBack={() => setMode('default')} />
      )}
    </div>
  );
};

export default Authorize;
