import { isIOS, isNothing } from '../utils';
import { MediaControlsBase } from './MediaControlsBase';
import {
  MediaControlsCallbacks,
  MediaControlsPlaybackState,
  MediaMetaData,
} from './types';
import MusicControl, { Command } from 'react-native-music-control';

export class MediaControls extends MediaControlsBase {
  constructor(callbacks: MediaControlsCallbacks) {
    super(callbacks);
  }

  protected onInit() {
    MusicControl.enableBackgroundMode(true);
    if (isIOS) {
      MusicControl.handleAudioInterruptions(true);
    }

    MusicControl.enableControl('play', true);
    MusicControl.enableControl('pause', true);
    MusicControl.enableControl('stop', false);
    MusicControl.enableControl('nextTrack', false);
    MusicControl.enableControl('previousTrack', false);
    MusicControl.enableControl('skipForward', true, { interval: 30 });
    MusicControl.enableControl('skipBackward', true, { interval: 30 });

    MusicControl.on(Command.play, this.callbacks.onPlay);
    MusicControl.on(Command.pause, this.callbacks.onPause);
    MusicControl.on(Command.skipForward, this.callbacks.onSkipForward);
    MusicControl.on(Command.skipBackward, this.callbacks.onSkipBackward);
    MusicControl.on(Command.seek, (value) => {
      //TODO: implement
    });
  }

  protected onCurrentMetaDataChanged(data?: MediaMetaData) {
    if (isNothing(data)) {
      MusicControl.resetNowPlaying();
      return;
    }
    MusicControl.setNowPlaying({
      title: data.title,
      artist: data.artist,
      album: data.album,
      artwork: data.artwork, // URL or RN's image require()
      duration: data.duration, // (Seconds)
      description: data.description ?? '', // Android Only
      color: data.colorized ?? 0xffffff, // Android Only - Notification Color
      colorized: isNothing(data.colorized) || data.colorized, // Android 8+ Only - Notification Color extracted from the artwork. Set to false to use the color property instead
      date: '1983-01-02T00:00:00Z', // Release Date (RFC 3339) - Android Only
      rating: 100, // Android Only (Boolean or Number depending on the type)
      notificationIcon: '', // Android Only (String), Android Drawable resource name for a custom notification icon
      isLiveStream: data.isLiveStream ?? false, // iOS Only (Boolean), Show or hide Live Indicator instead of seekbar on lock screen for live streams. Default value is false.
    });
  }

  protected onCurrentPlaybackStateChanged(state: MediaControlsPlaybackState) {
    MusicControl.updatePlayback({
      state: state.paused
        ? MusicControl.STATE_PAUSED
        : MusicControl.STATE_PLAYING,
      elapsedTime: state.progress ?? 0,
    });
  }

  protected onDestroy() {
    MusicControl.resetNowPlaying();
  }
}
