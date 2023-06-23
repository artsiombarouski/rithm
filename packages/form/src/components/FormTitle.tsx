import { FormTitleProps } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Flex, FormControl, Spacer, Tooltip, Button, Icon } from 'native-base';
import React, { useCallback, useMemo } from 'react';

export const FormTitle = (props: FormTitleProps) => {
  const {
    title,
    tooltipText,
    tooltipIcon,
    rightLabel,
    onRightLabelPress,
    labelProps,
  } = props || {};

  const onPress = useCallback(() => {
    onRightLabelPress?.();
  }, [onRightLabelPress]);
  const LeftContent = useMemo(
    () =>
      tooltipText ? (
        <Tooltip placement={'top'} label={tooltipText}>
          <Flex flexDirection={'row'} alignItems={'center'}>
            <FormControl.Label {...labelProps}>{title}</FormControl.Label>
            {tooltipIcon ? (
              tooltipIcon
            ) : (
              <Icon as={MaterialCommunityIcons} name="information" ml={1} />
            )}
          </Flex>
        </Tooltip>
      ) : (
        <FormControl.Label {...labelProps}>{title}</FormControl.Label>
      ),
    [tooltipText, title, labelProps],
  );

  const RightContent = useMemo(
    () =>
      rightLabel ? (
        typeof rightLabel === 'string' ? (
          <Button
            size="md"
            variant="link"
            p={0}
            height={'auto'}
            alignSelf={'flex-start'}
            onPress={onPress}
          >
            {rightLabel}
          </Button>
        ) : (
          rightLabel
        )
      ) : (
        <></>
      ),
    [rightLabel, onPress, labelProps],
  );

  return (
    <Flex flexDirection={'row'} alignItems={'center'}>
      {LeftContent}
      <Spacer />
      {RightContent}
    </Flex>
  );
};
