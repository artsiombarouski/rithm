import { isNothing } from '../utils';
import { MediaControlsBase } from './MediaControlsBase';
import {
  MediaControlsCallbacks,
  MediaControlsPlaybackState,
  MediaMetaData,
} from './types';

export class MediaControls extends MediaControlsBase {
  constructor(callbacks: MediaControlsCallbacks) {
    super(callbacks);
  }

  protected onInit() {
    const mediaSession = navigator.mediaSession;
    if (!mediaSession) {
      return;
    }
    mediaSession.setActionHandler('play', this.callbacks.onPlay);
    mediaSession.setActionHandler('pause', this.callbacks.onPause);
    mediaSession.setActionHandler('stop', this.callbacks.onStop);
    mediaSession.setActionHandler('seekforward', this.callbacks.onSkipForward);
    mediaSession.setActionHandler(
      'seekbackward',
      this.callbacks.onSkipBackward,
    );
    mediaSession.setActionHandler('seekto', (event) => {
      //TODO: implement
    });
  }

  protected onCurrentMetaDataChanged(data?: MediaMetaData) {
    const mediaSession = navigator.mediaSession;
    if (!mediaSession) {
      return;
    }
    if (isNothing(data)) {
      mediaSession.metadata = null;
      return;
    }
    const metaData: MediaMetadataInit = {
      title: data.title,
      artist: data.artist,
      album: data.album,
    };
    if (!isNothing(data.artwork)) {
      metaData.artwork = [
        {
          src: data.artwork,
        },
      ];
    }
    mediaSession.metadata = new MediaMetadata(metaData);
  }

  protected onCurrentPlaybackStateChanged(state: MediaControlsPlaybackState) {
    const mediaSession = navigator.mediaSession;
    if (!mediaSession) {
      return;
    }
    mediaSession.playbackState = state.paused ? 'paused' : 'playing';
    mediaSession.setPositionState({
      duration: state.duration,
      position: state.progress,
    });
  }

  protected onDestroy() {
    const mediaSession = navigator.mediaSession;
    if (!mediaSession) {
      return;
    }
    mediaSession.metadata = null;
    mediaSession.playbackState = 'none';
    mediaSession.setPositionState(null);
  }
}
