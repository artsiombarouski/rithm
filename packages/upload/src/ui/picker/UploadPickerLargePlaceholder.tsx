import { Text, useTheme, VStack } from 'native-base';
import React from 'react';
import { UploadPickerPlaceholderProps } from './types';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { AddIcon, ReplaceIcon } from '../Icons';

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedAddIcon = Animated.createAnimatedComponent(AddIcon);
const AnimatedReplaceIcon = Animated.createAnimatedComponent(ReplaceIcon);

export type UploadPickerLargePlaceholderProps = UploadPickerPlaceholderProps & {
  title?: string;
  subTitle?: string;
};

export const UploadPickerLargePlaceholder = (
  props: UploadPickerLargePlaceholderProps,
) => {
  const {
    title = 'Click or drag file to this area to upload',
    subTitle,
    dragProgress,
    forReplace,
  } = props;
  const theme = useTheme();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        dragProgress.value,
        [0, 1],
        [theme.colors.text['900'], theme.colors.primary['500']],
      ),
    };
  });
  const IconComponent = forReplace ? AnimatedReplaceIcon : AnimatedAddIcon;
  return (
    <VStack
      flex={1}
      space={'2xs'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <IconComponent style={animatedStyle} />
      <AnimatedText style={animatedStyle}>{title}</AnimatedText>
      {subTitle && (
        <Text style={{ color: theme.colors.text['500'] }}>{subTitle}</Text>
      )}
    </VStack>
  );
};
