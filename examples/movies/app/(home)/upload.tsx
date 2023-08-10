import {
  isImageMimeType,
  UploadController,
  UploadControllerCallback,
  UploadPickerView,
  UploadProvider,
  UploadResult,
  UploadView,
} from '@artsiombarouski/rn-upload';
import {
  ComputableProgressInfo,
  StoreValue,
  uploadFile as uploadFileToUploadCare,
} from '@uploadcare/upload-client';
import { Box, Divider, Heading, ScrollView, Text, VStack } from 'native-base';
import { useState } from 'react';
import { StoredFile } from '@artsiombarouski/rn-upload/src/service';

export type UploadCareProps = {
  store?: StoreValue;
};

const UploadCareController: UploadController<UploadCareProps> = {
  upload(
    file: File,
    callback: UploadControllerCallback,
    options?: UploadCareProps,
  ) {
    uploadFileToUploadCare(file, {
      publicKey: '5fa652e7ed4b1113a8bc',
      store: options?.store ?? 'auto',
      onProgress: (progress) => {
        if (progress.isComputable) {
          callback.onProgress(
            file.size * (progress as ComputableProgressInfo).value,
          );
        }
      },
    })
      .then((result) => {
        const uploadResult: UploadResult = {
          url: result.cdnUrl!,
          thumbnailUrl: result.isImage ? result.cdnUrl : undefined,
          type: file.type,
          metadata: result.videoInfo
            ? {
                width: result.videoInfo?.video?.width,
                height: result.videoInfo?.video?.height,
                duration: result.videoInfo?.duration,
              }
            : result.imageInfo
            ? {
                width: result?.imageInfo?.width,
                height: result?.imageInfo?.height,
              }
            : undefined,
        };
        callback.onComplete(uploadResult);
      })
      .catch((e) => {
        console.log('e', e);
        callback.onError({ message: 'Unknown' });
      });
  },
  getPreviewUrl: (file: StoredFile) => {
    if (isImageMimeType(file.type)) {
      return `${file.url}/-/preview/300x300`;
    }
    return null;
  },
};

const UploadPage = () => {
  const [pickedFiles, setPickedFiles] = useState<File[] | undefined>();
  const controller = UploadCareController;
  const handleFilePicked = (files: File[]) => {
    setPickedFiles(files);
  };
  return (
    <Box flex={1}>
      <ScrollView>
        <VStack>
          <UploadPickerView onPicked={handleFilePicked} />
          <Text>{pickedFiles?.map((e) => e.name)?.join(', ') ?? '-'}</Text>
        </VStack>
        <Divider />
        <VStack px={4} py={2} space={'sm'}>
          <Heading size={'md'}>Single (default)</Heading>
          <UploadProvider controller={controller}>
            <UploadView />
          </UploadProvider>
        </VStack>
        <VStack px={4} py={2} space={'sm'}>
          <Heading size={'md'}>Single (custom style)</Heading>
          <UploadProvider controller={controller}>
            <UploadView
              item={
                {
                  style: { borderRadius: '50%' },
                } as any
              }
              picker={
                {
                  style: { borderRadius: '50%' },
                } as any
              }
            />
          </UploadProvider>
        </VStack>
        <VStack px={4} py={2} space={'sm'}>
          <Heading size={'md'}>Single (inline)</Heading>
          <UploadProvider controller={controller}>
            <UploadView inline={true} />
          </UploadProvider>
        </VStack>
        <VStack px={4} py={2} space={'sm'}>
          <Heading size={'md'}>Single (with initial value)</Heading>
          <UploadProvider controller={controller}>
            <UploadView
              inline={true}
              storedFiles={{
                key: 'f1',
                url: 'https://ucarecdn.com/ca081c85-2614-43d5-a7cf-a5d18b273b4c/',
                type: 'image/png',
                thumbnailUrl:
                  'https://ucarecdn.com/ca081c85-2614-43d5-a7cf-a5d18b273b4c/',
              }}
              callbacks={{
                onComplete: async (file) => {
                  console.log('onComplete', file);
                },
              }}
              onChange={(files) => {
                console.log('onChange', files);
              }}
            />
          </UploadProvider>
        </VStack>
        <VStack px={4} py={2} space={'sm'}>
          <Heading size={'md'}>Multiple (grid)</Heading>
          <UploadProvider controller={controller}>
            <UploadView
              multiple={true}
              onChange={(files) => {
                console.log('onChange', files);
              }}
            />
          </UploadProvider>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default UploadPage;
