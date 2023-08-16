import {
  action,
  computed,
  IObservableArray,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';
import { v4 as uuidv4 } from 'uuid';
import {
  UploadCallbacks,
  UploadController,
  UploadControllerCallback,
} from '../types';
import { UploadFile } from './UploadFile';
import { getFileExtension } from '../mime-utils';
import { StoredFile } from './StoredFile';

export class UploadService {
  @observable
  storedFiles: StoredFile[] = [];

  @observable
  uploadFiles: UploadFile[] = [];

  constructor(
    readonly controller: UploadController,
    readonly onUploadFinalized: (files: StoredFile[]) => void,
    readonly multiple?: boolean,
    public callbacks?: UploadCallbacks,
  ) {
    makeObservable(this);
  }

  @action
  setStoredFiles(files?: StoredFile[]) {
    (this.storedFiles as IObservableArray<StoredFile>).replace(files ?? []);
  }

  @action
  upload(file: File, options?: any) {
    const key = uuidv4();
    const fileName = `${key}.${getFileExtension(file.name)}`;
    const uploadFile = new UploadFile(key, file, fileName, file.type);
    const callback = this.createCallback(uploadFile);
    runInAction(() => {
      if (!this.multiple) {
        (this.storedFiles as IObservableArray).clear();
        (this.uploadFiles as IObservableArray).clear();
      }
      this.uploadFiles.push(uploadFile);
    });
    this.controller.upload(file, callback, options);
    return uploadFile;
  }

  @action
  retry(file: UploadFile, options?: any) {
    const callback = this.createCallback(file);
    this.controller.upload(file.localFile, callback, options);
  }

  @action
  remove(file: UploadFile | StoredFile) {
    runInAction(() => {
      const storedFile = this.storedFiles.find((e) => e.key === file.key);
      if (storedFile) {
        (this.storedFiles as IObservableArray).remove(storedFile);
        this.notifyChanged();
        return;
      }
      const uploadFile = this.uploadFiles.find((e) => e.key === file.key);
      if (uploadFile) {
        (this.uploadFiles as IObservableArray).remove(uploadFile);
        this.notifyChanged();
        return;
      }
    });
  }

  @computed
  get isStoredFilesEmpty() {
    return this.storedFiles.length === 0;
  }

  @computed
  get isUploadFilesEmpty() {
    return this.uploadFiles.length === 0;
  }

  private createCallback = (
    uploadFile: UploadFile,
  ): UploadControllerCallback => {
    return {
      onComplete: async (result) => {
        uploadFile.setInfo(result);
        const storedFile: StoredFile = {
          key: uploadFile.key,
          type: uploadFile.mimeType,
          ...result,
          metadata: {
            displayName: uploadFile.fileName,
            ...result.metadata,
          },
        };
        await this.callbacks?.onComplete(uploadFile, storedFile);
        uploadFile.setCompleted();
        runInAction(() => {
          (this.uploadFiles as IObservableArray).remove(uploadFile);
          (this.storedFiles as IObservableArray).push(storedFile);
          this.notifyChanged();
        });
      },
      onProgress: (loaded: number) => {
        uploadFile.setProgress(loaded);
      },
      onError: (error) => {
        uploadFile.setError(error);
        uploadFile.setFailed();
      },
    };
  };

  private notifyChanged = () => {
    this.onUploadFinalized(this.storedFiles);
  };
}
