import React, { PropsWithChildren, useEffect, useState } from 'react';
import { AnalyticsService } from './Analytics.service';
import { Analytics } from './Analytics';

export const AnalyticsContext = React.createContext<{
  services: AnalyticsService[];
}>({} as any);

export type AnalyticsWrapperProps = PropsWithChildren & {
  services: AnalyticsService[];
};

const initServices = async (...services: AnalyticsService[]) => {
  for (const service of services) {
    await service.init();
  }
};

export const AnalyticsWrapper = ({
  children,
  services,
}: AnalyticsWrapperProps) => {
  const [isReady, setReady] = useState(false);
  useEffect(() => {
    Analytics.registerServices(...services);
    initServices(...services).then(() => {
      setReady(true);
    });
  }, [services]);

  return (
    <AnalyticsContext.Provider value={{ services }}>
      {isReady ? children : <></>}
    </AnalyticsContext.Provider>
  );
};
