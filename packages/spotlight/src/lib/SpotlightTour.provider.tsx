import { flip, offset, shift } from '@floating-ui/react-native';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ColorValue, LayoutRectangle } from 'react-native';

import { ChildFn, isChildFunction } from '../helpers/common';

import {
  BackdropPressBehavior,
  FloatingProps,
  Motion,
  OnSpotlightTourComplete,
  OSConfig,
  Shape,
  SpotlightTour,
  SpotlightTourContext,
  SpotlightTourCtx,
  StopParams,
  TourStep,
  ZERO_SPOT,
} from './SpotlightTour.context';
import {
  TourOverlay,
  TourOverlayRef,
} from './components/tour-overlay/TourOverlay.component';

export interface SpotlightTourProviderProps {
  /**
   * The children to render in the provider. It accepts either a React
   * component, or a function that returns a React component. When the child is
   * a funtion, the `SpotlightTour` context can be accessed from the first
   * argument.
   */
  children: React.ReactNode | ChildFn<SpotlightTour>;
  /**
   * Specifies {@link FloatingProps} in order to configure Floating UI
   * in all tour steps layout.
   *
   * @default middlewares: [flip(), offset(4), shift()]
   * @default placement: "bottom"
   */
  floatingProps?: FloatingProps;
  /**
   * Sets the default transition motion for all steps. You can override this
   * value on each step too.
   *
   * @default bounce
   */
  motion?: Motion;
  /**
   * Define if the animations in the tour should use the native driver or not.
   * A boolean can be used to apply the same value to both Android and iOS, or
   * an object with `android` and `ios` keys can be used to define a value for
   * each OS.
   *
   * @default false
   */
  nativeDriver?: boolean | OSConfig<boolean>;
  /**
   * Sets the default behavior of pressing the tour's backdrop. You can use
   * either one of the following values:
   * - A callback function with the {@link SpotlightTour} options object in the
   * first argument. This allows more franular control over the tour.
   * - The `continue` literal string, which is a shortcut to move to the next
   * step, and stop the tour on the last step.
   * - the `stop` literal string, which is a shortcut to stop the tour.
   *
   * **NOTE:** You can also override this behavior on each step configuration.
   */
  onBackdropPress?: BackdropPressBehavior;
  /**
   * Handler which gets executed when {@link SpotlightTour.stop|stop} is
   * invoked. It receives the {@link StopParams} so
   * you can access the `current` step index where the tour stopped
   * and a bool value `isLast` indicating if the step where the tour stopped is
   * the last one.
   */
  onComplete?: (lastStep: TourStep) => void;
  /**
   * The color of the overlay of the tour.
   *
   * @default black
   */
  overlayColor?: ColorValue;
  /**
   * The opacity applied to the overlay of the tour (between 0 to 1).
   *
   * @default 0.45
   */
  overlayOpacity?: number;
  /**
   * Sets the default spotlight shape for all steps. You can override this
   * value on each step too.
   *
   * @default circle
   */
  shape?: Shape;
  /**
   * Defines the padding of the spot shape based on the wrapped component, so a
   * zero padding means the spot shape will fit exaclty around the wrapped
   * component. The padding value is a number in points.
   *
   * @default 16;
   */
  spotPadding?: number;
}

let listenerId = 0;

/**
 * React provider component to get access to the SpotlightTour context.
 */
export const SpotlightTourProvider = forwardRef<
  SpotlightTour,
  SpotlightTourProviderProps
>((props, ref) => {
  const {
    children,
    floatingProps = {
      middleware: [flip(), offset(4), shift()],
      placement: 'bottom',
    },
    motion = 'bounce',
    nativeDriver = true,
    onBackdropPress,
    onComplete,
    overlayColor = 'black',
    overlayOpacity = 0.45,
    shape = 'circle',
    spotPadding = 16,
  } = props;

  const [currentStep, setCurrentStep] = useState<TourStep>(undefined);
  const [spot, setSpot] = useState(ZERO_SPOT);
  const overlay = useRef<TourOverlayRef>({
    hideTooltip: () => Promise.resolve({ finished: false }),
  });
  const listeners = useRef<{ [key: number]: OnSpotlightTourComplete }>({});
  const addListener = useCallback((listener: OnSpotlightTourComplete) => {
    const id = ++listenerId;
    listeners.current[id] = listener;
    return () => {
      delete listeners.current[id];
    };
  }, []);

  const handleSetCurrentStep = useCallback(
    (step?: TourStep) => {
      if (step) {
        Promise.all([
          overlay.current.hideTooltip(),
          Promise.resolve().then(step.before),
        ]).then(() => {
          setSpot(ZERO_SPOT);
          setCurrentStep(step);
        });
      } else if (currentStep) {
        onComplete?.(currentStep);
        Object.values(listeners.current).forEach((e) => {
          e(currentStep);
        });
        setCurrentStep(undefined);
      }
    },
    [onComplete, currentStep, setCurrentStep],
  );

  const changeSpot = useCallback((newSpot: LayoutRectangle): void => {
    setSpot(newSpot);
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep) {
      handleSetCurrentStep(currentStep?.next?.());
    }
  }, [handleSetCurrentStep, currentStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep) {
      handleSetCurrentStep(currentStep?.previous?.());
    }
  }, [handleSetCurrentStep, currentStep]);

  const handleClose = useCallback(() => {
    if (currentStep) {
      setCurrentStep(undefined);
    }
  }, [setCurrentStep, currentStep]);

  const tour = useMemo(
    (): SpotlightTourCtx => ({
      next: handleNext,
      previous: handlePrevious,
      close: handleClose,
      changeSpot,
      currentStep,
      setCurrentStep: handleSetCurrentStep,
      addTourListener: addListener,
      spot,
    }),
    [changeSpot, currentStep, handleSetCurrentStep, spot],
  );

  useImperativeHandle(ref, () => ({
    next: handleNext,
    previous: handlePrevious,
    close: handleClose,
    currentStep,
    setCurrentStep: handleSetCurrentStep,
    addTourListener: addListener,
  }));

  return (
    <SpotlightTourContext.Provider value={tour}>
      {isChildFunction(children) ? (
        <SpotlightTourContext.Consumer>
          {children}
        </SpotlightTourContext.Consumer>
      ) : (
        <>{children}</>
      )}

      <TourOverlay
        backdropOpacity={overlayOpacity}
        color={overlayColor}
        floatingProps={floatingProps}
        motion={motion}
        nativeDriver={nativeDriver}
        onBackdropPress={onBackdropPress}
        padding={spotPadding}
        ref={overlay}
        shape={shape}
        spot={spot}
        tourStep={currentStep}
      />
    </SpotlightTourContext.Provider>
  );
});
