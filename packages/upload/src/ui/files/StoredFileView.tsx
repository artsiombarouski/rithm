import { useUploadContext } from '../../provider';
import { StoredFile } from '../../service';
import { getFilenameFromUrl } from '../../utils';
import { UploadItemProps } from '../types';
import { FileContainerView } from './FileContainerView';
import { FileContentView } from './FileContentView';
import { ModalDialog } from '@artsiombarouski/rn-components';
import { VideoPlayer } from '@artsiombarouski/rn-video-player';
import { observer } from 'mobx-react-lite';

export type StoredFileViewProps = UploadItemProps & {
  file: StoredFile;
};

export const StoredFileView = observer<StoredFileViewProps>((props) => {
  const { file, style, onRemoveClicked, containerProps } = props;
  const controller = useUploadContext()?.controller;
  const thumbnailUrl = controller?.getPreviewUrl?.(file) ?? file.thumbnailUrl;
  const showPreview = () => {
    const isVideo = (file.type || file.mimeType)?.includes('video');
    ModalDialog.show({
      title: file.name ?? getFilenameFromUrl(file.url) ?? '',
      content: () =>
        isVideo ? (
          <VideoPlayer source={file.url} posterImage={thumbnailUrl} />
        ) : (
          <FileContentView
            type={file.type}
            url={file.url}
            name={file.name}
            thumbnailUrl={thumbnailUrl}
            metadata={file.metadata}
          />
        ),
      contentStyle: {
        maxWidth: 520,
      },
      bodyStyle: {
        aspectRatio: isVideo ? 'auto' : 1,
      },
      showClose: true,
      showActions: false,
    });
  };
  return (
    <FileContainerView
      style={style}
      onRemoveClicked={onRemoveClicked}
      showPreview={showPreview}
      {...containerProps}
    >
      <FileContentView
        type={file.type}
        url={file.url}
        name={file.name}
        thumbnailUrl={thumbnailUrl}
        metadata={file.metadata}
      />
    </FileContainerView>
  );
});
