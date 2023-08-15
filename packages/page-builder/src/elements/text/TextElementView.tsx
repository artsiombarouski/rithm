import { TextElementPayload } from './TextElement';
import { PageBuilderElementViewProps } from '../../types';
import { Text } from 'native-base';

export const TextElementView = (
  props: PageBuilderElementViewProps<TextElementPayload>,
) => {
  return <Text>{props.payload.value ?? ''}</Text>;
};
