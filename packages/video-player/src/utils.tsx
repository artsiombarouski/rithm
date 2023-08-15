import CssFilterConverter from 'css-filter-converter';
import deepEqual from 'deep-equal';
import { isEmpty, isNil, isUndefined } from 'lodash';
import React from 'react';
import { Platform } from 'react-native';

export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export function platformValue<T>(ios: T, android?: T, web?: T) {
  return isAndroid
    ? isUndefined(android)
      ? ios
      : android
    : isWeb
    ? isUndefined(web)
      ? ios
      : web
    : ios;
}

const validUrlRegex = new RegExp(
  '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$',
  'i',
);

export function isValidURL(str) {
  return !!validUrlRegex.test(str);
}

export const ensureValidUrl = (url: string) => {
  if (isWeb && url?.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  return url;
};

export function isNothing(something) {
  if (typeof something === 'number') {
    return something === 0;
  }
  return isEmpty(something) || isUndefined(something) || isNil(something);
}

export function memoDeepEqual<T extends object>(component: any) {
  return React.memo<T>(component, (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps);
  });
}

export const VIDEO_BUFFER_CONFIG = {
  minBufferMs: 1000,
  maxBufferMs: 50000,
  bufferForPlaybackMs: 1000,
  bufferForPlaybackAfterRebufferMs: 1000,
};

export const formatPlayerProgress = (
  valueSeconds: number | null | undefined,
  fallback?: string,
) => {
  if (!valueSeconds) {
    return fallback;
  }
  let minutes: any = Math.floor(valueSeconds / 60);
  minutes = minutes >= 10 ? minutes : '0' + minutes;
  let seconds: any = Math.floor(valueSeconds % 60);
  seconds = seconds >= 10 ? seconds : '0' + seconds;
  return `${minutes}:${seconds}`;
};

export const formatVideoDuration = (
  valueSeconds: number | null | undefined,
  fallback?: string,
) => {
  if (!valueSeconds) {
    return fallback;
  }
  const hours = Math.floor(valueSeconds / 3600);
  const minutes = Math.ceil((valueSeconds - hours * 3600) / 60);

  let result = '';
  if (hours > 0) {
    result += hours + 'h';
  }
  if (minutes > 0) {
    if (!isEmpty(result)) {
      result += ' ';
    }
    result += minutes + ' min';
  }
  return result;
};

export const computeFilters = (targetColor = '') => {
  let filter = '';
  let isValid = false;
  let opacity = '1';
  if (targetColor.startsWith('#')) {
    const { color, error } = CssFilterConverter.hexToFilter(targetColor);
    filter = color;
    isValid = !error;
  }
  if (targetColor.startsWith('rgb')) {
    const { color, error } = CssFilterConverter.rgbToFilter(targetColor);
    filter = color;
    isValid = !error;
  }
  if (targetColor.startsWith('rgba')) {
    const colorsArr = targetColor.match(/\d+/g).map(Number);
    const rgbColor = `rgb(${colorsArr[0]}, ${colorsArr[1]}, ${colorsArr[2]})`;
    const { color, error } = CssFilterConverter.rgbToFilter(rgbColor);
    filter = color;
    opacity = `${colorsArr[3]}.${colorsArr[4]}`;
    isValid = !error;
  }
  return {
    filter,
    isValid,
    opacity,
  };
};
