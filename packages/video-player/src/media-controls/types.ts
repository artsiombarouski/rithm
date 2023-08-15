export type MediaMetaData = {
  title?: string;
  artwork?: string;
  artist?: string;
  album?: string;
  duration?: number;
  description?: string;
  color?: number;
  colorized?: boolean;
  isLiveStream?: boolean;
};

export type MediaControlsCallbacks = {
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
};

export type MediaControlsPlaybackState = {
  paused: boolean;
  duration?: number;
  progress?: number;
};
