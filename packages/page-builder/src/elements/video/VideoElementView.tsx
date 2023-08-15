import { PageBuilderElementViewProps } from '../../types';
import { VideoElementPayload } from './VideoElement';
import { VideoPlayer } from '@artsiombarouski/rn-video-player';

export const VideoElementView = (
  props: PageBuilderElementViewProps<VideoElementPayload>,
) => {
  return <VideoPlayer style={{ flex: 1 }} source={props.payload.value.url} />;
};
