import {
  ensureValidUrl,
  isNothing,
  memoDeepEqual,
  VIDEO_BUFFER_CONFIG,
} from '../utils';
import Video from './VideoImpl';
import { VideoWrapper, VideoWrapperProps } from './VideoWrapper';
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { OnLoadData, VideoProperties } from 'react-native-video';

export type VideoProps = {
  ref?: MutableRefObject<Video>;
  wrapperProps?: Omit<VideoWrapperProps, 'onStateChange'>;
  loadingIndicator?: React.ReactNode;
  poster?: React.ReactNode;
  posterImage?: string;
  resetOnDetach?: boolean;
  source?: string;
  onAutoPlayFailed?: () => void;
} & Omit<VideoProperties, 'poster' | 'source'>;

export type VideoRef = Video;

export const VideoView = memoDeepEqual<VideoProps>(
  React.forwardRef<Video, VideoProps>((props, videoRef) => {
    const {
      source,
      paused,
      onLoad,
      onReadyForDisplay,
      wrapperProps = {},
      loadingIndicator,
      poster,
      posterImage,
      resetOnDetach,
      ...restProps
    } = props;
    const [isForcePaused, setForcePaused] = useState(
      wrapperProps.trackVisibility ?? true,
    );
    const [isLoaded, setIsLoaded] = useState(false);
    const [isReadyForDisplay, setIsReadyForDisplay] = useState(false);

    const [isLoadedNotified, setLoadedNotified] = useState(false);
    const [isCanPlayNotified, setCanPlayNotified] = useState(false);

    const handleStateChange = useCallback(
      (canPlay: boolean) => {
        setForcePaused(!canPlay);
        if (!canPlay && resetOnDetach) {
          setLoadedNotified(false);
          setCanPlayNotified(false);
        }
      },
      [setForcePaused, setCanPlayNotified, resetOnDetach],
    );

    const handleLoadEvent = useCallback(
      (data: OnLoadData) => {
        if (isLoadedNotified) {
          return;
        }
        setIsLoaded(true);
        setLoadedNotified(true);
        onLoad?.(data);
      },
      [isLoadedNotified, onLoad],
    );

    const handleReadyEvent = useCallback(() => {
      if (isCanPlayNotified) {
        return;
      }
      setCanPlayNotified(true);
      onReadyForDisplay?.();
    }, [isCanPlayNotified, onReadyForDisplay]);

    useEffect(() => {
      setLoadedNotified(false);
      setCanPlayNotified(false);
    }, [source]);

    const sourceToSet = useMemo(() => {
      if (isNothing(source)) {
        return undefined;
      }
      return { uri: ensureValidUrl(source) };
    }, [source]);

    useEffect(() => {
      if (isLoaded && isReadyForDisplay) {
        handleReadyEvent();
      }
    }, [isLoaded, handleReadyEvent, isReadyForDisplay]);

    const videoView = useMemo(() => {
      const isPaused = isForcePaused || (paused ?? false);
      return (
        <Video
          ref={(newRef) => {
            if (!videoRef) {
              return;
            }
            const forwardRef = videoRef as any;
            if (!newRef && forwardRef.current) {
              (forwardRef.current as any)?.setNativeProps({ paused: true });
            }
            forwardRef.current = newRef;
            if (newRef) {
              (newRef as any)?.setNativeProps({
                paused: isPaused,
              });
            }
          }}
          paused={isPaused}
          ignoreSilentSwitch={'ignore'}
          bufferConfig={VIDEO_BUFFER_CONFIG}
          poster={posterImage}
          {...restProps}
          source={sourceToSet}
          onLoad={handleLoadEvent}
          onReadyForDisplay={() => setIsReadyForDisplay(true)}
        />
      );
    }, [
      videoRef,
      sourceToSet,
      paused,
      isForcePaused,
      posterImage,
      restProps,
      handleLoadEvent,
      handleReadyEvent,
    ]);

    const canShowVideo = !(resetOnDetach && isForcePaused);

    return (
      <VideoWrapper
        {...wrapperProps}
        videoRef={videoRef as any}
        onStateChange={handleStateChange}
      >
        {canShowVideo && !isNothing(source) && videoView}
        {!isCanPlayNotified && poster}
        {!isCanPlayNotified && !isForcePaused && loadingIndicator}
      </VideoWrapper>
    );
  }),
);
