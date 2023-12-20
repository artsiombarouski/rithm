import { RithmListFooter } from './RithmListFooter';
import { FlatList } from 'native-base';
import { IFlatListProps } from 'native-base/lib/typescript/components/basic/FlatList';
import React, { LegacyRef } from 'react';
import {
  FlatList as NativeFlatList,
  ListRenderItemInfo,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

export type RithmFlatListProps<ItemT = any> = {
  listRef?: LegacyRef<NativeFlatList>;
  renderItem: RithmListRenderItem<ItemT> | null | undefined;
  spacing?: number;
  hasMore?: boolean;
  initialLoading?: boolean;
  footer?: React.ComponentType<any> | React.ReactElement | null | undefined;
  renderMore?: any;
} & Omit<IFlatListProps<ItemT>, 'renderItem' | 'ListFooterComponent'> & {
    key?: string;
  };

export type RithmListRenderItem<ItemT> = (
  info: RithmListRenderItemInfo<ItemT>,
) => React.ReactElement | null;

export type RithmListRenderItemInfo<ItemT> = {
  data: ReadonlyArray<ItemT> | null | undefined;
} & ListRenderItemInfo<ItemT>;

export function RithmFlatList<ItemT>(props: RithmFlatListProps<ItemT>) {
  const {
    data,
    numColumns,
    renderItem,
    spacing,
    listRef,
    inverted,
    hasMore,
    initialLoading,
    footer,
    ListEmptyComponent,
    renderMore,
    ...restProps
  } = props;
  const renderItemCallback = (
    item: ListRenderItemInfo<ItemT>,
  ): React.ReactElement | null => {
    // Updating default item with list data
    Object.assign(item, { data });
    let containerStyle: StyleProp<ViewStyle>;
    // Applying spacing
    if (spacing) {
      const itemIndex = item.index;
      // We don't set left/right spacing if it's list with one column
      if (numColumns && numColumns > 1) {
        const totalRows = Math.ceil(data.length / numColumns);
        const isLastRow = Math.ceil((itemIndex + 1) / numColumns) === totalRows;
        const spacesToFill =
          data.length % numColumns !== 0
            ? numColumns -
              (data.length - Math.floor(data.length / numColumns) * numColumns)
            : 0;
        containerStyle = {
          marginLeft: itemIndex % numColumns !== 0 ? spacing : 0,
          marginRight:
            itemIndex === data.length - 1 && isLastRow
              ? spacing * spacesToFill
              : 0,
          marginBottom: isLastRow ? 0 : spacing,
          flex: 1 / numColumns,
        };
      } else {
        containerStyle = {
          marginBottom: (inverted ? itemIndex > 0 : itemIndex < data.length - 1)
            ? spacing
            : 0,
        };
      }
    }
    if (containerStyle) {
      return (
        <View style={[containerStyle, { width: '100%', height: 'auto' }]}>
          {props.renderItem(item as any)}
        </View>
      );
    }
    return props.renderItem(item as any);
  };

  if (Platform.OS === 'web') {
    restProps.style = StyleSheet.flatten([
      restProps.style,
      // Required for make scrollbars overlay content
      { overflow: 'overlay' as any },
    ]);
  }

  const canShowEmpty = !initialLoading && !hasMore && data.length === 0;
  const targetFlexGrow = canShowEmpty ? 1 : undefined;

  return (
    <FlatList<ItemT>
      ref={listRef as any}
      data={data}
      inverted={inverted}
      numColumns={numColumns}
      renderItem={renderItemCallback}
      onEndReachedThreshold={0.1}
      ListFooterComponent={
        <RithmListFooter
          spacing={spacing}
          numColumns={numColumns}
          hasMore={hasMore}
          initialLoading={initialLoading}
          canShowEmpty={canShowEmpty}
          emptyComponent={ListEmptyComponent}
          renderMore={renderMore}
        >
          {footer &&
            (typeof footer === 'function'
              ? React.createElement(footer)
              : footer)}
        </RithmListFooter>
      }
      {...restProps}
      ListFooterComponentStyle={StyleSheet.flatten([
        {
          flexGrow: targetFlexGrow,
        },
        props.ListFooterComponentStyle,
      ])}
      contentContainerStyle={StyleSheet.flatten([
        props.contentContainerStyle,
        {
          flexGrow: targetFlexGrow,
        },
      ])}
    />
  );
}