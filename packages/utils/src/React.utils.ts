import deepEqual from 'deep-equal';
import React from 'react';

export function memoDeepEqual<T extends object>(component: any) {
  return React.memo<T>(component, (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps);
  });
}

export function isPromise(value: any) {
  return Boolean(value && typeof value.then === 'function');
}
