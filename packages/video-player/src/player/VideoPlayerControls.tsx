import {
  icFullscreen,
  icPause,
  icPlay,
  icSoundOff,
  icSoundUp,
} from '../assets';
import { formatPlayerProgress } from '../utils';
import LinearGradient from './LinearGradient';
import { VideoPlayerButton } from './VideoPlayerButton';
import { VideoPlayerController } from './VideoPlayerController';
import { VideoPlayerIcon } from './VideoPlayerIcon';
import { observer } from 'mobx-react-lite';
import { Slider, Text } from 'native-base';
import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  controller: VideoPlayerController;
  shadeStyle?: StyleProp<ViewStyle>;
  canShowBottomControls?: boolean;
};

export const VideoPlayerControls = observer<Props>((props) => {
  const { controller, shadeStyle, canShowBottomControls = true } = props;
  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(controller.uiVisibilityValue.value, {
        duration: 100,
      }),
    };
  }, [controller.uiVisibilityValue.value]);
  return (
    <Animated.View
      style={[styles.container, containerStyle]}
      pointerEvents={controller.isUiVisible ? undefined : 'none'}
    >
      <LinearGradient
        style={StyleSheet.flatten([styles.shade, shadeStyle])}
        colors={[
          'transparent',
          'transparent',
          'rgba(0,0,0, 0.4)',
          'rgba(0,0,0, 0.7)',
        ]}
      />
      {canShowBottomControls && (
        <Pressable style={styles.buttonsContainer} onPress={() => {}}>
          <VideoPlayerIcon
            style={styles.button}
            source={controller.isManualPaused ? icPlay : icPause}
            onPress={() => {
              controller.togglePause();
            }}
            color={'white'}
          />
          {controller.duration ? (
            <View
              style={{
                flex: 1,
                paddingLeft: 16,
                paddingRight: 16,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Slider
                flex={1}
                step={1}
                value={controller.playProgress?.currentTime ?? 0}
                minValue={0}
                maxValue={controller.duration}
                onChange={(value) => {
                  controller.seekTo(value, true);
                }}
              >
                <Slider.Track>
                  <Slider.FilledTrack />
                </Slider.Track>
                <Slider.Thumb />
              </Slider>
              <Text style={{ paddingLeft: 16 }} color={'white'}>
                {formatPlayerProgress(
                  controller.playProgress?.currentTime ?? 0,
                )}
                {' / '}
                {formatPlayerProgress(controller.duration)}
              </Text>
            </View>
          ) : (
            <View style={{ flex: 1 }} />
          )}
          <VideoPlayerIcon
            style={styles.button}
            source={!controller.isMuted ? icSoundUp : icSoundOff}
            onPress={() => {
              controller.toggleMute();
            }}
            color={'white'}
          />
          <VideoPlayerIcon
            style={styles.button}
            source={icFullscreen}
            onPress={() => {
              controller.enterFullscreen();
            }}
            color={'white'}
          />
        </Pressable>
      )}
      {controller.isManualPaused && (
        <VideoPlayerButton
          style={styles.centerPlayButton}
          icon={controller.isManualPaused ? icPlay : icPause}
          onPress={() => {
            controller.togglePause();
          }}
          large={true}
          dark={true}
        />
      )}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    alignItems: 'center',
    zIndex: 1,
    justifyContent: 'flex-end',
  },
  button: {
    padding: 8,
  },
  shade: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: 96,
    borderRadius: 12,
  },
  centerPlayButton: {
    margin: 'auto',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
});
