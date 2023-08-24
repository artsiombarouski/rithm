import { PageBuilderElementEditProps } from '../../types';
import { FormUpload, FormUploadProps } from '@artsiombarouski/rn-form-upload';
import { Box, IBoxProps } from 'native-base';
import { UploadPickerLargePlaceholder } from '@artsiombarouski/rn-upload';

export type ImageElementEditProps = PageBuilderElementEditProps &
  Partial<FormUploadProps> & {
    wrapperProps?: IBoxProps;
  };

export const ImageElementEdit = (props: ImageElementEditProps) => {
  const { wrapperProps, ...restProps } = props;
  return (
    <Box flex={1} p={3} {...wrapperProps}>
      <FormUpload
        supportedTypes={['image/*']}
        keepErrorSpace={false}
        item={{
          style: {
            padding: 0,
          },
        }}
        picker={{
          style: {
            flex: 1,
            width: '100%',
            height: '100%',
            aspectRatio: 566 / 286,
          },
          placeholder: (props) => <UploadPickerLargePlaceholder {...props} />,
        }}
        inline={true}
        {...restProps}
      />
    </Box>
  );
};
