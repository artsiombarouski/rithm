import { PageBuilderElementViewProps } from '../../types';
import { VideoElementPayload } from './VideoElement';
import {
  VideoPlayer,
  VideoPlayerProps,
} from '@artsiombarouski/rn-video-player';

export type VideoElementViewProps =
  PageBuilderElementViewProps<VideoElementPayload> & Partial<VideoPlayerProps>;

export const VideoElementView = (props: VideoElementViewProps) => {
  const { payload, ...restProps } = props;
  return (
    <VideoPlayer
      style={{ flex: 1 }}
      source={props.payload.value.url}
      {...restProps}
    />
  );
};
