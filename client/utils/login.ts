import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { createAuth } from 'utils/firebase';
import { returnNull } from './returnNull';

export const loginWithGitHub = async () => {
  const ghProvider = new GithubAuthProvider();
  ghProvider.addScope('read:user');

  await signInWithPopup(createAuth(), ghProvider).catch(returnNull);
};

export const logout = async () => {
  await createAuth().signOut();
};
