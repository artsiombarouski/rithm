import { Skeleton, useTheme, VStack } from 'native-base';

export const RithmGridSkeleton = () => {
  const theme = useTheme();
  return (
    <VStack minH={'100px'} flex={1} space={'sm'}>
      <Skeleton
        h={'200px'}
        borderRadius={theme.components.Card.baseStyle.borderRadius}
      />
      <Skeleton.Text />
    </VStack>
  );
};
