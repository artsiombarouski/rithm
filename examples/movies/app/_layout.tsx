import { rootServices, scopedServices } from '../services/Services';
import { useUsers } from '../services/utils';
import { ModalDialogProvider } from '@artsiombarouski/rn-components';
import {
  NavigationServiceWrapper,
  useRouteGuard,
} from '@artsiombarouski/rn-expo-router-service';
import {
  ServiceContainer,
  ServiceContainerBootstrap,
} from '@artsiombarouski/rn-services';
import { Stack } from 'expo-router';
import { observe } from 'mobx';
import { observer } from 'mobx-react-lite';
import { extendTheme, NativeBaseProvider } from 'native-base';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { DefaultTheme, PaperProvider } from 'react-native-paper';

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
      // key={currentContainer.userKey}
      container={currentContainer.container}
    >
      <RouteGuardLayout>{props.children}</RouteGuardLayout>
    </ServiceContainerBootstrap>
  );
};

const RootLayout = () => {
  const theme = extendTheme({
    components: {
      MenuItem: {
        baseStyle: {
          _stack: {
            width: '100%',
          },
        },
      },
    },
  });
  const [servicesContainer] = useState(rootServices());
  return (
    <PaperProvider theme={DefaultTheme}>
      <ServiceContainerBootstrap container={servicesContainer}>
        <ScopedLayout>
          <NavigationServiceWrapper>
            <NativeBaseProvider theme={theme}>
              <ModalDialogProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                  }}
                />
              </ModalDialogProvider>
            </NativeBaseProvider>
          </NavigationServiceWrapper>
        </ScopedLayout>
      </ServiceContainerBootstrap>
    </PaperProvider>
  );
};

export default RootLayout;
