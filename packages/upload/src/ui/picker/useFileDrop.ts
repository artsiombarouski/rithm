import { useCallback, useEffect, useRef } from 'react';

type UseFileDropProps = {
  containerRef: any;
  onDrop: (files: File[]) => void;
  onClick: (e: any) => void;
  onDragging?: (dragging: boolean) => void;
  multiple?: boolean;
};

export function useFileDrop(props: UseFileDropProps) {
  const { containerRef, onDrop, onClick, onDragging, multiple } = props;
  const draggingCount = useRef(0);

  const handleDragIn = useCallback((ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    draggingCount.current++;
    if (ev.dataTransfer.items && ev.dataTransfer.items.length !== 0) {
      onDragging?.(true);
    }
  }, []);
  const handleDragOut = useCallback((ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    draggingCount.current--;
    if (draggingCount.current > 0) return;
    onDragging?.(false);
  }, []);
  const handleDrag = useCallback((ev) => {
    ev.preventDefault();
    ev.stopPropagation();
  }, []);
  const handleDrop = useCallback(
    (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      onDragging?.(false);
      draggingCount.current = 0;

      const eventFiles = ev.dataTransfer.files;
      if (eventFiles && eventFiles.length > 0) {
        onDrop(multiple ? eventFiles : [eventFiles[0]]);
      }
    },
    [onDrop],
  );
  useEffect(() => {
    const ele = containerRef.current;
    ele.addEventListener('click', onClick);
    ele.addEventListener('dragenter', handleDragIn);
    ele.addEventListener('dragleave', handleDragOut);
    ele.addEventListener('dragover', handleDrag);
    ele.addEventListener('drop', handleDrop);
    return () => {
      ele.removeEventListener('click', onClick);
      ele.removeEventListener('dragenter', handleDragIn);
      ele.removeEventListener('dragleave', handleDragOut);
      ele.removeEventListener('dragover', handleDrag);
      ele.removeEventListener('drop', handleDrop);
    };
  }, [
    onClick,
    handleDragIn,
    handleDragOut,
    handleDrag,
    handleDrop,
    containerRef,
  ]);
}
