import { Space } from '@mantine/core'
import { useAtom } from 'jotai'
import Head from 'next/head'
import { Header } from 'src/components/organisms/Header'
import { userAtom } from './Atoms/user'

const Home = () => {
  const [user] = useAtom(userAtom)

  return (
    <>
      <Head>
        <title>next-frourio-starter</title>
        <meta name="description" content="next-frourio-starter" />
        <link rel="icon" href="favicon.ico" />
      </Head>
      {user && (
        <>
          <Header user={user} />
          <Space h={48} />
          <div css={{ fontSize: '80px', textAlign: 'center', fontWeight: 'bold' }}>
            Welcome to frourio!
          </div>
        </>
      )}
    </>
  )
}

export default Home
