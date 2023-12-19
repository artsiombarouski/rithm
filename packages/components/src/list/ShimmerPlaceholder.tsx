import LinearGradient from '../linear-gradient';
import { useTheme } from 'native-base';
import React, { PureComponent, useEffect } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import Animated, {
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  WithTimingConfig,
} from 'react-native-reanimated';

type ShimmerPlaceholderProps = {
  animatedValue: Animated.SharedValue<number>;
  width?: number;
  height?: number | string;
  shimmerWidthPercent?: number;
  shimmerColors?: string[];
  location?: number[];
  isReversed?: boolean;
  visible?: boolean;
  children?: any;
  style?: any;
  shimmerStyle?: any;
  contentStyle?: any;
  LinearGradient?: React.ComponentClass<any>;
  containerProps?: ViewProps;
  shimmerContainerProps?: ViewProps;
  childrenContainerProps?: ViewProps;
};

class ShimmerPlaceholder extends PureComponent<ShimmerPlaceholderProps> {
  render() {
    return <BasedShimmerPlaceholder {...this.props} />;
  }
}

export const BasedShimmerPlaceholder = (props: ShimmerPlaceholderProps) => {
  const {
    animatedValue,
    shimmerColors,
    isReversed = false,
    visible,
    location = [0.3, 0.5, 0.7],
    style,
    contentStyle,
    shimmerStyle,
    LinearGradient = View,
    children,
    containerProps,
    shimmerContainerProps,
    childrenContainerProps,
  } = props;
  const theme = useTheme();
  const targetColors = shimmerColors ?? [
    theme.colors.gray['100'],
    theme.colors.gray['50'],
  ];
  const viewSize = useSharedValue(0);
  const animationStyle = useAnimatedStyle(() => {
    if (viewSize.value === 0) {
      return {
        opacity: 0,
      };
    }
    return {
      opacity: interpolate(animatedValue.value, [0, 0.9, 1.0], [1, 1, 0]),
      transform: [
        {
          translateX: interpolate(
            animatedValue.value,
            [0, 1],
            isReversed
              ? [viewSize.value, -viewSize.value]
              : [-viewSize.value, viewSize.value],
          ),
        },
      ],
    };
  }, []);

  return (
    <View
      style={[styles.container, !visible && shimmerStyle, style]}
      onLayout={(e) => {
        viewSize.value = e.nativeEvent.layout.width;
      }}
      {...containerProps}
    >
      {/* Force render children to restrict rendering twice */}
      <View
        style={[
          !visible && { width: 0, height: 0, opacity: 0 },
          visible && contentStyle,
        ]}
        {...childrenContainerProps}
      >
        {children}
      </View>
      {!visible && (
        <View
          style={{ flex: 1, backgroundColor: targetColors[0] }}
          {...shimmerContainerProps}
        >
          <Animated.View style={[{ flex: 1 }, animationStyle]}>
            <LinearGradient
              colors={targetColors}
              style={{ flex: 1 }}
              start={{
                x: -1,
                y: 0.5,
              }}
              end={{
                x: 1,
                y: 0.5,
              }}
              locations={location}
            />
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

/**
 * To create ShimmerPlaceholder by Linear Gradient. Only useful when you use 3rd party,
 * For example: react-native-linear-gradient
 * @param {Linear Gradient Component} LinearGradient - 'expo-linear-gradient' by default
 *
 * @example
 *
 * import LinearGradient from 'react-native-linear-gradient';
 * import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
 *
 * const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient)
 *
 * ...
 *
 * <ShimmerPlaceHolder />
 */
export const createShimmerPlaceholder = (LinearGradient: any = View) =>
  React.forwardRef<ShimmerPlaceholder, ShimmerPlaceholderProps>(
    (props, ref) => (
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        ref={ref}
        {...props}
      />
    ),
  );

export const useShimmerAnimation = (props: WithTimingConfig = {}) => {
  const animationValue = useSharedValue(0);

  useEffect(() => {
    animationValue.value = withRepeat(
      withTiming(1.0, {
        duration: 3000,
        ...props,
      }),
      -1,
    );
    return () => {
      cancelAnimation(animationValue);
    };
  }, []);
  return animationValue;
};

export const ShimmerPlaceholderView = createShimmerPlaceholder(LinearGradient);