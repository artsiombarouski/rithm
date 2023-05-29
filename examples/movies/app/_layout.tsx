import React, { PropsWithChildren } from 'react';
import { Stack } from 'expo-router';
import { ServiceContainerBootstrap } from '@artsiombarouski/rn-core';
import { rootServices, scopedServices } from '../services/Services';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import { NavigationServiceWrapper } from '@artsiombarouski/rn-expo-router-service';

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
