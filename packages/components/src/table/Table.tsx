import { TableColumn } from './types';
import {
  Box,
  Divider,
  FlatList,
  HStack,
  ITextProps,
  Pressable,
  Text,
  VStack,
} from 'native-base';
import { IHStackProps } from 'native-base/lib/typescript/components/primitives/Stack/HStack';
import { IVStackProps } from 'native-base/lib/typescript/components/primitives/Stack/VStack';
import { useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';

export type TableHeaderProps<TItem> = IHStackProps & {
  columns: TableColumn<TItem>[];
};

export function TableHeaderProps<TItem>(props: TableHeaderProps<TItem>) {
  const { columns, ...restProps } = props;
  const titleProps: ITextProps = {
    color: 'primary.500',
    fontWeight: 'bold',
  };
  const renderTitle = (column: TableColumn<TItem>) => {
    const { key, title = key, flex, width } = column;

    return (
      <Box flex={flex} alignItems={'stretch'} width={width}>
        {typeof title === 'string' ? (
          <Text {...titleProps}>{title}</Text>
        ) : (
          title()
        )}
      </Box>
    );
  };
  return <HStack {...restProps}>{columns.map(renderTitle)}</HStack>;
}

export type TableProps<TItem> = IVStackProps & {
  columns: TableColumn<TItem>[];
  data?: TItem[];
  itemKey?: string;
  onRowClick?: (item: TItem) => void;
  rowProps?: Omit<IHStackProps, 'size'>;
  headerProps?: Omit<IHStackProps, 'size'>;
};

export function Table<TItem>(props: TableProps<TItem>) {
  const listRef = useRef(null);
  const [widthDiff, setWidthDiff] = useState(0);
  const [parentWidth, setParentWidth] = useState<number>(0);
  const [listWidth, setListWidth] = useState<number>(0);

  const handleParentLayout = (e: LayoutChangeEvent) => {
    setParentWidth(e.nativeEvent.layout.width);
  };
  const handleListContentSize = (width: number, height: number) => {
    setListWidth(width);
  };

  useEffect(() => {
    setWidthDiff(parentWidth - listWidth);
  }, [parentWidth, listWidth]);

  const {
    columns,
    data,
    itemKey = 'id',
    onRowClick,
    space,
    rowProps = {
      minHeight: '60px',
    },
    headerProps = {
      minHeight: '48px',
      alignItems: 'center',
    },
    ...restProps
  } = props;

  const renderRowColumn = (column: TableColumn<TItem>, item: TItem) => {
    const { key, render, flex, width } = column;
    return (
      <Box flex={flex} alignItems={'stretch'} width={width}>
        {render ? render(item) : <Text>{item[key]?.toString() ?? '-'}</Text>}
      </Box>
    );
  };

  const renderRow = (item: TItem) => {
    return (
      <Pressable key={item[itemKey]} onPress={() => onRowClick?.(item)}>
        {({ isHovered, isPressed }) => {
          return (
            <HStack
              space={space}
              alignItems={'center'}
              bg={
                isPressed
                  ? 'coolGray.200'
                  : isHovered
                  ? 'coolGray.100'
                  : undefined
              }
              {...rowProps}
            >
              {columns.map((column) => renderRowColumn(column, item))}
            </HStack>
          );
        }}
      </Pressable>
    );
  };

  useEffect(() => {
    listRef?.current?.scrollToOffset({ offset: 0, animated: false });
  }, [data]);

  return (
    <VStack {...restProps} onLayout={handleParentLayout}>
      <TableHeaderProps
        columns={columns}
        space={space}
        {...headerProps}
        mr={`${widthDiff}px`}
      />
      <Divider />
      <FlatList
        ref={listRef}
        data={data}
        renderItem={({ item }) => renderRow(item)}
        style={[{ flex: 1 }]}
        onContentSizeChange={handleListContentSize}
      />
    </VStack>
  );
}
