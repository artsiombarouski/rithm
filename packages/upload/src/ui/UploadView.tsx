import { observer } from 'mobx-react-lite';
import { useUploadService, UseUploadServiceProps } from '../service';
import { UploadGridView } from './grid';
import { UploadSingleView } from './single';
import { StyleProp, ViewStyle } from 'react-native';
import { UploadPickerViewProps } from './picker';
import { useImperativeHandle } from 'react';
import { FileContainerViewProps } from './files/FileContainerView';

export type UploadViewRef = {
  haveUploadsInProgress: () => boolean;
};

export type UploadViewProps<TControllerOptions = any> =
  UseUploadServiceProps & {
    options?: TControllerOptions;
    inline?: boolean;
    item?: {
      style?: StyleProp<ViewStyle>;
      containerProps?: Partial<FileContainerViewProps>;
    };
    picker?: Pick<
      UploadPickerViewProps,
      'style' | 'selectedStyle' | 'placeholder'
    >;
    gridEmptyPicker?: Pick<
      UploadPickerViewProps,
      'style' | 'selectedStyle' | 'placeholder'
    >;
    itemSpace?: number | string;
    supportedTypes?: string[];
  };

export const UploadView = observer<UploadViewProps>(
  (props, ref) => {
    const {
      options,
      multiple,
      inline,
      item,
      picker,
      itemSpace,
      gridEmptyPicker,
      supportedTypes,
    } = props;
    const service = useUploadService({ ...props, multiple: multiple });

    useImperativeHandle(
      ref,
      () => {
        return {
          haveUploadsInProgress: () => {
            return service.uploadFiles.filter((e) => e.isUploading).length > 0;
          },
        };
      },
      [],
    );

    if (!multiple) {
      return (
        <UploadSingleView
          service={service}
          options={options}
          inline={inline}
          itemSpace={itemSpace}
          itemStyle={item?.style}
          itemContainerProps={item?.containerProps}
          pickerProps={{ supportedTypes, ...picker }}
        />
      );
    }
    return (
      <UploadGridView
        service={service}
        options={options}
        itemSpace={itemSpace}
        itemStyle={item?.style}
        itemContainerProps={item?.containerProps}
        pickerProps={{ supportedTypes, ...picker }}
        emptyPickerProps={{ supportedTypes, ...gridEmptyPicker }}
      />
    );
  },
  { forwardRef: true },
);
