import type { VerifiedUser } from '$/types'
import { LoadingOverlay } from '@mantine/core'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { pagesPath } from 'src/utils/$path'
import { apiClient } from 'src/utils/apiClient'
import { returnNull } from 'src/utils/returnNull'
import { createAuth } from '../utils/firebase'

export type AuthContextProps = {
  user: VerifiedUser | null
}

export type AuthProps = {
  children: ReactNode
}

const AuthContext = createContext<Partial<AuthContextProps>>({})

export const useAuthContext = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }: AuthProps) => {
  const router = useRouter()
  const [user, setUser] = useState<VerifiedUser | null>(null)
  const [isInitedAuth, setIsInitedAuth] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(createAuth(), async (fbUser) => {
      if (fbUser) {
        await fbUser.getIdToken().then((id) => apiClient.session.$post({ body: { id } }))
        await apiClient.me.$get().catch(returnNull).then(setUser)
      } else {
        await apiClient.session.$delete()
        setUser(null)
      }

      setIsInitedAuth(true)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!isInitedAuth) return

    const redirectToHome = async () => {
      router.pathname === pagesPath.login.$url().pathname && (await router.push(pagesPath.$url()))
    }
    const redirectToLogin = async () => {
      router.pathname === pagesPath.$url().pathname && (await router.push(pagesPath.login.$url()))
    }

    user ? redirectToHome() : redirectToLogin()
  }, [router, isInitedAuth, user])

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
      {!isInitedAuth && <LoadingOverlay visible overlayBlur={2} />}
    </AuthContext.Provider>
  )
}
