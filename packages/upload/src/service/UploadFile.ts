import { action, computed, makeObservable, observable } from 'mobx';
import { FileMetadata, UploadError } from '../types';

export class UploadFile {
  @observable
  progress: number = 0;

  @observable
  isUploading: boolean = false;

  @observable
  isCompleted: boolean = false;

  @observable
  isFailed: boolean = false;

  @observable
  url?: string;

  @observable
  thumbnailUrl?: string;

  @observable
  metadata?: FileMetadata;

  @observable
  error?: UploadError;

  constructor(
    readonly key: string,
    readonly localFile: File,
    readonly fileName: string,
    readonly mimeType: string,
  ) {
    makeObservable(this);
  }

  @action
  setUploading() {
    this.isUploading = true;
    this.isFailed = false;
  }

  @action
  setProgress(progress: number) {
    this.progress = progress;
  }

  @action
  setInfo({
    url,
    thumbnailUrl,
    metadata,
  }: {
    url?: string;
    thumbnailUrl?: string;
    metadata?: FileMetadata;
  }) {
    this.url = url;
    this.thumbnailUrl = thumbnailUrl;
    this.metadata = metadata;
  }

  @action
  setCompleted() {
    this.isUploading = false;
    this.isCompleted = true;
  }

  @action
  setError(error?: UploadError) {
    this.error = error;
  }

  @action
  setFailed() {
    this.isUploading = false;
    this.isFailed = true;
  }

  @computed
  get progressPercent() {
    if (!this.localFile.size) {
      return 0;
    }
    return Math.min(
      100,
      Math.round((this.progress / this.localFile.size) * 100),
    );
  }

  get size() {
    return this.localFile.size;
  }
}
