import {
  Form,
  FormCheckbox,
  FormDropDown,
  FormDropDownOption,
  FormInput,
  FormList,
  FormListItemRenderProps,
  FormPasswordInput,
  FormRadioGroup,
  FormSwitch,
  FormValues,
  SelectionType,
  useForm,
} from '@artsiombarouski/rn-form';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { setTimeout } from '@testing-library/react-native/build/helpers/timers';
import {
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  Input,
  Pressable,
  ScrollView,
  Text,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

type FormItemDto = {
  item_input: string;
  item_checkbox: boolean;
};

const FormListItem = (props: FormListItemRenderProps<FormItemDto>) => {
  const { item, edit, remove } = props;
  return (
    <View
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Text
        fontSize={'md'}
        style={{
          flexShrink: 1,
          flexGrow: 1,
        }}
      >
        {item.item_input}
      </Text>
      <Text>{item.item_checkbox ? 'Checked' : 'Not checked'}</Text>
      <IconButton
        icon={<Icon as={MaterialCommunityIcons} name="pencil-circle" />}
        onPress={edit}
        size={8}
      />
      <IconButton
        icon={<Icon as={MaterialCommunityIcons} name="delete" />}
        onPress={remove}
        size={8}
      />
    </View>
  );
};

const LazyLoadSelectOptions = () => {
  const [options, setOptions] = useState<FormDropDownOption[]>([]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setOptions([
        { key: 'key1', label: 'Key 1' },
        { key: 'key2', label: 'Key 2' },
        { key: 'key3', label: 'Key 3' },
      ]);
    }, 3000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);
  return (
    <FormDropDown
      name={'dropdown-lazy'}
      options={options}
      useAnchorSize={true}
      isLoading={options.length === 0}
    />
  );
};

const DEFAULT_DATE = {
  [SelectionType.SINGLE]: { date: null },
  [SelectionType.MULTI]: { dates: [] },
  [SelectionType.RANGE]: { startDate: null, endDate: null },
};

