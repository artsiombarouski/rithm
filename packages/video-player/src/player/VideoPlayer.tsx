import { useBasePlaybackVideoProps } from '../hooks';
import { VideoProps, VideoView } from '../video';
import { VideoPlayerButtonProps } from './VideoPlayerButton';
import { VideoPlayerController } from './VideoPlayerController';
import { VideoPlayerControls } from './VideoPlayerControls';
import { VideoPlayerInteractOverlay } from './VideoPlayerInteractOverlay';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React, { useCallback, useEffect, useRef } from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

export type VideoPlayerProps = VideoProps & {
  shadeStyle?: StyleProp<ViewStyle>;
  autoPlay?: boolean;
  canShowBottomControls?: boolean;
  centerPlayerButtonProps?: VideoPlayerButtonProps;
};

export const VideoPlayer = observer<VideoPlayerProps>((props) => {
  const {
    shadeStyle,
    canShowBottomControls,
    autoPlay,
    muted = false,
    centerPlayerButtonProps,
    ...restProps
  } = props;
  const videoRef = useRef();
  const uiVisibility = useSharedValue(0);
  const controller = useLocalObservable(() => {
    return new VideoPlayerController(uiVisibility, videoRef, autoPlay, muted);
  });
  const playerProps = useBasePlaybackVideoProps({ store: controller });
  const toggleUi = useCallback(() => {
    controller.toggleUi(Platform.select({ web: true, default: undefined }));
  }, [controller]);

  useEffect(() => {
    return () => {
      controller.destroy();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <VideoPlayerInteractOverlay
        onToggleUi={toggleUi}
        onTogglePlay={() => {
          controller.togglePause();
        }}
        onToggleFullscreen={() => {
          controller.enterFullscreen();
        }}
      >
        <VideoView
          ref={videoRef}
          playInBackground={false}
          playWhenInactive={false}
          muted={controller.isMuted}
          style={styles.video}
          resizeMode={'cover'}
          repeat={true}
          wrapperProps={{
            trackVisibility: true,
            style: styles.videoWrapper,
            notifyWhenVisibilityChange: true,
          }}
          {...restProps}
          {...playerProps}
        />
        <VideoPlayerControls
          shadeStyle={shadeStyle}
          controller={controller}
          canShowBottomControls={canShowBottomControls}
          centerPlayerButtonProps={centerPlayerButtonProps}
        />
      </VideoPlayerInteractOverlay>
    </View>
  );
});

const styles = StyleSheet.create({
  videoWrapper: {
    height: '100%',
    backgroundColor: 'black',
  },
  video: {
    height: '100%',
  },
});
