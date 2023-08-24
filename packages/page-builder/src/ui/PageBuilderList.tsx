import {
  DragEndParams,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import DraggableFlatListFixed from './DraggableFlatListFixed';
import { PageBuilderElement, PageBuilderElementPayload } from '../types';
import { ElementContainer, ElementContainerProps } from './ElementContainer';
import { HStack, IconButton, IIconButtonProps } from 'native-base';
import { BinIcon, DragIcon } from './Icons';
import React from 'react';

export type PageBuilderListProps = {
  data: PageBuilderElementPayload[];
  elements: { [key: string]: PageBuilderElement<any> };
  onRemove?: (index: number) => void;
  onMove?: (from: number, to: number) => void;
  onChange?: (data: PageBuilderElementPayload[]) => void;
  namePrefix?: string;
  elementContainerProps?: Omit<ElementContainerProps, 'title'>;
  removeIconProps?: IIconButtonProps;
  dragIconProps?: IIconButtonProps;
};

export const PageBuilderList = (props: PageBuilderListProps) => {
  const {
    data,
    elements,
    namePrefix,
    onMove,
    onRemove,
    onChange,
    elementContainerProps,
    removeIconProps,
    dragIconProps,
  } = props;

  const handleRemove = (item: any, index: number) => {
    onChange?.(data.filter((e) => item !== e));
    onRemove?.(index);
  };
  const handleDragEnd = (params: DragEndParams<PageBuilderElementPayload>) => {
    onMove?.(params.from, params.to);
    onChange?.(params.data);
  };

  const renderItem = (params: RenderItemParams<PageBuilderElementPayload>) => {
    const { item, getIndex, drag, dragCancel, isActive } = params as any;
    const element = elements[item.type];
    return (
      <ElementContainer
        mb={3}
        {...elementContainerProps}
        title={element.title}
        isDragging={isActive}
        actions={
          <HStack alignItems={'center'} justifyContent={'center'}>
            <IconButton
              {...removeIconProps}
              onPress={() => {
                handleRemove(item, getIndex());
              }}
            >
              <BinIcon
                color={removeIconProps?.color}
                style={{ color: removeIconProps?.color }}
              />
            </IconButton>
            <IconButton
              {...dragIconProps}
              onLongPress={drag}
              onPressOut={dragCancel}
              delayLongPress={20}
              disabled={isActive}
              isDisabled={isActive}
              focusable={false}
            >
              <DragIcon style={{ color: dragIconProps?.color }} />
            </IconButton>
          </HStack>
        }
      >
        {React.createElement(element.Edit, {
          name: `${namePrefix}.${getIndex()}.value`,
        })}
      </ElementContainer>
    );
  };

  return (
    <DraggableFlatListFixed<PageBuilderElementPayload>
      data={data}
      renderItem={renderItem}
      onDragEnd={handleDragEnd}
      keyExtractor={(item) => item.key}
    />
  );
};
