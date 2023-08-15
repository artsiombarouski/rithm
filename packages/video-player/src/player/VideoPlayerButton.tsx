import { VideoPlayerIcon } from './VideoPlayerIcon';
import { isUndefined } from 'lodash';
import React from 'react';
import {
  Platform,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Animated, {
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const SCALE_PERCENT = Platform.select({
  default: -0.15,
  web: 0.2,
});

const springConfig = Platform.select({
  web: {
    damping: 140,
    stiffness: 420,
    mass: 1,
    velocity: 0,
  },
  default: {
    damping: 10,
    stiffness: 500,
    mass: 0.3,
    velocity: 0,
  },
});

const darkThemeColors = ['rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.6)'];
const lightThemeColors = [
  'rgba(255, 255, 255, 0.3)',
  'rgba(255, 255, 255, 0.5)',
];
const lightestThemeColors = [
  'rgba(255, 255, 255, 0.12)',
  'rgba(255, 255, 255, 0.32)',
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type VideoPlayerButtonProps = Animated.AnimateProps<PressableProps> & {
  icon?: React.ComponentType<any>;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  large?: boolean;
  dark?: boolean;
  loading?: boolean;
  backgroundColors?: string[];
  uiVisibilityValue?: SharedValue<number>;
};

export const VideoPlayerButton = (props: VideoPlayerButtonProps) => {
  const {
    icon,
    onPress,
    style,
    large,
    dark,
    loading,
    backgroundColors,
    uiVisibilityValue,
    ...restProps
  } = props;
  const animationValue = useSharedValue(0);
  const scaleValue = useDerivedValue(() => {
    return 1 + animationValue.value * SCALE_PERCENT;
  });
  const backgroundValue = useDerivedValue(() => {
    return withTiming(animationValue.value, { duration: 100 });
  });

  const backgroundStyle =
    !isUndefined(uiVisibilityValue) &&
    useAnimatedStyle(() => {
      const backgroundColor = interpolateColor(
        uiVisibilityValue.value,
        [0, 1],
        [lightestThemeColors[0], lightThemeColors[0]],
      );
      return {
        backgroundColor: withTiming(backgroundColor, { duration: 100 }),
      };
    });

  const animatedBackgroundColors = isUndefined(uiVisibilityValue)
    ? { value: backgroundColors ?? (dark ? darkThemeColors : lightThemeColors) }
    : useDerivedValue(() => {
        const color1 = interpolateColor(
          uiVisibilityValue.value,
          [0, 1],
          [lightestThemeColors[0], lightThemeColors[0]],
        );
        const color2 = interpolateColor(
          uiVisibilityValue.value,
          [0, 1],
          [lightestThemeColors[1], lightThemeColors[1]],
        );

        return [color1, color2];
      });

  const pressAnimationStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      backgroundValue.value,
      [0, 1],
      animatedBackgroundColors.value,
    );
    return {
      backgroundColor,
      transform: [
        {
          scale: withSpring(scaleValue.value, springConfig),
        },
      ],
    };
  });

  return (
    <AnimatedPressable
      onPress={loading ? undefined : onPress}
      onPressIn={() => (animationValue.value = 1)}
      onPressOut={() => (animationValue.value = 0)}
      // @ts-ignore
      onMouseEnter={() => {
        animationValue.value = 1;
      }}
      // @ts-ignore
      onMouseLeave={() => {
        animationValue.value = 0;
      }}
      style={[
        styles.container,
        {
          backgroundColor:
            backgroundColors?.[0] ??
            (dark ? darkThemeColors[0] : lightThemeColors[0]),
        },
        large && styles.large,
        backgroundStyle,
        pressAnimationStyle,
        style,
      ]}
      {...restProps}
    >
      {loading ? (
        <ActivityIndicator color={'white'} size={large ? 32 : 24} />
      ) : (
        <VideoPlayerIcon source={icon} color={'white'} size={large ? 32 : 24} />
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  large: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});
