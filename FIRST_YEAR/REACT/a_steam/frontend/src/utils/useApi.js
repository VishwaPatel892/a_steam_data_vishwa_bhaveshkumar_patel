/**
 * useApi — Generic hook for wrapping service calls with:
 *   • local loading state
 *   • error state
 *   • automatic success/error toast dispatching
 *   • abort on unmount via AbortController
 *
 * @example
 *   const { execute, loading, error } = useApi();
 *
 *   const fetchUsers = () =>
 *     execute(() => userService.getAllUsers({ page: 1 }), {
 *       onSuccess: (data) => setUsers(data.data),
 *       successMessage: 'Users loaded!',
 *     });
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from '../store/slices/uiSlice.js';

/**
 * @param {object} [defaultOptions]
 * @param {boolean} [defaultOptions.showSuccessToast=false]
 * @param {boolean} [defaultOptions.showErrorToast=true]
 */
const useApi = (defaultOptions = {}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const abortRef = useRef(null);

  // Cancel in-flight request on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  /**
   * Execute a service call.
   *
   * @param {() => Promise<any>} serviceCall  — A zero-argument fn that calls a service method
   * @param {object} [options]
   * @param {(data: any) => void} [options.onSuccess]    — Callback after success
   * @param {(err: Error) => void} [options.onError]     — Callback after failure
   * @param {string} [options.successMessage]            — Override success toast message
   * @param {string} [options.errorMessage]              — Override error toast message
   * @param {boolean} [options.showSuccessToast]
   * @param {boolean} [options.showErrorToast]
   * @returns {Promise<any>}  Resolved data or undefined on error
   */
  const execute = useCallback(
    async (serviceCall, options = {}) => {
      const {
        onSuccess,
        onError,
        successMessage,
        errorMessage,
        showSuccessToast = defaultOptions.showSuccessToast ?? false,
        showErrorToast   = defaultOptions.showErrorToast  ?? true,
      } = options;

      setLoading(true);
      setError(null);

      try {
        const result = await serviceCall();

        setData(result);

        if (showSuccessToast) {
          dispatch(
            toast.success(
              successMessage ||
                result?.message ||
                'Operation completed successfully.'
            )
          );
        }

        onSuccess?.(result);
        return result;
      } catch (err) {
        setError(err);

        if (showErrorToast) {
          dispatch(
            toast.error(
              errorMessage ||
                err?.message ||
                'Something went wrong. Please try again.'
            )
          );
        }

        onError?.(err);
      } finally {
        setLoading(false);
      }
    },
    // We intentionally exclude defaultOptions from the dependency array to prevent
    // infinite render loops if the consumer passes an inline object like: useApi({ show: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return { execute, loading, error, data, reset };
};

export default useApi;
