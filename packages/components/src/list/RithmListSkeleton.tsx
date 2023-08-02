import { Skeleton, useTheme, VStack } from 'native-base';

export const RithmListSkeleton = () => {
  const theme = useTheme();
  return (
    <VStack space={'sm'}>
      <Skeleton
        h={'200px'}
        borderRadius={theme.components.Card.baseStyle.borderRadius}
      />
      <Skeleton.Text />
    </VStack>
  );
};
