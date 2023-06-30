import { FunctionComponent } from 'react';
import { ImageProps, Image } from 'react-native';
import { SvgProps } from 'react-native-svg';

type AppIconProps<T extends number | FunctionComponent> = T extends number
  ? { source: T; color?: string } & Omit<ImageProps, 'source'>
  : { source: T } & SvgProps;

export const AppIcon = <T extends number | FunctionComponent>(
  props: AppIconProps<T>,
) => {
  const { source, color, ...restProps } = props;

  // If source is a number, it's an image resource
  if (typeof source === 'number') {
    return (
      <Image source={source} {...(restProps as Omit<ImageProps, 'source'>)} />
    );
  }
  // If not, it's a SVG component
  else {
    const SvgComponent = source as FunctionComponent<SvgProps>;
    return <SvgComponent color={color} {...restProps} />;
  }
};
