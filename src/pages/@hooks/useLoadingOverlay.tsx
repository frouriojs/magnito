import { LoadingOverlay } from '@mantine/core'
import { atom, useAtom } from 'jotai'
import { useCallback } from 'react'

const countAtom = atom(0)
const loadingAtom = atom((get) => get(countAtom) > 0)

export const useLoadingOverlay = () => {
  const [count, setCount] = useAtom(countAtom)
  const [loading] = useAtom(loadingAtom)
  const addLoading = useCallback(() => setCount(count + 1), [count, setCount])
  const removeLoading = useCallback(() => setCount(count - 1), [count, setCount])

  return {
    loadingOverlay: <LoadingOverlay visible={loading} overlayBlur={2} />,
    addLoading,
    removeLoading,
  }
}
