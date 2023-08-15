import { useCallback, useEffect, useRef, useState } from 'react';

export type UseRetryProps = {
  maxRetryCount?: number;
};

export function useRetry(props: UseRetryProps) {
  const { maxRetryCount = 5 } = props;
  const [retryCount, setRetryCount] = useState(0);
  const mounted = useRef(false);
  const retryCountRef = useRef(0);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const retry = useCallback(() => {
    const initialRetryCount = retryCount;
    setTimeout(() => {
      if (
        mounted &&
        retryCountRef.current < maxRetryCount &&
        initialRetryCount === retryCountRef.current
      ) {
        retryCountRef.current = retryCountRef.current + 1;
        setRetryCount((current) => current + 1);
      }
    }, 1000);
  }, [retryCount]);
  return { retry, retryCount };
}
