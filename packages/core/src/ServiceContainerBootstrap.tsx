import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { ServiceContainer } from './ServiceContainer';

export const ServiceContext = React.createContext<{
  serviceContainer: ServiceContainer;
}>({} as any);

type Props = {
  children: ReactNode | ((state: boolean) => ReactNode);
  container: ServiceContainer;
  loading?: ReactNode;
  onLoaded?: () => void;
};

export function ServiceContainerBootstrap({
  children,
  container,
  loading,
  onLoaded,
}: Props): any {
  const parentContext = useContext(ServiceContext);
  const [isBootstrapped, setBootstrapped] = useState(container.isInitialized);

  useEffect(() => {
    container.parent = parentContext?.serviceContainer;
    container.init().then(() => {
      onLoaded?.();
      setBootstrapped(true);
    });
  }, []);

  if (process.env.NODE_ENV !== 'production') {
    if (typeof children === 'function' && loading) {
      console.error(
        'ServiceContainerBootstrap expects either a function child or loading prop, but not both. The loading prop will be ignored.',
      );
    }
  }
  if (typeof children === 'function') {
    return children(isBootstrapped) as any;
  }
  return (
    <ServiceContext.Provider
      value={{
        serviceContainer: container,
      }}
    >
      {isBootstrapped ? children : loading ?? <></>}
    </ServiceContext.Provider>
  );
}
