import { PageBuilderElement, PageBuilderElementPayload } from '../../types';
import { VideoElementIcon } from '../../ui/Icons';
import { VideoElementEdit, VideoElementEditProps } from './VideoElementEdit';
import { VideoElementView, VideoElementViewProps } from './VideoElementView';
import { StoredFile } from '@artsiombarouski/rn-upload';

export type VideoElementPayload = PageBuilderElementPayload<StoredFile>;

export const VideoElement: PageBuilderElement<
  VideoElementPayload,
  VideoElementEditProps,
  VideoElementViewProps
> = {
  type: 'video',
  title: 'Video',
  buttonTitle: 'Add Video',
  Icon: VideoElementIcon,
  Edit: VideoElementEdit,
  View: VideoElementView,
};
