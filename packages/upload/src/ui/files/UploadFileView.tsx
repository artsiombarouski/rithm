import { observer } from 'mobx-react-lite';
import { Pressable, Progress, Text, VStack, WarningIcon } from 'native-base';
import { UploadFile } from '../../service';
import { FileContentView } from './FileContentView';
import { UploadItemProps } from '../types';
import { FileContainerView } from './FileContainerView';

export type UploadFileViewProps = UploadItemProps & {
  file: UploadFile;
};

export const UploadFileView = observer<UploadFileViewProps>((props) => {
  const { file, style, onRemoveClicked } = props;
  let content;
  if (file.isCompleted) {
    content = (
      <FileContentView
        type={file.mimeType}
        url={file.url}
        name={file.fileName}
        thumbnailUrl={file.thumbnailUrl}
        metadata={file.metadata}
      />
    );
  } else if (file.error) {
    content = (
      <Pressable flex={1}>
        <VStack
          flex={1}
          space={'2xs'}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <WarningIcon color={'error.500'} />
          <Text color={'error.500'} numberOfLines={1}>
            {file.error.message ?? 'Failed'}
          </Text>
        </VStack>
      </Pressable>
    );
  } else {
    content = (
      <VStack
        flex={1}
        space={'xs'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Text>Uploading...</Text>
        <Progress
          w={'80%'}
          size={'xs'}
          value={file?.progressPercent ?? 0}
          _filledTrack={{
            bg:
              file?.progressPercent && file?.progressPercent === 100
                ? 'lime.500'
                : 'primary.500',
          }}
        />
      </VStack>
    );
  }

  return (
    <FileContainerView
      style={style}
      error={!!file.error}
      onRemoveClicked={onRemoveClicked}
      canShowOverlay={file.isCompleted}
    >
      {content}
    </FileContainerView>
  );
});
