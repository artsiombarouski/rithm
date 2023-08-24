import { PageBuilderElementViewProps } from '../../types';
import { ImageElementPayload } from './ImageElement';
import { IImageProps, Image } from 'native-base';

export const ImageElementView = (
  props: PageBuilderElementViewProps<ImageElementPayload> &
    Partial<IImageProps>,
) => {
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
