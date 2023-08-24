import { PageBuilderElement, PageBuilderElementPayload } from '../../types';
import { TextElementEdit, TextElementEditProps } from './TextElementEdit';
import { TextElementView, TextElementViewProps } from './TextElementView';
import { TextElementIcon } from '../../ui/Icons';

export type TextElementPayload = PageBuilderElementPayload<string>;

export const TextElement: PageBuilderElement<
  TextElementPayload,
  TextElementEditProps,
  TextElementViewProps
> = {
  type: 'text',
  title: 'Text',
  Icon: TextElementIcon,
  Edit: TextElementEdit,
  View: TextElementView,
};
