import { observer } from 'mobx-react-lite';
import { HStack } from 'native-base';
import { UploadComponentViewProps } from '../types';
import { UploadPickerView } from '../picker';
import { StoredFileView, UploadFileView } from '../files';
import { StyleSheet } from 'react-native';

export type UploadSingleViewProps = UploadComponentViewProps & {
  inline?: boolean;
  itemSpace?: number | string;
};

export const UploadSingleView = observer<UploadSingleViewProps>((props) => {
  const {
    service,
    options,
    inline,
    itemStyle,
    pickerProps,
    itemSpace = 'md',
    itemContainerProps,
  } = props;

  const storedFiles = service.storedFiles.slice();
  const uploadFiles = service.uploadFiles.slice();

  const handlePick = (files: File[]) => {
    files.map((file) => service.upload(file, options));
  };
  const haveAnyFiles =
    !service.isStoredFilesEmpty || !service.isUploadFilesEmpty;

  const targetItemStyle = StyleSheet.flatten([
    inline && haveAnyFiles
      ? { flex: 1 }
      : {
          width: '100px',
          height: '100px',
        },
    itemStyle,
  ]);

  const renderItems = () => {
    if (service.isUploadFilesEmpty) {
      return (
        <>
          {storedFiles.map((file) => {
            return (
              <StoredFileView
                key={file.key ?? file.url}
                file={file}
                style={targetItemStyle}
                containerProps={itemContainerProps}
                onRemoveClicked={() => {
                  service.remove(file);
                }}
              />
            );
          })}
        </>
      );
    }
    return (
      <>
        {uploadFiles.map((file) => {
          return (
            <UploadFileView
              key={file.key}
              file={file}
              style={[targetItemStyle]}
              containerProps={itemContainerProps}
              onRemoveClicked={() => {
                service.remove(file);
              }}
            />
          );
        })}
      </>
    );
  };

  return (
    <HStack space={itemSpace}>
      {!inline && renderItems()}
      <UploadPickerView
        onPicked={handlePick}
        forReplace={haveAnyFiles}
        clickable={!(inline && haveAnyFiles)}
        canShowReplaceOverlay={haveAnyFiles && inline}
        {...pickerProps}
        placeholder={
          inline && haveAnyFiles ? renderItems() : pickerProps.placeholder
        }
      />
    </HStack>
  );
});
