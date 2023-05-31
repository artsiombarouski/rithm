import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import {
  ServiceContainer,
  ServiceContainerBootstrap,
  useService,
} from '../../../packages/services';
import { rootServices, scopedServices } from '../services/Services';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import {
  NavigationServiceWrapper,
  useRouteGuard,
} from '@artsiombarouski/rn-expo-router-service';
import { AppUserStoreService } from '../services/AppUserStoreService';
import { observer } from 'mobx-react-lite';
import { observe } from 'mobx';

const RouteGuardLayout = observer((props: PropsWithChildren) => {
  const userService = useService(AppUserStoreService);
  useRouteGuard(
    {
      getRedirect: (segments) => {
        if (!userService.currentUser && !segments.includes('(auth)')) {
          return '/login';
        }
        return null;
      },
    },

    [userService.currentUser],
  );
  return <>{props.children}</>;
});

const ScopedLayout = (props: PropsWithChildren) => {
  const userStoreService = useService(AppUserStoreService);
  const [currentContainer, setCurrentContainer] = useState<{
    userKey?: string;
    container: ServiceContainer;
  }>({
    userKey: userStoreService.currentUser?.key,
    container: scopedServices(),
  });

  useEffect(() => {
    const unsubscribe = observe(userStoreService, 'currentUser', (change) => {
      const newKey = change.newValue?.key;
      if (newKey !== currentContainer?.userKey) {
        setCurrentContainer({
          userKey: newKey,
          container: scopedServices(),
        });
      }
    });
    return () => {
      unsubscribe();
    };
  }, [userStoreService, currentContainer]);
  return (
    <ServiceContainerBootstrap
      key={currentContainer.userKey}
      container={currentContainer.container}
    >
      <RouteGuardLayout>{props.children}</RouteGuardLayout>
    </ServiceContainerBootstrap>
  );
};

const RootLayout = () => {
  const [servicesContainer] = useState(rootServices());
  return (
    <PaperProvider theme={DefaultTheme}>
      <ServiceContainerBootstrap container={servicesContainer}>
        <ScopedLayout>
          <NavigationServiceWrapper>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </NavigationServiceWrapper>
        </ScopedLayout>
      </ServiceContainerBootstrap>
    </PaperProvider>
  );
};

export default RootLayout;
