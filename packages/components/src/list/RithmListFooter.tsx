import { RithmGridSkeleton } from './RithmGridSkeleton';
import { RithmListSkeleton } from './RithmListSkeleton';
import { Box, HStack, Spinner, Text, VStack } from 'native-base';
import React, { Fragment, PropsWithChildren } from 'react';

export const RithmListFooterGlobal: {
  renderMore?: React.Component;
  shimmerColors?: string[];
} = {};

export type RithmListFooterProps = PropsWithChildren & {
  initialLoading?: boolean;
  hasMore?: boolean;
  numColumns?: number;
  spacing?: number;
  emptyComponent?:
    | React.ComponentType<any>
    | React.ReactElement
    | null
    | undefined;
  canShowEmpty?: boolean;
};

export const RithmListFooter = (props: RithmListFooterProps) => {
  const {
    initialLoading,
    hasMore,
    children,
    numColumns = 0,
    spacing = 8,
    emptyComponent,
    canShowEmpty,
  } = props;
  if (canShowEmpty) {
    if (emptyComponent) {
      if (typeof emptyComponent === 'function') {
        return React.createElement(emptyComponent);
      }
      return emptyComponent;
    }
    return (
      <Box alignItems={'center'} justifyContent={'center'}>
        <Text>No data</Text>
      </Box>
    );
  }
  if (initialLoading) {
    if (numColumns && numColumns > 0) {
      return (
        <VStack space={'md'} overflow={'hidden'}>
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
      <VStack space={'md'} overflow={'hidden'}>
        <RithmListSkeleton key={'sk1'} />
        <RithmListSkeleton key={'sk2'} />
        <RithmListSkeleton key={'sk3'} />
      </VStack>
    );
  }
  if (hasMore) {
    if (RithmListFooterGlobal.renderMore) {
      return React.createElement(RithmListFooterGlobal.renderMore as any);
    }
    return (
      <Box p={2} alignItems={'center'} justifyContent={'center'}>
        <Spinner />
      </Box>
    );
  }
  return <>{children}</>;
};