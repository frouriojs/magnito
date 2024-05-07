import type { UserModel } from 'api/@types/models';
import { atom } from 'jotai';

export const userAtom = atom<UserModel | null>(null);
