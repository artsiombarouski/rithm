import { Form, useForm } from '@artsiombarouski/rn-form';
import { Box, Button, HStack, ScrollView, VStack } from 'native-base';
import {
  FormPageBuilder,
  ImageElement,
  PageBuilderElementPayload,
  TextElement,
  VideoElement,
} from '@artsiombarouski/rn-page-builder';
import { UploadProvider } from '@artsiombarouski/rn-upload';
import { createImageKitUploadController } from '@artsiombarouski/rn-upload-imagekit-controller';
import { useState } from 'react';
import { isEmpty } from 'lodash';

const imageKitController = createImageKitUploadController({
  publicKey: 'public_k+u0xXV8i5yBn2vSzUiM71Z4Z4Y=',
  urlEndpoint: 'https://ik.imagekit.io/pwff5qm0a',
  authenticationEndpoint: `http://localhost:3000/files/imagekit/auth`,
  privateKey: 'cHJpdmF0ZV9ySXREd0MyK2p4ZWp4amZLb1RucDVvZFUwVlU9Og==',
});

export default function PageBuilderPage() {
  const form = useForm();
  const [data, setData] = useState<{ data: PageBuilderElementPayload[] }>({
    data: [],
  });

  const handleSubmit = (values: any) => {
    console.log('values', values);
    setData({
      ...values,
      data: values.data.filter((e) => !isEmpty(e.value)),
    });
  };

  return (
    <Box flex={1}>
      <HStack>
        <UploadProvider controller={imageKitController}>
          <Form form={form}>
            <ScrollView flex={1}>
              <VStack>
                <FormPageBuilder name={'data'} />
                <Button onPress={form.handleSubmit(handleSubmit)}>
                  Submit
                </Button>
              </VStack>
            </ScrollView>
          </Form>
        </UploadProvider>
        <ScrollView flex={1}>
          <VStack>
            {data.data.map((e) => {
              console.log('render', e.type);
              if (e.type === TextElement.type) {
                return <TextElement.View payload={e} />;
              }
              if (e.type === ImageElement.type) {
                return (
                  <Box style={{ flex: 1, aspectRatio: 1 }}>
                    <ImageElement.View payload={e} />
                  </Box>
                );
              }
              if (e.type === VideoElement.type) {
                return (
                  <Box style={{ flex: 1, aspectRatio: 1 }}>
                    <VideoElement.View payload={e} />
                  </Box>
                );
              }
              return <></>;
            })}
          </VStack>
        </ScrollView>
      </HStack>
    </Box>
  );
}
