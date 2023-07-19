import { icInfo } from '../assets';
import { FormTitleProps } from '../types';
import { AppIcon } from '@artsiombarouski/rn-components';
import { Flex, FormControl, Spacer, Tooltip, Button } from 'native-base';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const FormTitle = (props: FormTitleProps) => {
  const {
    title,
    tooltipText,
    tooltipIcon,
    rightLabel,
    onRightLabelPress,
    titleProps,
  } = props || {};

  const onPress = useCallback(() => {
    onRightLabelPress?.();
  }, [onRightLabelPress]);
  const LeftContent = useMemo(
    () =>
      tooltipText ? (
        <Tooltip placement={'top'} label={tooltipText}>
          <Flex flexDirection={'row'} alignItems={'center'}>
            <FormControl.Label {...titleProps}>{title}</FormControl.Label>
            {tooltipIcon ? (
              tooltipIcon
            ) : (
              <AppIcon
                source={icInfo}
                color={'blueGray.600'}
                style={styles.tooltipIcon}
              />
            )}
          </Flex>
        </Tooltip>
      ) : (
        <FormControl.Label {...titleProps}>{title}</FormControl.Label>
      ),
    [tooltipText, title, titleProps],
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
    [rightLabel, onPress],
  );

  return (
    <Flex flexDirection={'row'} alignItems={'center'}>
      {LeftContent}
      <Spacer />
      {RightContent}
    </Flex>
  );
};

const styles = StyleSheet.create({
  tooltipIcon: {
    marginLeft: 4,
  },
});
