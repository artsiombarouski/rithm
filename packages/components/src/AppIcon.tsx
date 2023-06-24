import { FunctionComponent } from 'react';
import { ImageProps, Image } from 'react-native';

type AppIconProps = ImageProps & {
  source: number | FunctionComponent;
};

export const AppIcon = (props: AppIconProps) => {
  const { source, ...restProps } = props;

  // If source is a number, it's an image resource
  if (typeof source === 'number') {
    return <Image source={source} {...restProps} />;
  }
  // If not, it's a SVG component
  else {
    const SvgComponent = source;
    return <SvgComponent {...restProps} />;
  }
};
