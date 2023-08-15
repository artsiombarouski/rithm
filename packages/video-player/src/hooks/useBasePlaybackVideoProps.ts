import { BasePlaybackController } from '../BasePlaybackController';
import { VideoError } from '../types';
import { VideoProps } from '../video';
import { useMemo } from 'react';
import { LoadError, OnLoadData, OnProgressData } from 'react-native-video';

type Props = {
  store: BasePlaybackController;
};

type Return = Pick<
  VideoProps,
  | 'paused'
  | 'muted'
  | 'volume'
  | 'onLoad'
  | 'onReadyForDisplay'
  | 'onError'
  | 'onProgress'
  | 'onEnd'
  | 'onAutoPlayFailed'
> & {};

export function useBasePlaybackVideoProps(props: Props): Return {
  const { store } = props;

  const callbacks = useMemo<Omit<Return, 'paused' | 'muted' | 'volume'>>(() => {
    return {
      onLoad(event: OnLoadData) {
        store.setVideoLoaded(event.duration);
      },
      onReadyForDisplay() {
        store.setVideoReady();
      },
      onError(error: LoadError) {
        store.setVideoError(VideoError.unknown);
      },
      onProgress(event: OnProgressData) {
        store.setPlayProgress({
          currentTime: event.currentTime,
          playableDuration: event.playableDuration,
        });
      },
      onEnd() {
        store.setVideoFinished();
      },
      onAutoPlayFailed() {
        store.setAutoPlayFailed();
      },
    };
  }, [store]);

  return {
    paused: store.isManualPaused,
    muted: store.isMuted,
    volume: store.isMuted ? 0.0 : 1.0,
    ...callbacks,
  };
}
