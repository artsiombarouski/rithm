import { observer } from 'mobx-react-lite';
import { FlatList, useBreakpointValue, useToken } from 'native-base';
import { IFlatListProps } from 'native-base/lib/typescript/components/basic/FlatList';
import { StoredFile, UploadFile } from '../service';
import {
  ListRenderItemInfo,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { UploadComponentViewProps } from './types';
import { StoredFileView, UploadFileView } from './files';
import {
  UploadPickerLargePlaceholder,
  UploadPickerView,
  UploadPickerViewProps,
} from './picker';
import React from 'react';

export type UploadGridViewProps = Partial<
  IFlatListProps<StoredFile | UploadFile>
> &
  UploadComponentViewProps & {
    itemSpace?: number | string;
    emptyPickerProps?: Partial<UploadPickerViewProps>;
  };

export const UploadGridView = observer<UploadGridViewProps>((props) => {
  const {
    service,
    options,
    itemStyle,
    pickerProps,
    emptyPickerProps,
    itemSpace = 8,
    numColumns: externalNumColumns,
    ...restProps
  } = props;
  const defaultNumColumns = useBreakpointValue({
    base: 2,
    sm: 4,
  });
  const spacing = useToken('spacing', itemSpace);
  const numColumns = externalNumColumns ?? defaultNumColumns;
  const handlePick = (files: File[]) => {
    files.map((file) => service.upload(file, options));
  };

  const targetItemStyle = StyleSheet.flatten([{ flex: 1 }, itemStyle]);

  let data = [...service.storedFiles, ...service.uploadFiles];
  if (data.length > 0) {
    data.push({ key: 'upload-placeholder' });
  }

  const renderItem = ({ item, index }: ListRenderItemInfo<any>) => {
    if (index == data.length - 1) {
      return (
        <UploadPickerView
          onPicked={handlePick}
          {...pickerProps}
          style={[
            pickerProps?.style,
            { flex: 1, height: '100%', width: '100%' },
          ]}
        />
      );
    }
    if (item instanceof UploadFile) {
      return (
        <UploadFileView
          file={item}
          style={targetItemStyle}
          onRemoveClicked={() => {
            service.remove(item);
          }}
        />
      );
    }
    return (
      <StoredFileView
        file={item}
        style={targetItemStyle}
        onRemoveClicked={() => {
          service.remove(item);
        }}
      />
    );
  };

  const renderItemWithWrapper = (info: ListRenderItemInfo<any>) => {
    let containerStyle: StyleProp<ViewStyle>;
    // Applying spacing
    if (spacing) {
      const itemIndex = info.index;
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
          marginBottom: (
            restProps.inverted ? itemIndex > 0 : itemIndex < data.length - 1
          )
            ? spacing
            : 0,
        };
      }
    }
    if (containerStyle) {
      return (
        <View
          style={[
            containerStyle,
            { width: '100%', height: 'auto', aspectRatio: 1.0 },
          ]}
        >
          {renderItem(info)}
        </View>
      );
    }
    return renderItem(info);
  };

  return (
    <FlatList<any>
      key={`upload-grid-${numColumns}`}
      data={data as any}
      numColumns={numColumns}
      renderItem={renderItemWithWrapper}
      keyExtractor={(item) => item.key ?? item.url}
      columnWrapperStyle={{
        flex: 1,
        justifyContent: 'flex-start',
      }}
      ListEmptyComponent={() => {
        return (
          <UploadPickerView
            onPicked={handlePick}
            style={{ width: '100%' }}
            placeholder={(props) => <UploadPickerLargePlaceholder {...props} />}
            {...emptyPickerProps}
          />
        );
      }}
      {...restProps}
    />
  );
});
