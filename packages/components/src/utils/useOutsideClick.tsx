import React from 'react';

export const useOutsideClick = (
  refs: (React.MutableRefObject<any> | string)[],
  callback: () => void,
  enabled?: boolean,
) => {
  React.useEffect(() => {
    const findMatchingRef = (event: MouseEvent) => {
      return refs.find((e) => {
        if (typeof e === 'string') {
          return e === (event.target as any).id;
        }
        return e.current && e.current!.contains?.(event.target);
      });
    };
    const handleMouseUp = (event: MouseEvent) => {
      if (!enabled) {
        return;
      }
      const matchingRef: any = findMatchingRef(event);
      if (!matchingRef) {
        event.preventDefault();
        callback();
      }
    };
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [refs, callback, enabled]);
};
