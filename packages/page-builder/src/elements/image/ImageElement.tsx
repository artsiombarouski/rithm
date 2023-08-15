import { PageBuilderElement, PageBuilderElementPayload } from '../../types';
import { StoredFile } from '@artsiombarouski/rn-upload';
import { ImageElementEdit } from './ImageElementEdit';
import { ImageElementView } from './ImageElementView';
import { BinIcon } from '../../ui/Icons';

export type ImageElementPayload = PageBuilderElementPayload<StoredFile>;

export const ImageElement: PageBuilderElement<ImageElementPayload> = {
  type: 'image',
  title: 'Image',
  icon: BinIcon,
  edit: (props) => <ImageElementEdit {...props} />,
  view: (props) => <ImageElementView {...props} />,
};
