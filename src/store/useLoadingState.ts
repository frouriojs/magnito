import { atom, selector, useRecoilState } from 'recoil'

const loadingCounterState = atom({ key: 'loadingCounterState', default: 0 })

const loadingSelector = selector({
  key: 'loadingSelector',
  get: ({ get }) => get(loadingCounterState) > 0,
  set: ({ set }, loading) => set(loadingCounterState, (c) => c + (loading ? 1 : -1)),
})

export const useLoadingState = () => {
  const [loading, setLoading] = useRecoilState(loadingSelector)

  return { loading, setLoading }
}
