import {
  MediaControlsCallbacks,
  MediaControlsPlaybackState,
  MediaMetaData,
} from './types';

export abstract class MediaControlsBase {
  protected constructor(readonly callbacks: MediaControlsCallbacks) {}

  setCurrentMetaData(data?: MediaMetaData) {
    this.onCurrentMetaDataChanged(data);
  }

  protected abstract onCurrentMetaDataChanged(data?: MediaMetaData);

  setPlaybackState(state: MediaControlsPlaybackState) {
    this.onCurrentPlaybackStateChanged(state);
  }

  protected onCurrentPlaybackStateChanged(state: MediaControlsPlaybackState) {}

  init() {
    this.onInit();
  }

  protected onInit() {}

  destroy() {
    this.onDestroy();
  }

  protected onDestroy() {}
}
