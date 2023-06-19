import React, {
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ServiceContainer } from './ServiceContainer';

export const ServiceContext = React.createContext<{
  serviceContainer: ServiceContainer;
}>({} as any);

type Props = PropsWithChildren & {
  container: ServiceContainer;
  loading?: ReactNode;
  onLoaded?: () => void;
  testId?: string;
};

export function ServiceContainerBootstrap({
  children,
  container,
  loading,
  onLoaded,
  testId,
}: Props): any {
  const parentContext = useContext(ServiceContext);
  const [currentContainer, setCurrentContainer] = useState(null);

  useEffect(() => {
    if (currentContainer !== container) {
      container.parent = parentContext?.serviceContainer;
      container.init().then(() => {
        setCurrentContainer(container);
        onLoaded?.();
      });
    }
  }, [container]);

  if (process.env.NODE_ENV !== 'production') {
    if (typeof children === 'function' && loading) {
      console.error(
        'ServiceContainerBootstrap expects either a function child or loading prop, but not both. The loading prop will be ignored.',
      );
    }
  }
  if (!currentContainer) {
    return loading ?? <></>;
  }

  return (
    <ServiceContext.Provider
      value={{
        serviceContainer: currentContainer,
      }}
    >
      {children as any}
    </ServiceContext.Provider>
  );
}
