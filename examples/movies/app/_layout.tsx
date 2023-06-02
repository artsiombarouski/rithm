import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import {
  ServiceContainer,
  ServiceContainerBootstrap,
} from '@artsiombarouski/rn-services';
import { rootServices, scopedServices } from '../services/Services';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import {
  NavigationServiceWrapper,
  useRouteGuard,
} from '@artsiombarouski/rn-expo-router-service';
import { observer } from 'mobx-react-lite';
import { observe } from 'mobx';
import { useUsers } from '../services/utils';
import { NativeBaseProvider } from 'native-base';

const RouteGuardLayout = observer((props: PropsWithChildren) => {
  const users = useUsers();
  useRouteGuard(
    {
      getRedirect: (segments) => {
        if (!users.currentUser && !segments.includes('(auth)')) {
          return '/login';
        }
        return null;
      },
    },

    [users.currentUser],
  );
  return <>{props.children}</>;
});

const ScopedLayout = (props: PropsWithChildren) => {
  const users = useUsers();
  const [currentContainer, setCurrentContainer] = useState<{
    userKey?: string;
    container: ServiceContainer;
  }>({
    userKey: users.currentUser?.key,
    container: scopedServices(),
  });

  useEffect(() => {
    const unsubscribe = observe(users, 'currentUser', (change) => {
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
  }, [users, currentContainer]);
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
      <NativeBaseProvider>
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
      </NativeBaseProvider>
    </PaperProvider>
  );
};

export default RootLayout;
