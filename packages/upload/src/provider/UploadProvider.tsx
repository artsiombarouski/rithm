import { createContext, PropsWithChildren, useContext } from 'react';
import { UploadController } from '../types';

export type IUploadContext = {
  controller: UploadController;
};

const UploadContext = createContext<IUploadContext>({} as any);

export type UploadProviderProps = PropsWithChildren & {
  controller: UploadController;
};

export const UploadProvider = (props: UploadProviderProps) => {
  const { children, controller } = props;
  return (
    <UploadContext.Provider value={{ controller }}>
      {children}
    </UploadContext.Provider>
  );
};

export function useUploadContext() {
  return useContext(UploadContext);
}
