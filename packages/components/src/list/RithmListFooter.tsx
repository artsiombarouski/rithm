import { RithmGridSkeleton } from './RithmGridSkeleton';
import { RithmListSkeleton } from './RithmListSkeleton';
import { Box, HStack, Spinner, VStack } from 'native-base';
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
  renderMore?: any;
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
    renderMore,
  } = props;
  if (canShowEmpty) {
    if (emptyComponent) {
      if (React.isValidElement(emptyComponent)) {
        // emptyComponent is a JSX element
        return emptyComponent;
      } else {
        // emptyComponent is assumed to be a React component type
        return React.createElement(emptyComponent as React.ComponentType<any>);
      }
    }
    return <></>;
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
    if (renderMore) {
      return React.createElement(renderMore);
    }
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
