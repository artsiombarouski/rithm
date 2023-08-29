import {
  Card,
  HStack,
  IBoxProps,
  ICardProps,
  Icon,
  IHeadingProps,
  IIconProps,
  Text,
  VStack,
} from 'native-base';
import React, { PropsWithChildren } from 'react';

export type ElementContainerProps = PropsWithChildren &
  ICardProps & {
    icon?: React.ComponentType<any>;
    iconProps?: IIconProps;
    iconColor?: string;
    title?: string;
    actions?: React.ReactElement;
    isDragging?: boolean;
    titleProps?: IHeadingProps;
    headerProps?: IBoxProps;
  };

export const ElementContainer = (props: ElementContainerProps) => {
  const {
    children,
    icon,
    iconProps,
    iconColor,
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
          {icon && (
            <Icon mr={2} size={6} {...iconProps}>
              {React.createElement(icon, {
                style: {
                  color: iconColor ?? 'black',
                },
              })}
            </Icon>
          )}
          {title && (
            <Text fontSize={16} fontWeight={'bold'} flex={1} {...titleProps}>
              {title}
            </Text>
          )}
          {actions}
        </HStack>
        {children}
      </VStack>
    </Card>
  );
};
