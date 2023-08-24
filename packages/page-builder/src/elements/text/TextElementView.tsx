import { TextElementPayload } from './TextElement';
import { PageBuilderElementViewProps } from '../../types';
import { ITextProps, Text } from 'native-base';

export const TextElementView = (
  props: PageBuilderElementViewProps<TextElementPayload> & Partial<ITextProps>,
) => {
  const { payload, ...restProps } = props;
  return <Text {...restProps}>{payload.value ?? ''}</Text>;
};
