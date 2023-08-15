import {
  ComputableProgressInfo,
  StoreValue,
  uploadFile as uploadFileToUploadCare,
} from '@uploadcare/upload-client';
import {
  isImageMimeType,
  StoredFile,
  UploadController,
  UploadControllerCallback,
  UploadResult,
} from '@artsiombarouski/rn-upload';

export type UploadCareProps = {
  store?: StoreValue;
};

export const UploadCareController: UploadController<UploadCareProps> = {
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
