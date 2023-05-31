import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

export type UseRouteGuardProps = {
  getRedirect: (segments: string[]) => string | undefined | null;
};

export function useRouteGuard(props: UseRouteGuardProps, deps: any[] = []) {
  const { getRedirect } = props;
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const redirect = getRedirect(segments);
    if (redirect) {
      router.replace(redirect);
    }
  }, [segments, ...deps]);
}
