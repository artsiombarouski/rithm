import { Box, HStack, Spinner, VStack } from 'native-base';
import { Fragment, PropsWithChildren } from 'react';
import { RithmListSkeleton } from './RithmListSkeleton';
import { RithmGridSkeleton } from './RithmGridSkeleton';

export type RithmListFooterProps = PropsWithChildren & {
  initialLoading?: boolean;
  hasMore?: boolean;
  numColumns?: number;
  spacing?: number;
};

export const RithmListFooter = (props: RithmListFooterProps) => {
  const {
    initialLoading,
    hasMore,
    children,
    numColumns = 0,
    spacing = 8,
  } = props;
  if (initialLoading) {
    if (numColumns && numColumns > 0) {
      return (
        <VStack space={'md'}>
          <HStack space={`${spacing}px`}>
            {Array(numColumns)
              .fill(<RithmGridSkeleton />)
              .map((e, index) => {
                return <Fragment key={`sk${index}`}>{e}</Fragment>;
              })}
          </HStack>
        </VStack>
      );
    }
    return (
      <VStack space={'md'}>
        <RithmListSkeleton key={'sk1'} />
        <RithmListSkeleton key={'sk2'} />
        <RithmListSkeleton key={'sk3'} />
      </VStack>
    );
  }
  if (hasMore) {
    return (
      <Box p={2} alignItems={'center'} justifyContent={'center'}>
        <Spinner />
      </Box>
    );
  }
  return <>{children}</>;
};
