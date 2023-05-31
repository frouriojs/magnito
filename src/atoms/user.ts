import type { VerifiedUser } from '$/commonWithClient'
import { atom } from 'jotai'

export const userAtom = atom<VerifiedUser | null>(null)
