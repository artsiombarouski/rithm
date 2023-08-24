import { PageBuilderElement, PageBuilderElementPayload } from '../../types';
import { StoredFile } from '@artsiombarouski/rn-upload';
import { TextElementIcon } from '../../ui/Icons';
import { VideoElementEdit, VideoElementEditProps } from './VideoElementEdit';
import { VideoElementView, VideoElementViewProps } from './VideoElementView';

export type VideoElementPayload = PageBuilderElementPayload<StoredFile>;

export const VideoElement: PageBuilderElement<
  VideoElementPayload,
  VideoElementEditProps,
  VideoElementViewProps
> = {
  type: 'video',
  title: 'Video',
  Icon: TextElementIcon,
  Edit: VideoElementEdit,
  View: VideoElementView,
};
