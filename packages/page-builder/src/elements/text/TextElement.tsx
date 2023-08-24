import { PageBuilderElement, PageBuilderElementPayload } from '../../types';
import { TextElementEdit } from './TextElementEdit';
import { TextElementView } from './TextElementView';
import { TextElementIcon } from '../../ui/Icons';

export type TextElementPayload = PageBuilderElementPayload<string>;

export const TextElement: PageBuilderElement<TextElementPayload> = {
  type: 'text',
  title: 'Text',
  Icon: TextElementIcon,
  Edit: TextElementEdit,
  View: TextElementView,
};
