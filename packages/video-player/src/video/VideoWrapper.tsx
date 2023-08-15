import { useVideoHelper } from '../VideoHelper';
import { useAppState } from '../hooks';
import type { VisibilityInfo } from './VisibilityTracker';
import { VisibilityTracker } from './VisibilityTracker';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Video from 'react-native-video';

export type VideoWrapperProps = {
  children?: any;
  videoKey?: any;
  style?: StyleProp<ViewStyle>;
  requiredVisiblePercent?: number;
  onStateChange: (canPlay: boolean) => void;
  videoRef?: React.MutableRefObject<Video>;
  notifyWhenVisibilityChange?: boolean;
  trackAppFocus?: boolean;
  trackVisibility?: boolean;
};

export const VideoWrapper = observer((props: VideoWrapperProps) => {
  const {
    children,
    videoKey,
    style,
    requiredVisiblePercent = 50,
    onStateChange,
    videoRef,
    notifyWhenVisibilityChange,
    trackAppFocus = true,
    trackVisibility = true,
  } = props;
  const navigation = useNavigation();
  const isScreenFocused = useIsFocused();
  const { isAppFocused: isAppFocusedFromState } = useAppState();
  const isAppFocused = !trackAppFocus || isAppFocusedFromState;
  const videoHelper = useVideoHelper();
  const [canPlayVideo, setCanPlayVideo] = useState(
    isAppFocused && isScreenFocused,
  );

  useEffect(() => {
    const beforeRemoveUnsubscribe = navigation.addListener(
      'beforeRemove',
      () => {
        (videoRef?.current as any)?.setNativeProps({ paused: true });
      },
    );
    return () => {
      beforeRemoveUnsubscribe();
    };
  }, []);

  useEffect(() => {
    setCanPlayVideo(isAppFocused && isScreenFocused);
  }, [isAppFocused, isScreenFocused]);

  const handleVisibilityChange = (info: VisibilityInfo) => {
    const canPlay = info.percent >= requiredVisiblePercent;
    if (isEmpty(videoHelper) || !videoHelper?.addVisibleVideo) {
      if (notifyWhenVisibilityChange) {
        onStateChange?.(canPlay && canPlayVideo);
      }
      return;
    }
    if (canPlay) {
      videoHelper?.addVisibleVideo(videoKey);
    } else {
      videoHelper?.removeVisibleVideo(videoKey);
    }
    if (notifyWhenVisibilityChange) {
      onStateChange?.(canPlayVideo && videoHelper.canPlay(videoKey));
    }
  };

  useEffect(() => {
    return () => {
      videoHelper?.removeVisibleVideo?.(videoKey);
    };
  }, []);

  const canPlay =
    canPlayVideo && (isEmpty(videoHelper) || videoHelper?.canPlay(videoKey));

  useEffect(() => {
    onStateChange(canPlay);
  }, [canPlay]);

  return (
    <VisibilityTracker
      style={style}
      enabled={canPlayVideo && trackVisibility}
      onVisibilityChange={handleVisibilityChange}
    >
      {children}
    </VisibilityTracker>
  );
});
