import { TextElementPayload } from './TextElement';
import { PageBuilderElementViewProps } from '../../types';
import { ITextProps, Text } from 'native-base';

export type TextElementViewProps =
  PageBuilderElementViewProps<TextElementPayload> & Partial<ITextProps>;

export const TextElementView = (props: TextElementViewProps) => {
  const { payload, ...restProps } = props;
  return <Text {...restProps}>{payload.value ?? ''}</Text>;
};
