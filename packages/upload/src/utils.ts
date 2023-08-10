import { UploadFile } from './service';

export function createXhrTracker(uploadFile: UploadFile) {
  let xhrTracker: XMLHttpRequest | undefined;
  if (uploadFile.size) {
    xhrTracker = new XMLHttpRequest();
    xhrTracker.upload.addEventListener('progress', function (e) {
      uploadFile.setProgress(e.loaded);
    });
  }
  return xhrTracker;
}
