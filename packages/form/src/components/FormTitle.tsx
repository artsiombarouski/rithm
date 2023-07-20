import { FormTitleProps } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FormControl, Tooltip, Button, Icon, Row, Text } from 'native-base';
import React, { useCallback, useMemo } from 'react';

export const FormTitle = (props: FormTitleProps) => {
  const {
    title,
    tooltipText,
    tooltipIcon,
    rightLabel,
    onRightLabelPress,
    titleProps,
    optional,
    optionalText,
    optionalProps,
  } = props || {};

  const onPress = useCallback(() => {
    onRightLabelPress?.();
  }, [onRightLabelPress]);

  const OptionalContent = useMemo(
    () =>
      optional ? (
        <Text
          ml={'2px'}
          numberOfLines={1}
          color={'blueGray.400'}
          {...optionalProps}
        >
          {optionalText ?? '(optional)'}
        </Text>
      ) : (
        <></>
      ),
    [optional, optionalText, optionalProps],
  );

  const LeftContent = useMemo(
    () =>
      tooltipText ? (
        <Tooltip placement={'top'} label={tooltipText}>
          <FormControl.Label
            maxWidth={'100%'}
            _text={{ numberOfLines: 1 }}
            {...titleProps}
          >
            {title}
            {OptionalContent}
            {tooltipIcon ? (
              tooltipIcon
            ) : (
              <Icon as={MaterialCommunityIcons} name="information" ml={1} />
            )}
          </FormControl.Label>
        </Tooltip>
      ) : (
        <FormControl.Label
          maxWidth={'100%'}
          _text={{ numberOfLines: 1 }}
          {...titleProps}
        >
          {title}
          {OptionalContent}
        </FormControl.Label>
      ),
    [tooltipText, title, titleProps, OptionalContent],
  );

  //todo: make RightContent not to overflow Row
  const RightContent = useMemo(
    () =>
      rightLabel ? (
        typeof rightLabel === 'string' ? (
          <Button variant="link" p={0} height={'auto'} onPress={onPress}>
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
    <Row
      alignItems={'center'}
      flex={1}
      maxW={'100%'}
      justifyContent={'space-between'}
    >
      {LeftContent}
      {RightContent}
    </Row>
  );
};
