import { UploadService } from '../service';
import { StyleProp, ViewStyle } from 'react-native';
import { UploadPickerViewProps } from './picker';
import { FileContainerViewProps } from './files/FileContainerView';

export type UploadComponentViewProps<TControllerOptions = any> = {
  service: UploadService;
  options?: TControllerOptions;
  itemStyle?: StyleProp<ViewStyle>;
  itemContainerProps?: Partial<FileContainerViewProps>;
  pickerProps?: Partial<UploadPickerViewProps>;
};

export type UploadItemProps = {
  style?: StyleProp<ViewStyle>;
  onRemoveClicked?: () => void;
  containerProps?: Partial<FileContainerViewProps>;
};
