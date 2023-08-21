import React, { useContext, useEffect, useRef } from 'react';
import { OverlayContainer } from '@react-native-aria/overlays';
import { Platform, StyleSheet } from 'react-native';
import { useId } from '@react-native-aria/utils';
import uniqueId from 'lodash.uniqueid';
import {
  Box,
  ITooltipProps,
  PresenceTransition,
  useControllableState,
  useKeyboardDismissable,
  usePropsResolution,
} from 'native-base';
import { ResponsiveQueryContext } from 'native-base/lib/module/utils/useResponsiveQuery/ResponsiveQueryProvider';
import { useHasResponsiveProps } from 'native-base/lib/module/hooks/useHasResponsiveProps';
import { Popper } from 'native-base/lib/module/components/composites/Popper';

export type ControlledTooltipProps = Omit<ITooltipProps, 'label'> & {
  targetRef: any;
  label: any;
};

export const ControlledTooltip = ({
  targetRef,
  label,
  children,
  onClose,
  onOpen,
  defaultIsOpen,
  placement,
  openDelay = 0,
  closeDelay = 0,
  closeOnClick = true,
  offset,
  isDisabled,
  hasArrow,
  arrowSize = 12,
  isOpen: isOpenProp,
  ...props
}: ControlledTooltipProps) => {
  if (hasArrow && offset === undefined) {
    offset = 0;
  } else {
    offset = 6;
  }

  const resolvedProps = usePropsResolution('Tooltip', props);
  const [isOpen, setIsOpen] = useControllableState({
    value: isOpenProp,
    defaultValue: defaultIsOpen,
    onChange: (value) => {
      value ? onOpen && onOpen() : onClose && onClose();
    },
  });

  const arrowBg =
    props.backgroundColor ?? props.bgColor ?? props.bg ?? resolvedProps.bg;

  const enterTimeout = useRef<any>();
  const exitTimeout = useRef<any>();

  let tooltipID = uniqueId();

  const responsiveQueryContext = useContext(ResponsiveQueryContext);
  const disableCSSMediaQueries = (responsiveQueryContext as any)
    .disableCSSMediaQueries;

  if (!disableCSSMediaQueries) {
    tooltipID = useId();
  }

  useEffect(
    () => () => {
      clearTimeout(enterTimeout.current);
      clearTimeout(exitTimeout.current);
    },
    [],
  );

  let newChildren = children;

  if (typeof children === 'string') {
    newChildren = <Box>{children}</Box>;
  }

  useKeyboardDismissable({
    enabled: isOpen,
    callback: () => setIsOpen(false),
  });
  //TODO: refactor for responsive prop
  if (useHasResponsiveProps(props)) {
    return null;
  }
  return (
    <>
      {newChildren}
      {isOpen && (
        <OverlayContainer>
          <PresenceTransition
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 150 } }}
            exit={{ opacity: 0, transition: { duration: 100 } }}
            visible={isOpen}
            style={StyleSheet.absoluteFill}
          >
            <Popper
              triggerRef={targetRef}
              onClose={() => setIsOpen(false)}
              placement={placement}
              offset={offset}
            >
              <Popper.Content isOpen={isOpen}>
                {hasArrow && (
                  <Popper.Arrow
                    backgroundColor={arrowBg}
                    height={arrowSize}
                    width={arrowSize}
                  />
                )}
                <Box
                  {...resolvedProps}
                  //@ts-ignore
                  accessibilityRole={
                    Platform.OS === 'web' ? 'tooltip' : undefined
                  }
                  nativeID={tooltipID}
                >
                  {label}
                </Box>
              </Popper.Content>
            </Popper>
          </PresenceTransition>
        </OverlayContainer>
      )}
    </>
  );
};
