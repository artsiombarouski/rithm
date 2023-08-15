import { PageBuilderElementEditProps } from '../../types';
import { FormUpload } from '@artsiombarouski/rn-form-upload';
import { Box } from 'native-base';
import { UploadPickerLargePlaceholder } from '@artsiombarouski/rn-upload';

export const VideoElementEdit = (props: PageBuilderElementEditProps) => {
  return (
    <Box flex={1} p={3}>
      <FormUpload
        supportedTypes={['video/*']}
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
        {...props}
      />
    </Box>
  );
};
