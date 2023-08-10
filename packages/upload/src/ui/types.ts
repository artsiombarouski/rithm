import { UploadService } from '../service';
import { StyleProp, ViewStyle } from 'react-native';
import { UploadPickerViewProps } from './picker';

export type UploadComponentViewProps<TControllerOptions = any> = {
  service: UploadService;
  options?: TControllerOptions;
  itemStyle?: StyleProp<ViewStyle>;
  pickerProps?: Partial<UploadPickerViewProps>;
};

export type UploadItemProps = {
  style?: StyleProp<ViewStyle>;
  onRemoveClicked?: () => void;
};
