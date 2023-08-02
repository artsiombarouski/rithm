import { TableColumn } from './types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import _ from 'lodash';
import {
  Box,
  Divider,
  FlatList,
  HStack,
  Icon,
  ITextProps,
  Pressable,
  Row,
  Text,
  Tooltip,
  VStack,
} from 'native-base';
import { IHStackProps } from 'native-base/lib/typescript/components/primitives/Stack/HStack';
import { IVStackProps } from 'native-base/lib/typescript/components/primitives/Stack/VStack';
import React, { useEffect, useMemo, useRef } from 'react';
import { FlatListProps, View } from 'react-native';

export type TableHeaderProps<TItem> = IHStackProps & {
  columns: TableColumn<TItem>[];
};

export function TableHeader<TItem>(props: TableHeaderProps<TItem>) {
  const { columns, ...restProps } = props;
  const defaultTitleProps: ITextProps = {
    color: 'blueGray.600',
    fontWeight: 'bold',
  };
  const renderTitle = (column: TableColumn<TItem>) => {
    const {
      key,
      title = key,
      flex,
      width,
      titleProps,
      tooltipText,
      tooltipIcon,
    } = column;
    const props = { ...defaultTitleProps, ...titleProps };

    const textContent = useMemo(
      () =>
        typeof title === 'string' ? (
          <Text alignSelf={'flex-start'} {...props}>
            {title}
          </Text>
        ) : (
          title()
        ),
      [title, props],
    );

    return (
      <Box
        key={`header-${key}`}
        flex={flex}
        alignItems={'stretch'}
        width={width}
      >
        {tooltipText ? (
          <Tooltip placement={'top'} label={tooltipText}>
            <Row alignSelf={'flex-start'} alignItems={'center'}>
              {textContent}
              {tooltipIcon ? (
                tooltipIcon
              ) : (
                <Icon as={MaterialCommunityIcons} name="information" ml={1} />
              )}
            </Row>
          </Tooltip>
        ) : (
          textContent
        )}
      </Box>
    );
  };
  return <HStack {...restProps}>{columns.map(renderTitle)}</HStack>;
}

export type TableProps<TItem, WC extends View = any> = IVStackProps & {
  columns: TableColumn<TItem>[];
  data?: TItem[];
  itemKey?: string;
  onRowClick?: (item: TItem) => void;
  rowProps?: Omit<IHStackProps, 'size'>;
  headerProps?: Omit<IHStackProps, 'size'>;
  listProps?: Omit<FlatListProps<TItem>, 'data' | 'renderItem'>;
  WrapperComponent?: WC;
};

export function Table<TItem>(props: TableProps<TItem>) {
  const listRef = useRef(null);
  // const [widthDiff, setWidthDiff] = useState(0); //todo: remove if no need
  // const [parentWidth, setParentWidth] = useState<number>(0);
  // const [listWidth, setListWidth] = useState<number>(0);

  // const handleParentLayout = (e: LayoutChangeEvent) => {
  //   setParentWidth(e.nativeEvent.layout.width);
  // };
  // const handleListContentSize = (width: number, height: number) => {
  //   setListWidth(width);
  // };

  // useEffect(() => {
  //   setWidthDiff(Math.max(15, parentWidth - listWidth));
  // }, [parentWidth, listWidth]);

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
    listProps,
    WrapperComponent = View,
    ...restProps
  } = props;

  const { ListEmptyComponent, ...restListProps } = listProps;

  const renderRowColumn = (column: TableColumn<TItem>, item: TItem) => {
    const { key, render, flex, width, valueProps } = column;
    return (
      <Box key={`row-${key}`} flex={flex} alignItems={'stretch'} width={width}>
        {render ? (
          render(item)
        ) : (
          <Text {...valueProps}>
            {_.get(item, key.split('.'))?.toString() ?? '-'}
          </Text>
        )}
      </Box>
    );
  };

  const renderRow = (item: TItem) => {
    return (
      <WrapperComponent>
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
      </WrapperComponent>
    );
  };

  useEffect(() => {
    listRef?.current?.scrollToOffset({ offset: 0, animated: false });
  }, [data]);

  return (
    <VStack
      {...restProps}
      // onLayout={handleParentLayout}
    >
      <WrapperComponent>
        <TableHeader columns={columns} space={space} {...headerProps} />
        <Divider />
      </WrapperComponent>
      <FlatList
        ref={listRef}
        data={data}
        style={[{ flex: 1 }]}
        {...restListProps}
        renderItem={({ item }) => renderRow(item)}
        ListEmptyComponent={
          ListEmptyComponent ? (
            <WrapperComponent>{ListEmptyComponent}</WrapperComponent>
          ) : undefined
        }
        // onContentSizeChange={handleListContentSize}
      />
    </VStack>
  );
}
