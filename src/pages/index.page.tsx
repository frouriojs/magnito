import { LoadingOverlay, Space } from '@mantine/core'
import Head from 'next/head'
import { Header } from 'src/components/organisms/Header'
import { useAuthContext } from 'src/context/AuthContext'

const Home = () => {
  const { user } = useAuthContext()

  return (
    <>
      <Head>
        <title>next-frourio-starter</title>
        <meta name="description" content="next-frourio-starter" />
        <link rel="icon" href="favicon.ico" />
      </Head>
      {user ? (
        <>
          <Header user={user} />
          <Space h={48} />
          <div css={{ fontSize: '80px', textAlign: 'center', fontWeight: 'bold' }}>
            Welcome to frourio!
          </div>
        </>
      ) : (
        <LoadingOverlay visible />
      )}
    </>
  )
}

export default Home
