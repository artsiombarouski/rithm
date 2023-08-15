import { platformValue } from '../utils';
import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import { useWindowDimensions, View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface VisibilityInfo {
  percent: number;
}

export type VisibilityTrackerProps = {
  enabled?: boolean;
  intervalMs?: number;
  offsets?: { left?: number; top?: number; right?: number; bottom?: number };
  onVisibilityChange?: (info: VisibilityInfo) => void;
} & ViewProps;

export const VisibilityTracker = (props: VisibilityTrackerProps) => {
  const {
    children,
    enabled = true,
    intervalMs = 200,
    offsets = {},
    onVisibilityChange,
    ...restProps
  } = props;

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const mountedRef = useRef<boolean>(false);
  const viewRef = useRef<View>(null);
  const insets = useSafeAreaInsets();
  const [currentVisibleInfo, setCurrentVisibleInfo] = useReducer(
    (state, action) => {
      if (state.percent !== action.percent) {
        return { percent: action.percent };
      }
      return state;
    },
    { percent: 0 },
  );

  const offsetLeft = (offsets.left ?? 0) + insets.left;
  const offsetTop = (offsets.top ?? 0) + insets.top;
  const offsetRight = (offsets.right ?? 0) + insets.right;
  const offsetBottom = (offsets.bottom ?? 0) + insets.bottom;

  const checkCallback = (x, y, width, height, pageX, pageY) => {
    const isCoveringFullHeight =
      pageY <= offsetTop && pageY + height >= screenHeight - offsetBottom;
    const isCoveringFullWidth =
      pageX <= offsetLeft && pageX + width >= screenWidth - offsetRight;
    const heightOutOfView = Math.min(
      height,
      Math.max(offsetTop - pageY, 0) +
        Math.max(pageY + height - (screenHeight - offsetBottom), 0),
    );
    const widthOutOfView = Math.min(
      width,
      Math.max(offsetLeft - pageX, 0) +
        Math.max(pageX + width - (screenWidth - offsetRight), 0),
    );
    const fractionHeightInView =
      height === 0 || isCoveringFullHeight ? 1 : 1 - heightOutOfView / height;
    const fractionWidthInView =
      width === 0 || isCoveringFullWidth ? 1 : 1 - widthOutOfView / width;
    const itemVisiblePercent = Math.round(
      fractionHeightInView * fractionWidthInView * 100,
    );
    if (!mountedRef.current) {
      return;
    }
    setCurrentVisibleInfo({ percent: itemVisiblePercent });
  };

  const performCheck = useCallback(() => {
    if (!viewRef.current) {
      return;
    }
    viewRef.current.measure(checkCallback);
  }, [viewRef]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    performCheck();
    const interval = setInterval(performCheck, intervalMs);
    return () => {
      clearInterval(interval);
    };
  }, [enabled, intervalMs]);

  useEffect(() => {
    onVisibilityChange?.(currentVisibleInfo);
  }, [currentVisibleInfo, onVisibilityChange]);

  return (
    <View ref={viewRef} collapsable={platformValue(true, false)} {...restProps}>
      {children}
    </View>
  );
};
