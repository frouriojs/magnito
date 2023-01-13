import { Button } from '@mui/material'
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
      <Button variant="contained">Hello World</Button>
    </>
  )
}

export default Home
