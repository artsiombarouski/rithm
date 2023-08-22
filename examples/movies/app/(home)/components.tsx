import {
  Avatar,
  CustomAlert,
  ModalDialog,
  useAlert,
} from '@artsiombarouski/rn-components';
import {
  Box,
  Button,
  Column,
  Divider,
  Heading,
  Row,
  ScrollView,
} from 'native-base';
import React from 'react';
import {
  AutocompleteInput,
  AutocompleteOption,
} from '@artsiombarouski/rn-components/src/input';
import { testNames } from '../../api/names';

const autocompleteOptions: AutocompleteOption[] = testNames.map((e) => ({
  key: e,
  value: e,
}));

const Components = () => {
  const alert = useAlert();
  return (
    <ScrollView flex={1}>
      <Column space={'xs'} p={6} maxW={500}>
        <Heading size={'sm'}>Common avatar</Heading>
        <Avatar
          image={
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww&w=1000&q=80'
          }
          size={96}
        />
        <Heading size={'sm'}>No Image</Heading>
        <Avatar text={'Artsiom Barouski'} size={96} />
        <Divider />
        <Heading>Autocomplete</Heading>
        <Box>
          <AutocompleteInput
            getOptions={async (query) => {
              await new Promise((resolve) => {
                setTimeout(resolve, 300);
              });
              return autocompleteOptions.filter((e) =>
                e.value.toLowerCase().includes(query.toLowerCase()),
              );
            }}
          />
        </Box>
        <Divider />
        <Heading>Autocomplete (with initial value)</Heading>
        <Box>
          <AutocompleteInput
            currentOption={autocompleteOptions[1]}
            getOptions={async (query) => {
              await new Promise((resolve) => {
                setTimeout(resolve, 300);
              });
              return autocompleteOptions.filter((e) =>
                e.value.toLowerCase().includes(query.toLowerCase()),
              );
            }}
          />
        </Box>
        <Divider />
        <Heading>Modal</Heading>
        <Heading size={'sm'}>Modal</Heading>
        <Button
          onPress={() => {
            ModalDialog.show({
              title: 'Show something in logs?',
              onOk: () => {
                console.log('something...');
                return true;
              },
            });
          }}
        >
          Show
        </Button>
        <Heading size={'sm'}>Modal with Promise</Heading>
        <Button
          onPress={() => {
            ModalDialog.showAsPromise({
              title: 'Delete Record?',
              okTitle: 'Yes, Delete',
              cancelTitle: 'Cancel',
              action: () => {
                return new Promise((resolve) =>
                  setTimeout(() => resolve(true), 1000),
                );
              },
            }).then((deleted) => {
              if (deleted) {
                console.log('Record deleted!');
              } else {
                console.log('Delete cancelled!');
              }
            });
          }}
        >
          Show As Promise
        </Button>
        <Divider />
        <Heading>Alert</Heading>
        <Heading size={'sm'}>Alert</Heading>
        <Button
          onPress={() => {
            ModalDialog.show({
              alert: true,
              title: 'Show something in logs?',
              onOk: () => {
                console.log('something...');
                return true;
              },
            });
          }}
        >
          Show
        </Button>
        <Heading size={'sm'}>Alert with Promise</Heading>
        <Button
          onPress={() => {
            ModalDialog.showAsPromise({
              alert: true,
              title: 'Delete Record?',
              okTitle: 'Yes, Delete',
              cancelTitle: 'Cancel',
              action: () => {
                return new Promise((resolve) =>
                  setTimeout(() => resolve(true), 1000),
                );
              },
            }).then((deleted) => {
              if (deleted) {
                console.log('Record deleted!');
              } else {
                console.log('Delete cancelled!');
              }
            });
          }}
        >
          Show As Promise
        </Button>
        <Divider />
        <Heading>Toasts</Heading>
        <Row space={4}>
          <Button
            onPress={() => {
              alert.showError({ title: 'Error' });
            }}
          >
            Show error
          </Button>
          <Button
            onPress={() => {
              alert.showInfo({ title: 'Info' });
            }}
          >
            Show info
          </Button>
          <Button
            onPress={() => {
              alert.showSuccess({ title: 'Success' });
            }}
          >
            Show success
          </Button>
        </Row>
        <Divider />
        <Heading>Custom Alert</Heading>
        <CustomAlert type={'info'} title={'Title'} message={'Message'} />
      </Column>
    </ScrollView>
  );
};

export default Components;
