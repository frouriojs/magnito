import type { UserEntity } from 'api/@types/user';
import { atom } from 'jotai';

export const userAtom = atom<UserEntity | null>(null);
