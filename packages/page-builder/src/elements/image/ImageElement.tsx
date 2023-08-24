import { PageBuilderElement, PageBuilderElementPayload } from '../../types';
import { StoredFile } from '@artsiombarouski/rn-upload';
import { ImageElementEdit, ImageElementEditProps } from './ImageElementEdit';
import { ImageElementView, ImageElementViewProps } from './ImageElementView';
import { BinIcon } from '../../ui/Icons';

export type ImageElementPayload = PageBuilderElementPayload<StoredFile>;

export const ImageElement: PageBuilderElement<
  ImageElementPayload,
  ImageElementEditProps,
  ImageElementViewProps
> = {
  type: 'image',
  title: 'Image',
  Icon: BinIcon,
  Edit: ImageElementEdit,
  View: ImageElementView,
};
