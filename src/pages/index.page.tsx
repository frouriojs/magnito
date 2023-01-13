import { Button } from '@mantine/core'
import Head from 'next/head'

const Home = () => {
  return (
    <>
      <Head>
        <title>next-frourio-starter</title>
        <meta name="description" content="next-frourio-starter" />
        <link rel="icon" href="favicon.ico" />
      </Head>
      <span>next-frourio-starter</span>
      <Button>Hello World</Button>
    </>
  )
}

export default Home