const FormExample = () => {
  const [currentValue, setCurrentValue] = useState<FormValues>({});

  const [selectionType, setSelectionType] = useState<SelectionType>(
    SelectionType.RANGE,
  ); //todo

  const [mode, setMode] = useState<'single' | 'dual'>('single'); //todo

  //add button for calendar choose
  const form = useForm({
    defaultValues: {
      // calendar: DEFAULT_DATE[selectionType],
      invites: [{}],
      'full-inline-impl': [{}],
    },
  });

  const [data, setData] = useState({});

  const onSubmit = (data) => {
    setData(data);
  };

  return (
    <HStack flex={1}>
      <ScrollView p={4} flex={1}>
        <Form form={form}>
          {/*todo: controlProps, labelProps, helperProps, inputProps, errorProps*/}
          <FormInput
            name={'input'}
            title={'Input'}
            helperText={'Helper Text'}
            rightLabel={'Right label'}
            onRightLabelPress={() => {
              console.log('on right label click');
            }}
            rules={{ required: true }}
          />
          <FormInput
            name={'input-nokeep-error'}
            title={'Without error space'}
            rules={{ required: true }}
            keepErrorSpace={false}
          />
          <FormPasswordInput
            name={'input-password'}
            title={'Enter password'}
            rules={{ required: true }}
          />
          <FormCheckbox
            name={'checkbox'}
            title={'Checkbox'}
            label={'Checkbox example'}
            rules={{ required: true }}
          />
          <FormCheckbox
            name={'checkbox-reversed'}
            title={'Checkbox'}
            label={'Checkbox reversed'}
            checkedLabel={'Also label changed when checked'}
            reverse={true}
            rules={{ required: true }}
          />
          <FormSwitch
            name={'switch'}
            title={'Switch'}
            label={'Switch'}
            tooltipText={'Tooltip text'}
          />
          <FormSwitch
            name={'switch-large'}
            title={'Switch'}
            label={'Switch'}
            size={'lg'}
            fontSize={'lg'}
          />
          <FormRadioGroup
            name={'radio'}
            title={'Radio Group'}
            options={[
              { key: 'key1', label: 'Key 1' },
              { key: 'key2', label: 'Key 2' },
              { key: 'key3', label: 'Key 3' },
            ]}
            rules={{ required: true }}
          />
          <FormDropDown
            name={'select'}
            size={'lg'}
            options={new Array(100).fill(null).map((_, index) => {
              return { key: `key${index}`, label: `Key ${index}` };
            })}
            rules={{ required: true }}
            useAnchorSize={true}
          />
          <LazyLoadSelectOptions />
          <FormList<FormItemDto>
            name={'itemModal'}
            mode={'inline'}
            title={'List (modal)'}
            renderItem={FormListItem}
            listItemContainerProps={{
              space: 2,
              py: 2,
            }}
            placeholder={
              <Input
                editable={false}
                value={'Placeholder'}
                focusable={false}
                size={'md'}
                pointerEvents={'none'}
                _hover={{
                  isReadOnly: true,
                }}
                _focus={{
                  isReadOnly: true,
                }}
              />
            }
            actions={(props) => {
              return (
                <HStack>
                  <Button onPress={props.onPress} variant={'link'}>
                    + Add element
                  </Button>
                </HStack>
              );
            }}
            renderForm={(props) => {
              const form = useForm({
                values: props.initialValues ?? {},
              });
              return (
                <Form form={form}>
                  <HStack
                    style={{ width: '100%' }}
                    alignItems={'center'}
                    space={4}
                  >
                    <FormInput
                      name={'item_input'}
                      placeholder={'Input'}
                      title={'Input'}
                      itemContainerStyle={{
                        flex: 1,
                      }}
                    />
                    <FormCheckbox
                      name={'item_checkbox'}
                      title={'Checkbox'}
                      label={<Text>Checkbox</Text>}
                      itemContainerStyle={{
                        flex: 1,
                      }}
                    />
                    <Button onPress={props.dismiss}>Cancel</Button>
                    <Button onPress={form.handleSubmit(props.onSubmit)}>
                      {props.initialValues ? 'Update' : 'Create'}
                    </Button>
                  </HStack>
                </Form>
              );
            }}
          />
          <FormList
            name={'invites'}
            mode={'inline'}
            title={'Invites'}
            listItemContainerProps={{
              space: 3,
            }}
            rightLabel={'Reset list'}
            onRightLabelPress={() => {
              form.resetField('invites');
            }}
            rules={{
              validate: (value: { email: string }[]) => {
                const expression: RegExp =
                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                if (
                  value.some((value) => {
                    return value.email && !expression.test(value.email);
                  })
                ) {
                  return `Not all emails are valid`;
                }
                return true;
              },
            }}
            renderItem={(props) => {
              return (
                <Input
                  InputRightElement={
                    <Pressable onPress={props.remove}>
                      <Icon
                        as={MaterialCommunityIcons}
                        name={'delete-outline'}
                        size={5}
                        mr={2}
                        color="danger.500"
                      />
                    </Pressable>
                  }
                  size={'lg'}
                  variant={'outline'}
                  value={props.item.email}
                  onChangeText={(value) => {
                    props.update({ email: value });
                  }}
                  placeholder={'employee@email.com'}
                />
              );
            }}
            renderForm={() => <></>}
            actions={(props) => {
              return (
                <Button
                  variant={'link'}
                  onPress={() => {
                    props.addItem({});
                  }}
                  p={0}
                  justifyContent={'flex-start'}
                  leftIcon={<Icon as={MaterialCommunityIcons} name={'plus'} />}
                >
                  Invite more team members
                </Button>
              );
            }}
          />
          <FormList
            name={'full-inline-impl'}
            mode={'inline'}
            renderItem={(props) => {
              console.log('indexedPath', props.itemPath);
              return (
                <HStack>
                  <FormInput
                    name={`${props.itemPath}.title`}
                    title={'Title'}
                    rules={{ required: true }}
                    itemContainerStyle={{
                      flex: 1,
                    }}
                  />
                  <Button
                    variant={'link'}
                    onPress={() => {
                      props.remove();
                    }}
                  >
                    Remove
                  </Button>
                </HStack>
              );
            }}
            showError={false}
            keepErrorSpace={false}
            actions={(props) => {
              return (
                <HStack mb={4}>
                  <Button
                    onPress={() => {
                      props.addItem({});
                    }}
                  >
                    Add item
                  </Button>
                </HStack>
              );
            }}
          />
          <Button onPress={form.handleSubmit(onSubmit)}>Submit</Button>
        </Form>
      </ScrollView>
      <ScrollView flex={1}>
        <Box>
          <Text>{JSON.stringify(data, null, ' ')}</Text>
        </Box>
      </ScrollView>
    </HStack>
  );
};

export default FormExample;
