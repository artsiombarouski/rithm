import { FontsLoaderLayout } from '../components/root/FontsLoaderLayout';
import { rootServices, scopedServices } from '../services/Services';
import { useUsers } from '../services/utils';
import { AppThemeProvider } from '../theme';
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
import React, { PropsWithChildren, useEffect, useState } from 'react';

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
  const [servicesContainer] = useState(rootServices());
  return (
    <FontsLoaderLayout>
      <ServiceContainerBootstrap container={servicesContainer}>
        <ScopedLayout>
          <NavigationServiceWrapper>
            <AppThemeProvider>
              <ModalDialogProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                  }}
                />
              </ModalDialogProvider>
            </AppThemeProvider>
          </NavigationServiceWrapper>
        </ScopedLayout>
      </ServiceContainerBootstrap>
    </FontsLoaderLayout>
  );
};

export default RootLayout;
