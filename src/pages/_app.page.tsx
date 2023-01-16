import { MantineProvider } from '@mantine/core'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { gaPageview } from 'src/utils/gtag'
import '../styles/globals.css'
import { AuthLoader } from './components/AuthLoader'
import { useLoadingOverlay } from './hooks/useLoadingOverlay'

function MyApp({ Component, pageProps }: AppProps) {
  const SafeHydrate = dynamic(() => import('../components/SafeHydrate'), { ssr: false })
  const router = useRouter()
  const { loadingOverlay } = useLoadingOverlay()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleRouteChange = (url: string, { shallow }: any) => {
      if (!shallow) gaPageview(url)
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'light' }}>
        <SafeHydrate>
          <Component {...pageProps} />
          {loadingOverlay}
          <AuthLoader />
        </SafeHydrate>
      </MantineProvider>
    </>
  )
}
export default MyApp
