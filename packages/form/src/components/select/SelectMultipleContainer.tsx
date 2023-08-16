import React, { PropsWithChildren, useRef } from 'react';
import { useHover } from '@react-native-aria/interactions';
import {
  Box,
  extractInObject,
  Stack,
  stylingProps,
  usePropsResolution,
  useToken,
} from 'native-base';
import { useHasResponsiveProps } from 'native-base/lib/module/hooks/useHasResponsiveProps';

export const SelectMultipleContainer = ({
  children,
  ...restProps
}: PropsWithChildren) => {
  const ref = useRef(null);
  const { isHovered } = useHover({}, ref);

  const { _stack, _input, ...resolvedProps } = usePropsResolution(
    'Input',
    {
      variant: 'outline',
    },
    {
      isHovered: isHovered,
    },
  );
  const [layoutProps, nonLayoutProps] = extractInObject(resolvedProps, [
    ...stylingProps.margin,
    ...stylingProps.border,
    ...stylingProps.layout,
    ...stylingProps.flexbox,
    ...stylingProps.position,
    ...stylingProps.background,
    'shadow',
    'opacity',
  ]);

  /**Converting into Hash Color Code */
  //@ts-ignore
  resolvedProps.focusOutlineColor = useToken(
    'colors',
    resolvedProps.focusOutlineColor,
  );
  //@ts-ignore
  resolvedProps.invalidOutlineColor = useToken(
    'colors',
    resolvedProps.invalidOutlineColor,
  );
  //TODO: refactor for responsive prop
  if (useHasResponsiveProps(restProps)) {
    return null;
  }

  return (
    <Stack ref={ref} {..._stack} {...layoutProps} {...restProps}>
      <Box {..._input} minH={'40px'}>
        {children}
      </Box>
    </Stack>
  );
};
