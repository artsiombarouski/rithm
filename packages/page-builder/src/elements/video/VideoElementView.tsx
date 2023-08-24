import { PageBuilderElementViewProps } from '../../types';
import { VideoElementPayload } from './VideoElement';
import {
  VideoPlayer,
  VideoPlayerProps,
} from '@artsiombarouski/rn-video-player';

export const VideoElementView = (
  props: PageBuilderElementViewProps<VideoElementPayload> &
    Partial<VideoPlayerProps>,
) => {
  const { payload, ...restProps } = props;
  return (
    <VideoPlayer
      style={{ flex: 1 }}
      source={props.payload.value.url}
      {...restProps}
    />
  );
};
