import loadScript from 'load-script';
import { isEqual } from 'lodash';
import React, { createElement, createRef, ReactEventHandler } from 'react';
import { StyleSheet } from 'react-native';
import { VideoProperties } from 'react-native-video';

const requests = {};

function getGlobal(key): any {
  if (window[key]) {
    return window[key];
  }
  if (window.exports && window.exports[key]) {
    return window.exports[key];
  }
  if (window.module && window.module.exports && window.module.exports[key]) {
    return window.module.exports[key];
  }
  return null;
}

const HAS_NAVIGATOR = typeof navigator !== 'undefined';
const IS_IPAD_PRO =
  HAS_NAVIGATOR &&
  navigator.platform === 'MacIntel' &&
  navigator.maxTouchPoints > 1;
export const IS_IOS =
  HAS_NAVIGATOR &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) || IS_IPAD_PRO) &&
  !(window as any).MSStream;
export const HLS_EXTENSIONS = /\.(m3u8)($|\?)/i;

const HLS_SDK_URL = 'https://cdn.jsdelivr.net/npm/hls.js@1.2.8/dist/hls.min.js';

export const closeFullscreen = () => {
  document.exitFullscreen();
};

export const openFullscreen = (el: HTMLVideoElement) => {
  if (el.requestFullscreen) {
    el.requestFullscreen();
    // @ts-ignore
  } else if (el.mozRequestFullScreen) {
    // @ts-ignore
    el.mozRequestFullScreen();
    // @ts-ignore
  } else if (el.webkitRequestFullscreen) {
    // @ts-ignore
    el.webkitRequestFullscreen();
    // @ts-ignore
  } else if (el.msRequestFullscreen) {
    // @ts-ignore
    el.msRequestFullscreen();
  }
};

export function getSDK(
  url,
  sdkGlobal,
  sdkReady = null,
  isLoaded = (input: any) => true,
  fetchScript = loadScript,
) {
  const existingGlobal = getGlobal(sdkGlobal);
  if (existingGlobal && isLoaded(existingGlobal)) {
    return Promise.resolve(existingGlobal);
  }
  return new Promise((resolve, reject) => {
    // If we are already loading the SDK, add the resolve and reject
    // functions to the existing array of requests
    if (requests[url]) {
      requests[url].push({ resolve, reject });
      return;
    }
    requests[url] = [{ resolve, reject }];
    const onLoaded = (sdk) => {
      // When loaded, resolve all pending request promises
      requests[url].forEach((request) => request.resolve(sdk));
    };
    if (sdkReady) {
      const previousOnReady = window[sdkReady] as any;
      (window as any)[sdkReady] = function () {
        if (previousOnReady) previousOnReady();
        onLoaded(getGlobal(sdkGlobal));
      };
    }
    fetchScript(url, (err) => {
      if (err) {
        // Loading the SDK failed – reject all requests and
        // reset the array of requests for this SDK
        requests[url].forEach((request) => request.reject(err));
        requests[url] = null;
      } else if (!sdkReady) {
        onLoaded(getGlobal(sdkGlobal));
      }
    });
  });
}

interface ComponentProps extends VideoProperties {
  poster?: string | undefined;
  forceHls?: boolean;
  onAutoPlayFailed?: () => void;
  autoPlay?: boolean;
}

const VideoComponent: any = React.forwardRef<HTMLVideoElement, ComponentProps>(
  (props, ref) => createElement('video', { ...props, ref }),
);

export class Video extends React.Component<ComponentProps> {
  private _root = createRef<HTMLVideoElement>();
  private hls: any;

  private get _getSource(): string | undefined {
    const { source } = this.props;
    const result = (source as any).uri;
    if (this.shouldUseHLS(result)) {
      return;
    }
    return result;
  }

  public setNativeProps = () => {};

  public seek = (time: number, _?: number) => {
    const element = this._root.current;
    if (element) {
      element.currentTime = time;
    }
  };

  public save = (): Promise<void> => {
    return Promise.resolve();
  };

  public presentFullscreenPlayer = () => {
    const element = this._root.current;
    if (element) {
      openFullscreen(element);
    }
  };

  public dismissFullscreenPlayer = () => {
    closeFullscreen();
  };

  componentDidMount() {
    const { source, fullscreen, rate, seek } = this.props;
    const element = this._root.current;

    if (element) {
      if (fullscreen) {
        openFullscreen(element);
      }

      element.addEventListener('progress', this._onProgress);
      element.addEventListener('seeking', this._onSeek);
      element.addEventListener('ended', this._onEnd);

      if (rate) {
        element.playbackRate = rate;
      }

      if (seek) {
        this.seek(seek);
      }

      this.load((source as any)?.uri);
    }
  }

  componentWillUnmount() {
    this._root.current?.pause();
    if (this.hls) {
      this.hls.destroy();
    }
  }

