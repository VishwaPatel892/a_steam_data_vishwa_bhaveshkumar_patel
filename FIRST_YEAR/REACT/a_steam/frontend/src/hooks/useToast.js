import { useDispatch } from 'react-redux';
import { toast as reduxToast } from '../store/slices/uiSlice';
import { useCallback } from 'react';

const useToast = () => {
  const dispatch = useDispatch();

  const success = useCallback(
    (message, title) => dispatch(reduxToast.success(message, title)),
    [dispatch]
  );

  const error = useCallback(
    (message, title) => dispatch(reduxToast.error(message, title)),
    [dispatch]
  );

  const warning = useCallback(
    (message, title) => dispatch(reduxToast.warning(message, title)),
    [dispatch]
  );

  const info = useCallback(
    (message, title) => dispatch(reduxToast.info(message, title)),
    [dispatch]
  );

  return { success, error, warning, info };
};

export default useToast;
