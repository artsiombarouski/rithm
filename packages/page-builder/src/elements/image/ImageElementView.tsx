import { PageBuilderElementViewProps } from '../../types';
import { ImageElementPayload } from './ImageElement';
import { Image } from 'native-base';

export const ImageElementView = (
  props: PageBuilderElementViewProps<ImageElementPayload>,
) => {
  return (
    <Image
      flex={1}
      source={{
        uri: props.payload.value.thumbnailUrl ?? props.payload.value.url,
      }}
      resizeMode={'cover'}
    />
  );
};