  componentDidUpdate(prevProps: VideoProperties) {
    const { fullscreen, rate, seek, currentTime, paused } = this.props;
    const element = this._root.current;

    if (element) {
      if (fullscreen !== prevProps.fullscreen) {
        if (fullscreen) {
          openFullscreen(element);
        } else {
          closeFullscreen();
        }
      }

      if (rate !== prevProps.rate && rate) {
        element.playbackRate = rate;

        if (this.props.onPlaybackRateChange) {
          this.props.onPlaybackRateChange({
            playbackRate: rate,
          });
        }
      }

      if (seek !== prevProps.seek && seek) {
        element.currentTime = seek;
      }

      if (currentTime !== prevProps.currentTime && currentTime) {
        element.currentTime = currentTime;
      }

      if (paused !== prevProps.paused && paused !== undefined) {
        if (paused) {
          element.pause();
        } else {
          this.tryPlay();
        }
      }
    }
    if (!isEqual(prevProps.source, this.props.source)) {
      this.load((this.props.source as any)?.uri);
    }
  }

  private tryPlay() {
    const element = this._root.current;
    if (!element) {
      return;
    }
    element
      .play()
      .then(() => {
        //ignore
      })
      .catch(() => {
        console.log('onAutoPlayFailed');
        this.props.onAutoPlayFailed?.();
      });
  }

  private _onProgress = (event: any) => {
    const element = this._root.current;
    if (this.props.onProgress && element) {
      this.props.onProgress({
        currentTime: element.currentTime,

        // @todo add support for these values
        playableDuration: 0,
        seekableDuration: 0,
      });
    }
  };

  private _onLoadStart = () => {
    if (this.props.onLoadStart) {
      this.props.onLoadStart();
    }
  };

  private _onLoad: ReactEventHandler<HTMLVideoElement> = () => {
    const element = this._root.current;
    if (this.props.onLoad && element) {
      this.props.onLoad({
        canPlayFastForward: true,
        canPlayReverse: true,
        canPlaySlowForward: true,
        canStepBackward: true,
        canStepForward: true,
        canPlaySlowReverse: true,
        currentTime: element.currentTime,
        duration: element.duration,
        naturalSize: {
          height: element.videoHeight,
          width: element.videoWidth,
          orientation: 'landscape',
        },
      } as any);
    }
  };

  private _onReady = () => {
    const { paused, onReadyForDisplay } = this.props;
    onReadyForDisplay?.();
    if (!paused) {
      this.tryPlay();
    }
  };

  private _onError = (error: any) => {
    if (this.props.onError) {
      this.props.onError({
        error: {
          '': '',
          errorString:
            error instanceof Error ? error.message : 'Unexpected error',
        },
      });
    }
  };

  private _onSeek = () => {
    const element = this._root.current;
    if (this.props.onSeek && element) {
      this.props.onSeek({
        currentTime: element.currentTime,

        // @todo add support for these values
        seekTime: 0,
        target: 0,
      });
    }
  };

  private _onEnd = () => {
    if (this.props.onEnd) {
      this.props.onEnd();
    }
  };

  shouldUseHLS(url) {
    if (this.props.forceHls) {
      return true;
    }
    if (IS_IOS) {
      return false;
    }
    return HLS_EXTENSIONS.test(url);
  }

  load(url: string | undefined) {
    if (this.hls) {
      this.hls.destroy();
    }
    if (this.shouldUseHLS(url)) {
      getSDK(HLS_SDK_URL, 'Hls').then((Hls) => {
        this.hls = new Hls();
        this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
          this.props.onReadyForDisplay?.();
        });
        this.hls.on(Hls.Events.ERROR, (e, data) => {
          this._onError(e);
        });
        this.hls.loadSource(url);
        this.hls.attachMedia(this._root.current);
      });
    }
  }

  render = () => {
    const {
      volume,
      muted,
      controls,
      paused,
      style,
      poster,
      repeat,
      resizeMode,
      autoPlay = !paused,
    } = this.props;

    return (
      <VideoComponent
        ref={this._root}
        src={this._getSource}
        onLoadStart={this._onLoadStart}
        onLoadedData={this._onLoad}
        onError={this._onError}
        onProgress={this._onProgress}
        onTimeUpdate={this._onProgress}
        onSeeking={this._onSeek}
        onEnded={this._onEnd}
        onLoadedMetadata={this.props.onTimedMetadata}
        onCanPlay={this._onReady}
        onStalled={this.props.onPlaybackStalled}
        volume={volume}
        loop={repeat}
        controls={controls}
        paused={paused?.toString()}
        muted={muted}
        style={StyleSheet.flatten([style, { objectFit: resizeMode }])}
        poster={poster}
        playsInline={true}
        autoPlay={autoPlay}
      />
    );
  };
}

export default Video;
