import { Space } from '@mantine/core'
import { useAtom } from 'jotai'
import { BasicHeader } from 'src/components/organisms/BasicHeader'
import { userAtom } from '../atoms/user'

const Home = () => {
  const [user] = useAtom(userAtom)

  return (
    user && (
      <>
        <BasicHeader user={user} />
        <Space h={48} />
        <div css={{ fontSize: '80px', textAlign: 'center', fontWeight: 'bold' }}>
          Welcome to frourio!
        </div>
      </>
    )
  )
}

export default Home
