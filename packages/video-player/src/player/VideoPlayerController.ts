import { BasePlaybackController } from '../BasePlaybackController';
import { MediaMetaData } from '../media-controls';
import { makeObservable } from 'mobx';
import React from 'react';
import { SharedValue } from 'react-native-reanimated';
import Video from 'react-native-video';

export class VideoPlayerController extends BasePlaybackController {
  constructor(
    uiVisibilityValue: SharedValue<number>,
    videoRef: React.MutableRefObject<Video>,
    autoPlay?: boolean,
    muted: boolean = false,
  ) {
    super(videoRef, uiVisibilityValue);
    this.hideUiOnFinish = false;
    this.isMuted = muted;
    this.isManualPaused = !autoPlay;
    makeObservable(this);
  }

  protected getMediaMetaData(): MediaMetaData | undefined {
    return {};
  }

  openPaywall(): void {
    throw new Error('Method not implemented.');
  }

  shouldDisplayPaywall(): boolean {
    return false;
  }
}
