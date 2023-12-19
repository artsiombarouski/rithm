import { RithmListFooterGlobal } from './RithmListFooter';
import {
  ShimmerPlaceholderView,
  useShimmerAnimation,
} from './ShimmerPlaceholder';
import { Box, VStack } from 'native-base';
import { interpolate, useDerivedValue } from 'react-native-reanimated';

export const RithmListSkeleton = () => {
  const animationValue = useShimmerAnimation();
  const titleValue = useDerivedValue(() => {
    return interpolate(animationValue.value, [0.0, 0.85, 1.0], [0, 1, 1]);
  });
  const contentValue = useDerivedValue(() => {
    return interpolate(animationValue.value, [0.0, 0.7, 1.0], [0, 1, 1]);
  });
  return (
    <VStack space={'sm'}>
      <ShimmerPlaceholderView
        animatedValue={animationValue}
        shimmerColors={RithmListFooterGlobal.shimmerColors}
        style={{
          height: 200,
          borderRadius: 8,
        }}
      />
      <Box maxW={'85%'}>
        <ShimmerPlaceholderView
          animatedValue={titleValue}
          shimmerColors={RithmListFooterGlobal.shimmerColors}
          style={{
            height: 20,
            borderRadius: 8,
          }}
        />
      </Box>
      <Box maxW={'70%'}>
        <ShimmerPlaceholderView
          animatedValue={contentValue}
          shimmerColors={RithmListFooterGlobal.shimmerColors}
          style={{
            height: 18,
            borderRadius: 8,
          }}
        />
      </Box>
    </VStack>
  );
};