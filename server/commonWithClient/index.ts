import type { VerifiedUserId } from './branded'

export type VerifiedUser = {
  id: VerifiedUserId
  email: string
  displayName: string | undefined
  photoURL: string | undefined
}
