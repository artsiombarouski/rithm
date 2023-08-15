import { PageBuilderElement, PageBuilderElementPayload } from '../../types';
import { StoredFile } from '@artsiombarouski/rn-upload';
import { TextElementIcon } from '../../ui/Icons';
import { VideoElementEdit } from './VideoElementEdit';
import { VideoElementView } from './VideoElementView';

export type VideoElementPayload = PageBuilderElementPayload<StoredFile>;

export const VideoElement: PageBuilderElement<VideoElementPayload> = {
  type: 'video',
  title: 'Video',
  icon: TextElementIcon,
  edit: VideoElementEdit,
  view: VideoElementView,
};
