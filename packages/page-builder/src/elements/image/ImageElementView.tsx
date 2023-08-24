import { PageBuilderElementViewProps } from '../../types';
import { ImageElementPayload } from './ImageElement';
import { IImageProps, Image } from 'native-base';

export type ImageElementViewProps =
  PageBuilderElementViewProps<ImageElementPayload> & Partial<IImageProps>;

export const ImageElementView = (props: ImageElementViewProps) => {
  const { payload, ...restProps } = props;
  return (
    <Image
      flex={1}
      source={{
        uri: payload.value.thumbnailUrl ?? payload.value.url,
      }}
      resizeMode={'cover'}
      {...restProps}
    />
  );
};
