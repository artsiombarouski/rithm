import { useFloating } from '@floating-ui/react-native';
import React, {
  ComponentType,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {
  Animated,
  ColorValue,
  LayoutRectangle,
  Modal,
  Platform,
} from 'react-native';
import { Defs, Mask, Rect, Svg } from 'react-native-svg';

import { Optional } from '../../../helpers/common';
import { vhDP, vwDP } from '../../../helpers/responsive';
import { ShapeProps } from '../../../helpers/shape';
import {
  BackdropPressBehavior,
  FloatingProps,
  Motion,
  OSConfig,
  Shape,
  SpotlightTourContext,
  TourStep,
} from '../../SpotlightTour.context';

import { OverlayView } from './TourOverlay.styles';
import { CircleShape } from './shapes/CircleShape.component';
import { RectShape } from './shapes/RectShape.component';

export interface TourOverlayRef {
  hideTooltip: () => Promise<Animated.EndResult>;
}

interface TourOverlayProps {
  backdropOpacity: number;
  color: ColorValue;
  floatingProps: FloatingProps;
  motion: Motion;
  nativeDriver: boolean | OSConfig<boolean>;
  onBackdropPress: Optional<BackdropPressBehavior>;
  padding: number;
  shape: Shape;
  spot: LayoutRectangle;
  tourStep?: TourStep | undefined;
}

export const TourOverlay = forwardRef<TourOverlayRef, TourOverlayProps>(
  (props, ref) => {
    const {
      backdropOpacity,
      color,
      floatingProps,
      motion,
      nativeDriver,
      onBackdropPress,
      padding,
      shape,
      spot,
      tourStep,
    } = props;

    const {
      currentStep,
      next,
      previous,
      close,
      setCurrentStep,
      addTourListener,
    } = useContext(SpotlightTourContext);
    const { refs, floatingStyles } = useFloating(
      tourStep?.floatingProps ?? floatingProps,
    );

    const tooltipOpacity = useRef(new Animated.Value(0));

    const stepMotion = useMemo((): Motion => {
      return tourStep?.motion ?? motion;
    }, [tourStep, motion]);

    const stepShape = useMemo((): Shape => {
      return tourStep?.shape ?? shape;
    }, [tourStep, shape]);

    const useNativeDriver = useMemo(() => {
      const driverConfig: OSConfig<boolean> =
        typeof nativeDriver === 'boolean'
          ? { android: nativeDriver, ios: nativeDriver, web: nativeDriver }
          : nativeDriver;

      return Platform.select({
        android: driverConfig.android,
        default: false,
        ios: driverConfig.ios,
        web: false,
      });
    }, [nativeDriver]);

    const ShapeMask = useMemo(<P extends ShapeProps>(): ComponentType<P> => {
      switch (stepShape) {
        case 'circle':
          return CircleShape;
        case 'rectangle':
          return RectShape;
      }
    }, [stepShape]);

    const handleBackdropPress = useCallback((): void => {
      console.log('handleBackdropPress');
      const handler = tourStep?.onBackdropPress ?? onBackdropPress;

      if (handler !== undefined && tourStep !== undefined) {
        switch (handler) {
          case 'continue':
            return next();

          case 'stop':
            return close();

          default:
            return handler({
              currentStep,
              next,
              previous,
              close,
              setCurrentStep,
              addTourListener,
            });
        }
      }
    }, [currentStep, tourStep, onBackdropPress, next, previous, stop]);

    useEffect(() => {
      const { height, width } = spot;

      if ([height, width].every((value) => value > 0)) {
        Animated.timing(tooltipOpacity.current, {
          delay: 400,
          duration: 400,
          toValue: 1,
          useNativeDriver,
        }).start();
      }
    }, [spot, useNativeDriver]);

    useImperativeHandle<TourOverlayRef, TourOverlayRef>(
      ref,
      () => ({
        hideTooltip: () => {
          return new Promise((resolve) => {
            if (tourStep !== undefined) {
              Animated.timing(tooltipOpacity.current, {
                duration: 400,
                toValue: 0,
                useNativeDriver,
              }).start(resolve);
            } else {
              resolve({ finished: true });
            }
          });
        },
      }),
      [tourStep, useNativeDriver],
    );

    return (
      <Modal
        animationType="fade"
        presentationStyle="overFullScreen"
        transparent={true}
        visible={tourStep !== undefined}
      >
        <OverlayView testID="Overlay View">
          <Svg
            testID="Spot Svg"
            height="100%"
            width="100%"
            viewBox={`0 0 ${vwDP(100)} ${vhDP(100)}`}
            onPress={handleBackdropPress}
            shouldRasterizeIOS={true}
            renderToHardwareTextureAndroid={true}
          >
            <Defs>
              <Mask id="mask" x={0} y={0} height="100%" width="100%">
                <Rect height="100%" width="100%" fill="#fff" />
                <ShapeMask
                  spot={spot}
                  setReference={refs.setReference}
                  motion={stepMotion}
                  padding={padding}
                  useNativeDriver={useNativeDriver}
                />
              </Mask>
            </Defs>
            <Rect
              height="100%"
              width="100%"
              fill={color}
              mask="url(#mask)"
              opacity={backdropOpacity}
            />
          </Svg>

          {tourStep && (
            <Animated.View
              ref={refs.setFloating}
              testID="Tooltip View"
              style={{ ...floatingStyles, opacity: tooltipOpacity.current }}
            >
              <>
                <tourStep.render
                  next={next}
                  previous={previous}
                  close={close}
                  currentStep={tourStep}
                  setCurrentStep={setCurrentStep}
                />
              </>
            </Animated.View>
          )}
        </OverlayView>
      </Modal>
    );
  },
);
