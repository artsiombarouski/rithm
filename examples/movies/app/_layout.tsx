import { FontsLoaderLayout } from '../components/root/FontsLoaderLayout';
import { rootServices, scopedServices } from '../services/Services';
import { useUsers } from '../services/utils';
import { AppThemeProvider } from '../theme';
import { AnalyticsWrapper } from '@artsiombarouski/rn-analytics';
import {
  AlertProvider,
  ModalDialogProvider,
} from '@artsiombarouski/rn-components';
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

const ExampleIcon = require('../assets/icon.png');

const ALERT_THEME = {
  info: {
    status: 'info',
  },
  error: {
    status: 'error',
  },
  success: {
    status: 'success',
  },
  sent: {
    status: 'success',
    iconSource: ExampleIcon,
  },
};

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
  const analyticsServices = [
    // new AmplitudeAnalyticsService({
    //   apiKey: 'YOUR_API_KEY',
    // }),
  ];
  return (
    <AnalyticsWrapper services={analyticsServices}>
      <FontsLoaderLayout>
        <ServiceContainerBootstrap container={servicesContainer}>
          <ScopedLayout>
            <NavigationServiceWrapper>
              <AppThemeProvider>
                <AlertProvider theme={ALERT_THEME}>
                  <ModalDialogProvider>
                    <Stack
                      screenOptions={{
                        headerShown: false,
                      }}
                    />
                  </ModalDialogProvider>
                </AlertProvider>
              </AppThemeProvider>
            </NavigationServiceWrapper>
          </ScopedLayout>
        </ServiceContainerBootstrap>
      </FontsLoaderLayout>
    </AnalyticsWrapper>
  );
};

export default RootLayout;
