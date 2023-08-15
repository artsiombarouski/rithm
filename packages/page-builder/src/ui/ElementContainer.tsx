import {
  Card,
  Heading,
  HStack,
  IBoxProps,
  ICardProps,
  IHeadingProps,
  VStack,
} from 'native-base';
import React, { PropsWithChildren } from 'react';

export type ElementContainerProps = PropsWithChildren &
  ICardProps & {
    title?: string;
    actions?: React.ReactElement;
    isDragging?: boolean;
    titleProps?: IHeadingProps;
    headerProps?: IBoxProps;
  };

export const ElementContainer = (props: ElementContainerProps) => {
  const {
    children,
    title,
    actions,
    isDragging,
    titleProps,
    headerProps,
    ...restProps
  } = props;
  return (
    <Card
      borderWidth={1}
      borderStyle={'solid'}
      borderColor={'rgba(0,0,0,0.2)'}
      borderRadius={8}
      shadow={'none'}
      p={0}
      backgroundColor={'white'}
      {...restProps}
    >
      <VStack>
        <HStack
          pl={3}
          py={1}
          backgroundColor={'gray.200'}
          alignItems={'center'}
          {...headerProps}
        >
          {title && (
            <Heading size={'md'} flex={1} {...titleProps}>
              {title}
            </Heading>
          )}
          {actions}
        </HStack>
        {children}
      </VStack>
    </Card>
  );
};
