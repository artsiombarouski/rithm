import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Platform,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

export type TypingIndicatorProps = {
  style?: StyleProp<ViewStyle>;
  dotStyle?: StyleProp<ViewStyle>;
  dotSize?: number;
  duration?: number;
};

export const TypingIndicator = (props: TypingIndicatorProps) => {
  const {
    style,
    dotStyle,
    dotSize = 5,
    duration = Platform.OS === 'ios' ? 300 : 400,
  } = props;
  const animation1 = useRef(new Animated.Value(0)).current;
  const animation2 = useRef(new Animated.Value(0)).current;
  const animation3 = useRef(new Animated.Value(0)).current;

  const easing = Easing.bezier(0.37, 0, 0.63, 1);
  const startDelay = duration * 0.4;

  const createInAnimation = (value) => {
    return Animated.timing(value, {
      toValue: 1.0,
      easing: easing,
      duration: duration,
      useNativeDriver: true,
    });
  };

  const createOutAnimation = (value) => {
    return Animated.timing(value, {
      toValue: 0.0,
      easing: easing,
      duration: duration,
      useNativeDriver: true,
    });
  };

  useEffect(() => {
    Animated.loop(
      Animated.stagger(startDelay, [
        Animated.sequence([
          createInAnimation(animation1),
          createOutAnimation(animation1),
        ]),
        Animated.sequence([
          createInAnimation(animation2),
          createOutAnimation(animation2),
        ]),
        Animated.sequence([
          createInAnimation(animation3),
          createOutAnimation(animation3),
        ]),
      ]),
      {},
    ).start();
  }, []);

  const initialOffset = dotSize;

  const createDotAnimation = (value) => {
    return value.interpolate({
      inputRange: [0, 1],
      outputRange: [initialOffset, 0],
    });
  };

  const dot1Position = createDotAnimation(animation1);
  const dot2Position = createDotAnimation(animation2);
  const dot3Position = createDotAnimation(animation3);

  const containerStyle: StyleProp<ViewStyle> = [
    {
      display: 'flex',
      flexDirection: 'row',
      paddingHorizontal: 4,
      height: dotSize * 2,
    },
    style,
  ];

  const dotStyleMerged: StyleProp<ViewStyle> = [
    {
      backgroundColor: 'black',
      width: dotSize,
      height: dotSize,
      borderRadius: dotSize / 2,
      marginHorizontal: 4,
    },
    dotStyle,
  ];

  return (
    <View style={containerStyle}>
      <Animated.View
        style={[dotStyleMerged, { transform: [{ translateY: dot1Position }] }]}
      />
      <Animated.View
        style={[dotStyleMerged, { transform: [{ translateY: dot2Position }] }]}
      />
      <Animated.View
        style={[dotStyleMerged, { transform: [{ translateY: dot3Position }] }]}
      />
    </View>
  );
};
