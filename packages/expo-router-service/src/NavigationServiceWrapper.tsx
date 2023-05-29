import { useService } from '@artsiombarouski/rn-core';
import { PropsWithChildren, useEffect } from 'react';
import { NavigationService } from './Navigation.service';
import { useRouter } from 'expo-router';

export const NavigationServiceWrapper = (props: PropsWithChildren) => {
  const router = useRouter();
  const navigationService = useService(NavigationService);
  useEffect(() => {
    navigationService.setRouter(router);
  }, [router]);
  return <>{props.children}</>;
};
