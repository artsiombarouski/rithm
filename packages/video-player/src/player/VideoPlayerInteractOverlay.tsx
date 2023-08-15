import { isWeb } from '../utils';
import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

export type VideoPlayerInteractOverlayProps = {
  onToggleUi: (visible?: boolean | undefined) => void;
  onTogglePlay: () => void;
  onToggleFullscreen?: () => void;
} & PropsWithChildren;

export const VideoPlayerInteractOverlay = (
  props: VideoPlayerInteractOverlayProps,
) => {
  const { children, onToggleUi, onTogglePlay, onToggleFullscreen } = props;
  if (isWeb) {
    return (
      <View
        style={{ flex: 1 }}
        // @ts-ignore
        onMouseMove={() => {
          onToggleUi(true);
        }}
        onClick={(event) => {
          onTogglePlay();
          if (event.detail >= 2) {
            onToggleFullscreen?.();
          }
        }}
        pointerEvents={'box-none'}
      >
        {children}
      </View>
    );
  }
  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .runOnJS(true)
    .onStart(() => onToggleUi());
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .runOnJS(true)
    .onStart(onTogglePlay);
  const composedGesture = Gesture.Exclusive(doubleTap, singleTap);
  return (
    <GestureDetector gesture={composedGesture}>{children}</GestureDetector>
  );
};
