import { Center, Text, View } from 'native-base';
import { LayoutRectangle } from 'react-native';
import { PropsWithChildren, useState } from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const AnimatedText = Animated.createAnimatedComponent(Text);

const PageWrapper = ({
  children,
  pageWidth,
  pageHeight,
  scrollOffset,
  index,
}: PropsWithChildren & {
  pageWidth: number;
  pageHeight: number;
  scrollOffset: SharedValue<number>;
  index: number;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const input = scrollOffset.value / pageHeight;
    const inputRange = [index - 1, index, index + 1];

    return {
      opacity: interpolate(input, inputRange, [0.0, 1, 0.0], Extrapolate.CLAMP),
    };
  });
  const innerContainerStyle = useAnimatedStyle(() => {
    const input = scrollOffset.value / pageHeight;
    const inputRange = [index - 1, index, index + 1];

    return {
      transform: [
        {
          translateY: interpolate(
            input,
            inputRange,
            [-pageHeight * 0.8, 0, pageHeight * 0.8],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });
  return (
    <Animated.View
      style={[
        {
          flex: 1,
          display: 'flex',
          maxWidth: pageWidth,
          maxHeight: pageHeight,
        },
        animatedStyle,
      ]}
    >
      <Animated.View
        style={[{ width: '100%', height: '100%' }, innerContainerStyle]}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
};

export default function PagerPage() {
  const [parentSize, setParentSize] = useState<LayoutRectangle>({} as any);

  const scrollOffset = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });

  const backgroundAnimation = useAnimatedStyle(() => {
    const input = scrollOffset.value / parentSize.height;
    const inputRange = [0, 1, 2];
    return {
      backgroundColor: interpolateColor(input, inputRange, [
        'red',
        'blue',
        'green',
      ]),
    };
  }, [parentSize.height]);

  return (
    <Animated.ScrollView
      style={[{ flex: 1 }, backgroundAnimation]}
      scrollEventThrottle={1}
      onLayout={(event) => {
        setParentSize(event.nativeEvent.layout);
      }}
      onScroll={scrollHandler}
      pagingEnabled={true}
      decelerationRate={'normal'}
    >
      <View key={'k1'} w={parentSize.width} h={parentSize.height}>
        <PageWrapper
          pageWidth={parentSize.width}
          pageHeight={parentSize.height}
          scrollOffset={scrollOffset}
          index={0}
        >
          <Center flex={1}>
            <AnimatedText fontWeight={'bold'} fontSize={124} style={{}}>
              Item 1
            </AnimatedText>
          </Center>
        </PageWrapper>
      </View>
      <View
        key={'k2'}
        w={parentSize.width}
        h={parentSize.height}
        backgroundColor={'blue'}
      >
        <PageWrapper
          pageWidth={parentSize.width}
          pageHeight={parentSize.height}
          scrollOffset={scrollOffset}
          index={1}
        >
          <Center flex={1}>
            <AnimatedText fontWeight={'bold'} fontSize={124}>
              Item 2
            </AnimatedText>
          </Center>
        </PageWrapper>
      </View>
      <View
        key={'k3'}
        w={parentSize.width}
        h={parentSize.height}
        backgroundColor={'blue'}
      >
        <PageWrapper
          pageWidth={parentSize.width}
          pageHeight={parentSize.height}
          scrollOffset={scrollOffset}
          index={2}
        >
          <Center flex={1}>
            <AnimatedText fontWeight={'bold'} fontSize={124}>
              Item 3
            </AnimatedText>
          </Center>
        </PageWrapper>
      </View>
    </Animated.ScrollView>
  );
}
