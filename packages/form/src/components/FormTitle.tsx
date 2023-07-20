import { FormTitleProps } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  Flex,
  FormControl,
  Tooltip,
  Button,
  Icon,
  Row,
  Text,
} from 'native-base';
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
  const LeftContent = useMemo(
    () =>
      tooltipText ? (
        <Tooltip placement={'top'} label={tooltipText}>
          <Flex flexDirection={'row'} alignItems={'center'} w={'100%'}>
            <FormControl.Label
              flex={1}
              _text={{ numberOfLines: 1 }}
              {...titleProps}
            >
              {title}
            </FormControl.Label>
            {tooltipIcon ? (
              tooltipIcon
            ) : (
              <Icon as={MaterialCommunityIcons} name="information" ml={1} />
            )}
          </Flex>
        </Tooltip>
      ) : (
        <FormControl.Label
          flex={1}
          _text={{ numberOfLines: 1 }}
          {...titleProps}
        >
          {title}
        </FormControl.Label>
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

  const OptionalContent = useMemo(
    () =>
      optional ? (
        <Text color={'blueGray.400'} {...optionalProps}>
          {optionalText ?? ' (optional)'}
        </Text>
      ) : (
        <></>
      ),
    [optional, optionalText],
  );

  return (
    <Flex
      flexDirection={'row'}
      alignItems={'center'}
      w={'100%'}
      justifyContent={'space-between'}
    >
      <Row alignItems={'center'}>
        {LeftContent}
        {OptionalContent}
      </Row>
      {RightContent}
    </Flex>
  );
};
