import {
  FormElementRenderProps,
  FormItem,
  FormItemProps,
  FormValues,
} from '@artsiombarouski/rn-form';
import {
  StoredFile,
  UploadView,
  UploadViewProps,
  UploadViewRef,
} from '@artsiombarouski/rn-upload';
import { useRef } from 'react';

export type FormUploadProps<T extends FormValues = FormValues> =
  FormItemProps<T> &
    UploadViewProps & {
      urlOnly?: boolean;
      urlOnlyMimeType?: string;
      toStoredFile?: (value: T) => StoredFile;
      fromStoredFile?: (file: StoredFile) => T;
      emptyArrayWhenEmpty?: boolean;
      waitAllUploadsComplete?: boolean;
    };

export const FormUpload = (props: FormUploadProps) => {
  const {
    urlOnly,
    urlOnlyMimeType,
    toStoredFile: externalToStoredFile,
    fromStoredFile: externalFromStoredFile,
    emptyArrayWhenEmpty = false,
    waitAllUploadsComplete = true,
    ...restProps
  } = props;
  const ref = useRef<UploadViewRef>(null);

  const toStoredFile =
    externalToStoredFile ??
    (urlOnly
      ? (item) => ({
          key: item,
          url: item,
          type: urlOnlyMimeType,
        })
      : (item) => item as any);

  const fromStoredFile =
    externalFromStoredFile ??
    (urlOnly ? (file) => file.url as any : (file) => file);

  const renderUpload = (
    props: UploadViewProps,
    renderProps: FormElementRenderProps,
  ) => {
    const fieldValue = renderProps.field.value;
    const storedFiles = Array.isArray(fieldValue)
      ? fieldValue.map(toStoredFile)
      : fieldValue
      ? toStoredFile(fieldValue)
      : undefined;
    return (
      <UploadView
        {...props}
        storedFiles={storedFiles}
        onChange={(files) => {
          if (Array.isArray(files)) {
            renderProps.field.onChange(files.map(fromStoredFile));
          } else if (files) {
            renderProps.field.onChange(fromStoredFile(files));
          } else {
            renderProps.field.onChange(emptyArrayWhenEmpty ? [] : null);
          }
        }}
      />
    );
  };

  return (
    <FormItem
      {...restProps}
      render={renderUpload}
      rules={{
        validate: () => {
          if (waitAllUploadsComplete && ref.current?.haveUploadsInProgress) {
            return 'Upload not completed';
          }
          return true;
        },
        ...restProps.rules,
      }}
    />
  );
};
