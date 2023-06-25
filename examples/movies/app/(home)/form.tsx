import {
  Form,
  FormCalendar,
  FormCheckbox,
  FormDropDown,
  FormDropDownOption,
  FormInput,
  FormList,
  FormListItemRenderProps,
  FormPasswordInput,
  FormRadioGroup,
  FormSwitch,
  FormTimePicker,
  FormValues,
  SelectionType,
  useForm,
} from '@artsiombarouski/rn-form';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { setTimeout } from '@testing-library/react-native/build/helpers/timers';
import {
  Button,
  HStack,
  Icon,
  IconButton,
  Input,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { UseFormProps } from 'react-hook-form';
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
      name={'dropdownLazy'}
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

const FormExampleRow = (
  props: PropsWithChildren & { title: string; formProps?: UseFormProps },
) => {
  const { children, title, formProps } = props;
  const form = useForm(formProps);
  const [data, setData] = useState({});
  const onSubmit = (data) => {
    setData(data);
  };
  return (
    <Form form={form}>
      <VStack>
        <Text fontSize={'lg'} mb={2}>
          {title}
        </Text>
        <HStack space={3}>
          <VStack flex={1}>
            {children}
            <Button mt={3} onPress={form.handleSubmit(onSubmit)}>
              Submit
            </Button>
          </VStack>
          <Text flex={1}>{JSON.stringify(data, null, ' ')}</Text>
        </HStack>
      </VStack>
    </Form>
  );
};

const FormExample = () => {
  const [currentValue, setCurrentValue] = useState<FormValues>({});

  const [selectionType, setSelectionType] = useState<SelectionType>(
    SelectionType.RANGE,
  ); //todo

  const [mode, setMode] = useState<'single' | 'dual'>('single'); //todo

  const [isEditing, setIsEditing] = useState(false);
  return (
    <HStack flex={1}>
      <ScrollView p={4} flex={1}>
        <VStack flex={1} space={6}>
          <FormExampleRow title={'Input with two states'}>
            <FormInput
              name={'input-raw'}
              title={'Input'}
              rightLabel={'Right label'}
              onRightLabelPress={() => {
                console.log('on right label click');
              }}
              rules={{ required: true }}
              isRawText={!isEditing}
              rawTextProps={{
                color: 'purple.600',
              }}
              titleProps={{
                _text: {
                  color: isEditing ? 'black' : 'gray.400',
                },
              }}
            />
            <FormDropDown
              name={'dropdown-raw'}
              title={'DropDown'}
              size={'lg'}
              options={new Array(100).fill(null).map((_, index) => {
                return { key: `key${index}`, label: `Key ${index}` };
              })}
              rules={{ required: true }}
              useAnchorSize={true}
              isRawText={!isEditing}
              rawTextProps={{
                color: 'purple.600',
              }}
              titleProps={{
                _text: {
                  color: isEditing ? 'black' : 'gray.400',
                },
              }}
            />
            <Button onPress={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </FormExampleRow>
          <FormExampleRow
            title={'Time'}
            formProps={{
              defaultValues: {
                time: '18:1',
              },
            }}
          >
            <FormTimePicker
              name={'time'}
              title={'Time'}
              rules={{ required: true }}
            />
          </FormExampleRow>
          <FormExampleRow title={'Input'}>
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
          </FormExampleRow>
          <FormExampleRow title={'Input (no error space keep)'}>
            <FormInput
              name={'input-nokeep-error'}
              title={'Without error space'}
              rules={{ required: true }}
              keepErrorSpace={false}
            />
          </FormExampleRow>
          <FormExampleRow title={'Input (password)'}>
            <FormPasswordInput
              name={'input-password'}
              title={'Enter password'}
              rules={{ required: true }}
            />
          </FormExampleRow>
          <FormExampleRow title={'Checkbox'}>
            <FormCheckbox
              name={'checkbox'}
              title={'Checkbox'}
              label={'Checkbox example'}
              rules={{ required: true }}
            />
          </FormExampleRow>
          <FormExampleRow title={'Checkbox (reversed)'}>
            <FormCheckbox
              name={'checkbox-reversed'}
              title={'Checkbox'}
              label={'Checkbox reversed'}
              checkedLabel={'Also label changed when checked'}
              reverse={true}
              rules={{ required: true }}
            />
          </FormExampleRow>
          <FormExampleRow title={'Switch'}>
            <FormSwitch
              name={'switch'}
              title={'Switch'}
              label={'Switch'}
              tooltipText={'Tooltip text'}
            />
          </FormExampleRow>
          <FormExampleRow title={'Switch (large)'}>
            <FormSwitch
              name={'switch-large'}
              title={'Switch'}
              label={'Switch'}
              size={'lg'}
              fontSize={'lg'}
            />
          </FormExampleRow>
          <FormExampleRow title={'Radio Group'}>
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
          </FormExampleRow>
          <FormExampleRow title={'DropDown'}>
            <FormDropDown
              name={'dropdown'}
              size={'lg'}
              options={new Array(100).fill(null).map((_, index) => {
                return { key: `key${index}`, label: `Key ${index}` };
              })}
              rules={{ required: true }}
              useAnchorSize={true}
            />
          </FormExampleRow>
          <FormExampleRow title={'DropDown (lazy options)'}>
            <LazyLoadSelectOptions />
          </FormExampleRow>
          <FormExampleRow title={'List (inline)'}>
            <FormList<FormItemDto>
              name={'listInline'}
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
          </FormExampleRow>
          <FormExampleRow
            title={'List (invites example)'}
            formProps={{
              defaultValues: {
                invites: [{}],
              },
            }}
          >
            <FormList
              name={'invites'}
              mode={'inline'}
              title={'Invites'}
              listItemContainerProps={{
                space: 3,
              }}
              rightLabel={'Reset list'}
              onRightLabelPress={() => {
                // form.resetField('invites');
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
                    leftIcon={
                      <Icon as={MaterialCommunityIcons} name={'plus'} />
                    }
                  >
                    Invite more team members
                  </Button>
                );
              }}
            />
          </FormExampleRow>
          <FormExampleRow
            title={'List (inline form)'}
            formProps={{
              defaultValues: {
                'full-inline-impl': [{}],
              },
            }}
          >
            <FormList
              name={'full-inline-impl'}
              mode={'inline'}
              renderItem={(props) => {
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
          </FormExampleRow>
          <FormExampleRow title={'Calendar (range)'}>
            <FormCalendar
              name={'calendar-range'}
              selectionType={SelectionType.RANGE}
            />
          </FormExampleRow>
        </VStack>
      </ScrollView>
    </HStack>
  );
};

export default FormExample;
