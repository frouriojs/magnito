import type { VerifiedUser } from '$/types'
import { atom } from 'jotai'

export const userAtom = atom<VerifiedUser | null>(null)
