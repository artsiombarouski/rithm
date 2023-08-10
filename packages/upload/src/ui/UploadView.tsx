import { observer } from 'mobx-react-lite';
import { useUploadService, UseUploadServiceProps } from '../service';
import { UploadGridView } from './UploadGridView';
import { UploadSingleView } from './single';
import { StyleProp, ViewStyle } from 'react-native';
import { UploadPickerViewProps } from './picker';

export type UploadViewProps<TControllerOptions = any> =
  UseUploadServiceProps & {
    options?: TControllerOptions;
    inline?: boolean;
    item?: {
      style?: StyleProp<ViewStyle>;
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
  };

export const UploadView = observer<UploadViewProps>((props) => {
  const {
    options,
    multiple,
    inline,
    item,
    picker,
    itemSpace,
    gridEmptyPicker,
  } = props;
  const service = useUploadService({ ...props, multiple: multiple });

  if (!multiple) {
    return (
      <UploadSingleView
        service={service}
        options={options}
        inline={inline}
        itemSpace={itemSpace}
        itemStyle={item?.style}
        pickerProps={picker}
      />
    );
  }
  return (
    <UploadGridView
      service={service}
      options={options}
      itemSpace={itemSpace}
      itemStyle={item?.style}
      pickerProps={picker}
      emptyPickerProps={gridEmptyPicker}
    />
  );
});
