import { computeFilters, isWeb } from '../utils';
import React, { memo } from 'react';
import {
  ColorValue,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

export type VideoPlayerIconProps = {
  size?: number;
  height?: number;
  source?: React.ComponentType<any>;
  activeSource?: React.ComponentType<any>;
  color?: ColorValue;
  activeColor?: string;
  isActive?: boolean;
  onPress?: () => void;
  focused?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const VideoPlayerIcon = memo<VideoPlayerIconProps>((props) => {
  const {
    source,
    activeSource,
    size = 24,
    height = size,
    style,
    color,
    activeColor = color,
    isActive,
    focused,
    onPress,
  } = props;
  const targetIsActive = isActive ?? focused;
  const TargetSource = targetIsActive && activeSource ? activeSource : source;
  const targetColor =
    (targetIsActive ? activeColor : color) ?? (style as any)?.tintColor;
  let colorStyles = { tintColor: targetColor } as any;
  if (isWeb) {
    const { filter, isValid, opacity } = computeFilters(targetColor);
    if (isValid && filter) {
      colorStyles = {
        filter,
        opacity,
      };
    }
  }
  const component = (
    <TargetSource
      color={color}
      style={[
        { width: size, height: height, ...colorStyles },
        !onPress && style,
      ]}
    />
  );
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={style} activeOpacity={0.8}>
        {component}
      </TouchableOpacity>
    );
  }
  return component;
});
