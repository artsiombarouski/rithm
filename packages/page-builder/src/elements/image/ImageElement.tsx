import { PageBuilderElement, PageBuilderElementPayload } from '../../types';
import { ImageElementIcon } from '../../ui/Icons';
import { ImageElementEdit, ImageElementEditProps } from './ImageElementEdit';
import { ImageElementView, ImageElementViewProps } from './ImageElementView';
import { StoredFile } from '@artsiombarouski/rn-upload';

export type ImageElementPayload = PageBuilderElementPayload<StoredFile>;

export const ImageElement: PageBuilderElement<
  ImageElementPayload,
  ImageElementEditProps,
  ImageElementViewProps
> = {
  type: 'image',
  title: 'Image',
  buttonTitle: 'Add Image',
  Icon: ImageElementIcon,
  Edit: ImageElementEdit,
  View: ImageElementView,
};
