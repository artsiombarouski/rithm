import { useLocalObservable } from 'mobx-react-lite';
import { UploadService } from './UploadService';
import { useUploadContext } from '../provider';
import { UploadCallbacks, UploadController } from '../types';
import { useEffect } from 'react';
import { StoredFile } from './StoredFile';
import { toJS } from 'mobx';

export type UseUploadServiceProps = {
  multiple?: boolean;
  controller?: UploadController;
  callbacks?: UploadCallbacks;
  storedFiles?: StoredFile | StoredFile[];
  onChange?: (file?: StoredFile | StoredFile[]) => void;
};

export function useUploadService(props: UseUploadServiceProps) {
  const {
    multiple = false,
    controller,
    callbacks,
    storedFiles,
    onChange,
  } = props;
  const context = useUploadContext();
  const handleUploadFinalized = (files: StoredFile[]) => {
    onChange?.(
      files.length === 0 ? null : multiple ? toJS(files) : toJS(files[0]),
    );
  };
  const service = useLocalObservable(
    () =>
      new UploadService(
        controller ?? context.controller,
        handleUploadFinalized,
        multiple,
        callbacks,
      ),
  );
  useEffect(() => {
    service.callbacks = callbacks;
  }, [callbacks]);
  useEffect(() => {
    if (multiple || service.isUploadFilesEmpty) {
      service.setStoredFiles(
        Array.isArray(storedFiles)
          ? storedFiles
          : storedFiles
          ? [storedFiles]
          : undefined,
      );
    }
  }, [storedFiles]);
  return service;
}
