import React, { PropsWithChildren, useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { ServiceContainerBootstrap, useService } from '@artsiombarouski/rn-core';
import { rootServices, scopedServices } from '../services/Services';
import { NavigationService } from '../services/Navigation.service';
import { DefaultTheme, PaperProvider } from 'react-native-paper';

const NavigationLayout = (props: PropsWithChildren) => {
  const router = useRouter();
  const navigationService = useService(NavigationService);
  useEffect(() => {
    navigationService.setRouter(router);
  }, [router]);
  return <>{props.children}</>;
};

const ScopedLayout = (props: PropsWithChildren) => {
  return (
    <ServiceContainerBootstrap container={scopedServices}>
      {props.children}
    </ServiceContainerBootstrap>
  );
};

const RootLayout = () => {
  return (
    <PaperProvider theme={DefaultTheme}>
      <ServiceContainerBootstrap container={rootServices}>
        <ScopedLayout>
          <NavigationLayout>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </NavigationLayout>
        </ScopedLayout>
      </ServiceContainerBootstrap>
    </PaperProvider>
  );
};

export default RootLayout;
