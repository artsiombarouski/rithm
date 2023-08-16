import { StoredFile, UploadFile } from './service';

export type FileMetadata = {
  width?: number;
  height?: number;
  duration?: number;
  [key: string]: any;
};

export type UploadResult = {
  url: string;
  key?: string;
  type?: string;
  thumbnailUrl?: string | null;
  metadata?: FileMetadata;
};

export type UploadError = {
  message: string;
};

export type UploadControllerCallback = {
  onComplete: (result: UploadResult) => void;
  onProgress: (loaded: number) => void;
  onError: (error: UploadError) => void;
};

export type UploadController<TOptions = any> = {
  upload: (
    file: File,
    callback: UploadControllerCallback,
    options?: TOptions,
  ) => void | Promise<void>;
  getPreviewUrl?: (file: StoredFile) => string | null | undefined;
};

export type UploadCallbacks = {
  onComplete?: (file: UploadFile, storedFile: StoredFile) => Promise<void>;
  onError?: (file: UploadFile) => Promise<void>;
};
