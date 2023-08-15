import { observer } from 'mobx-react-lite';
import { FileContentView } from './FileContentView';
import { StoredFile } from '../../service';
import { UploadItemProps } from '../types';
import { FileContainerView } from './FileContainerView';
import { useUploadContext } from '../../provider';

export type StoredFileViewProps = UploadItemProps & {
  file: StoredFile;
};

export const StoredFileView = observer<StoredFileViewProps>((props) => {
  const { file, style, onRemoveClicked } = props;
  const controller = useUploadContext()?.controller;

  return (
    <FileContainerView style={style} onRemoveClicked={onRemoveClicked}>
      <FileContentView
        type={file.type}
        url={file.url}
        name={file.name}
        thumbnailUrl={controller?.getPreviewUrl?.(file) ?? file.thumbnailUrl}
        metadata={file.metadata}
      />
    </FileContainerView>
  );
});
