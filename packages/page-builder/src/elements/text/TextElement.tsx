import { PageBuilderElement, PageBuilderElementPayload } from '../../types';
import { TextElementIcon } from '../../ui/Icons';
import { TextElementEdit, TextElementEditProps } from './TextElementEdit';
import { TextElementView, TextElementViewProps } from './TextElementView';

export type TextElementPayload = PageBuilderElementPayload<string>;

export const TextElement: PageBuilderElement<
  TextElementPayload,
  TextElementEditProps,
  TextElementViewProps
> = {
  type: 'text',
  title: 'Add Text',
  Icon: TextElementIcon,
  Edit: TextElementEdit,
  View: TextElementView,
};
