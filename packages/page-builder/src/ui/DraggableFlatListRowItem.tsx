import React, { useRef } from 'react';
import { RenderItem } from 'react-native-draggable-flatlist';
import { useDraggableFlatListContext } from 'react-native-draggable-flatlist/lib/module/context/draggableFlatListContext';
import { useRefs } from 'react-native-draggable-flatlist/lib/module/context/refContext';
import { useStableCallback } from 'react-native-draggable-flatlist/lib/module/hooks/useStableCallback';
import { typedMemo } from 'react-native-draggable-flatlist/lib/module/utils';

type Props<T> = {
  extraData?: any;
  drag: (itemKey: string) => void;
  dragCancel: (itemKey: string) => void;
  item: T;
  renderItem: RenderItem<T>;
  itemKey: string;
  debug?: boolean;
};

function RowItem<T>(props: Props<T>) {
  const propsRef = useRef(props);
  propsRef.current = props;

  const { activeKey } = useDraggableFlatListContext();
  const activeKeyRef = useRef(activeKey);
  activeKeyRef.current = activeKey;
  const { keyToIndexRef } = useRefs();

  const drag = useStableCallback(() => {
    const { drag, itemKey, debug } = propsRef.current;
    if (activeKeyRef.current) {
      // already dragging an item, noop
      if (debug)
        console.log(
          '## attempt to drag item while another item is already active, noop',
        );
    }
    drag(itemKey);
  });

  const dragCancel = useStableCallback(() => {
    const { dragCancel, itemKey } = propsRef.current;
    dragCancel(itemKey);
  });

  const { renderItem, item, itemKey, extraData } = props;

  const getIndex = useStableCallback(() => {
    return keyToIndexRef.current.get(itemKey);
  });

  return (
    <MemoizedInner
      isActive={activeKey === itemKey}
      drag={drag}
      dragCancel={dragCancel}
      renderItem={renderItem}
      item={item}
      getIndex={getIndex}
      extraData={extraData}
    />
  );
}

export default typedMemo(RowItem);

type InnerProps<T> = {
  isActive: boolean;
  item: T;
  getIndex: () => number | undefined;
  drag: () => void;
  renderItem: RenderItem<T>;
  extraData?: any;
};

function Inner<T>({ renderItem, extraData, ...rest }: InnerProps<T>) {
  return renderItem({ ...rest }) as JSX.Element;
}

const MemoizedInner = typedMemo(Inner);
