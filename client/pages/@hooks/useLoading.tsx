import { atom, useAtom } from 'jotai';
import { useCallback } from 'react';
import { Loading } from '../../components/Loading/Loading';

const countAtom = atom(0);
const loadingAtom = atom((get) => get(countAtom) > 0);

export const useLoading = () => {
  const [count, setCount] = useAtom(countAtom);
  const [loading] = useAtom(loadingAtom);
  const addLoading = useCallback(() => setCount(count + 1), [count, setCount]);
  const removeLoading = useCallback(() => setCount(count - 1), [count, setCount]);

  return {
    loadingElm: <Loading visible={loading} />,
    addLoading,
    removeLoading,
  };
};
