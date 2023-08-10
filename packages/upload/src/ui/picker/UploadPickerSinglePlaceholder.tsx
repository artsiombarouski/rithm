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

export type UploadPickerSinglePlaceholderProps =
  UploadPickerPlaceholderProps & {
    title?: string;
  };

export const UploadPickerSinglePlaceholder = (
  props: UploadPickerSinglePlaceholderProps,
) => {
  const { title, dragProgress, forReplace } = props;
  const theme = useTheme();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        dragProgress.value,
        [0, 1],
        [theme.colors.text['500'], theme.colors.primary['500']],
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
      <AnimatedText style={animatedStyle}>
        {title ?? (forReplace ? 'Replace' : 'Upload')}
      </AnimatedText>
    </VStack>
  );
};
