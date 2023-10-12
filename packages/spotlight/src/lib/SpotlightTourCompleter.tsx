import {
  OnSpotlightTourComplete,
  useSpotlightTour,
} from './SpotlightTour.context';
import { PropsWithChildren, useEffect } from 'react';

export type SpotlightTourCompleterProps = PropsWithChildren & {
  onComplete?: OnSpotlightTourComplete;
};

export const SpotlightTourCompleter = (props: SpotlightTourCompleterProps) => {
  const { onComplete, children } = props;
  const spotlight = useSpotlightTour();
  useEffect(() => {
    if (!onComplete) {
      return;
    }
    const unsubscribe = spotlight.addTourListener(onComplete);
    return () => {
      unsubscribe();
    };
  }, [onComplete]);
  return <>{children}</>;
};
