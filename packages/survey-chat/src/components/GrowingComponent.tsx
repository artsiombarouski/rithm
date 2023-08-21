import React, { ReactElement, useEffect } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { GetDimensions } from './GetDimensions';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  componentStyle?: StyleProp<ViewStyle>;
  componentWrapperStyle?: StyleProp<ViewStyle>;
  component: ReactElement;
  enteringDelay?: number;
  exitingDelay?: number;
  exitingDuration?: number;
  exiting?: boolean;
  typing?: boolean;
  logo?: ReactElement;
  enteringLogo?: boolean;
  showLogo?: boolean;
};

const TYPING_COMPONENT_HEIGHT = 44;

export const GrowingComponent = React.memo(
  ({
    containerStyle,
    componentWrapperStyle,
    componentStyle,
    component,
    enteringDelay = 0,
    exitingDuration = 200,
    exitingDelay = 0,
    exiting = false,
    typing = false,
    logo,
    enteringLogo = false,
    showLogo = false,
  }: Props) => {
    const height = useSharedValue(0);
    const open = useSharedValue(false);
    const openLogo = useSharedValue(false);

    useEffect(() => {
      if (exiting) {
        setTimeout(() => {
          open.value = false;
        }, exitingDelay);
      }
    }, [exiting]);

    useEffect(() => {
      if (typing) {
        height.value = TYPING_COMPONENT_HEIGHT;
        open.value = true;
        openLogo.value = true;
      }
    }, [typing]);

    const progress = useDerivedValue(() =>
      open.value
        ? withDelay(enteringDelay, withSpring(1, { overshootClamping: true }))
        : withTiming(0, { duration: exitingDuration }),
    );

    const logoProgress = useDerivedValue(
      () =>
        openLogo.value &&
        withDelay(enteringDelay, withSpring(1, { overshootClamping: true })),
    );

    const growingStyleCreator = (progressValue) =>
      useAnimatedStyle(() => ({
        height: height.value * progressValue.value,
        opacity: progressValue.value === 0 ? 0 : 1,
      }));

    const enteringStyleCreator = (progressValue) =>
      useAnimatedStyle(() => ({
        transform: [
          {
            translateY: interpolate(
              progressValue.value,
              [0.5, 1],
              [height.value, 0],
            ),
          },
        ],
      }));

    const MemoizedComponent = React.memo(() => (
      <View style={componentWrapperStyle}>
        <View style={componentStyle}>{component}</View>
      </View>
    ));

    const onDimensions = ({ height: _height }) => {
      if (height.value !== _height) {
        height.value = _height;
        open.value = true;
      }
    };

    return (
      <>
        {showLogo && (
          <Animated.View
            style={[
              styles.icon,
              enteringLogo && growingStyleCreator(logoProgress),
            ]}
          >
            <Animated.View
              style={enteringLogo && enteringStyleCreator(logoProgress)}
            >
              {logo}
            </Animated.View>
          </Animated.View>
        )}
        <Animated.View
          style={[
            styles.container,
            containerStyle,
            growingStyleCreator(progress),
          ]}
        >
          {!typing && (
            <GetDimensions
              component={<MemoizedComponent />}
              onDimensions={onDimensions}
            />
          )}
          <View style={[componentWrapperStyle, styles.enteringWrapper]}>
            <Animated.View
              style={[componentStyle, enteringStyleCreator(progress)]}
            >
              {component}
            </Animated.View>
          </View>
        </Animated.View>
      </>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  enteringWrapper: {
    position: 'absolute',
  },
  icon: {
    left: 16,
    width: '100%',
    bottom: 0,
    position: 'absolute',
    justifyContent: 'flex-end',
  },
});
