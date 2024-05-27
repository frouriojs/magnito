import { useAlert } from 'components/Alert/useAlert';
import { useCallback } from 'react';

export const useCatchApiErr = () => {
  const { setAlert } = useAlert();

  return useCallback(async () => {
    await setAlert('サーバーでエラーが発生しました。\n時間を空けて再度お試しください。');
    return null;
  }, [setAlert]);
};
