import {
  isImageMimeType,
  isVideoMimeType,
  StoredFile,
  UploadController,
  UploadResult,
} from '@artsiombarouski/rn-upload';
import ImageKit from 'imagekit-javascript';
import { ImageKitOptions } from 'imagekit-javascript/src/interfaces';

export type ImageKitUploadControllerProps = {};

export type ImageKitUploadControllerBuilderProps = Omit<
  ImageKitOptions,
  'sdkVersion'
> & {
  privateKey?: string;
  waitForVideoThumbnail?: boolean;
};

export const createImageKitUploadController = (
  props: ImageKitUploadControllerBuilderProps,
): UploadController<ImageKitUploadControllerProps> => {
  const { waitForVideoThumbnail = true, ...restProps } = props;
  const imagekit = new ImageKit(restProps);
  const getPreviewUrl = (file: Partial<StoredFile>) => {
    if (isImageMimeType(file.type)) {
      let result = file.url;
      const lastSlash = result.lastIndexOf('/');
      if (lastSlash > -1) {
        result = `${result.substring(
          0,
          lastSlash,
        )}/tr:w-${300}/${result.substring(lastSlash + 1)}`;
      }
      return result;
    }
    return null;
  };
  return {
    upload(file, callback, options) {
      let xhrTracker;
      if (file.size) {
        xhrTracker = new XMLHttpRequest();
        xhrTracker.upload.addEventListener('progress', function (e) {
          callback.onProgress(e.loaded);
        });
      }
      imagekit.upload(
        {
          file: file,
          xhr: xhrTracker,
          fileName: file.name,
          useUniqueFileName: true,
        },
        async (err, response) => {
          if (err) {
            callback.onError({ message: err.message });
          } else {
            let result: UploadResult = {
              url: response.url,
              thumbnailUrl: response.thumbnailUrl,
              metadata: {
                width: response.width,
                height: response.height,
              },
            };
            if (isImageMimeType(file.type)) {
              result.thumbnailUrl = getPreviewUrl(result);
            } else if (!result.thumbnailUrl && isVideoMimeType(file.type)) {
              result.thumbnailUrl = `${response.url}/ik-thumbnail.jpg`;
              if (waitForVideoThumbnail) {
                let retryCount = 0;
                while (retryCount < 5) {
                  const fetchResult = await fetch(result.thumbnailUrl)
                    .then((res) => {
                      if (res.status === 200) {
                        return true;
                      }
                    })
                    .catch(() => null);
                  if (fetchResult) {
                    break;
                  }
                  await new Promise((resolve) => {
                    setTimeout(resolve, 1000);
                  });
                }
              }
            }
            if (
              !result.metadata.width &&
              props.privateKey &&
              isVideoMimeType(file.type)
            ) {
              const fetchResult = await fetch(
                `https://api.imagekit.io/v1/files/${response.fileId}/details`,
                {
                  headers: {
                    Authorization: `Basic ${props.privateKey}`,
                  },
                },
              )
                .then((res) => res.json())
                .catch((e) => {
                  //ignore
                });
              if (fetchResult) {
                result.metadata.width =
                  fetchResult.embeddedMetadata?.ImageWidth;
                result.metadata.height =
                  fetchResult.embeddedMetadata?.ImageHeight;
              }
            }
            callback.onComplete(result);
          }
        },
      );
    },
    getPreviewUrl: getPreviewUrl,
  };
};
