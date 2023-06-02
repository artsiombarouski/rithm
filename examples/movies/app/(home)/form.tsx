import {
  Form,
  FormCalendar,
  FormCheckbox,
  FormInput,
  FormList,
  FormListItemRenderProps,
  FormRadioGroup,
  FormSelect,
  FormSwitch,
  FormValues,
  SelectionType,
  useForm,
} from '@artsiombarouski/rn-form';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { Divider, Text, Button, IconButton, Icon } from 'native-base';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

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
        size={20}
      />
      <IconButton
        icon={<Icon as={MaterialCommunityIcons} name="delete" />}
        onPress={remove}
        size={20}
      />
    </View>
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
      calendar: DEFAULT_DATE[selectionType],
    },
  });

  const onSubmit = (data) => {
    console.log('data', data);
  };

  return (
    <View style={{ padding: 16 }}>
      <Form form={form}>
        {/*todo: controlProps, labelProps, helperProps, inputProps, errorProps*/}
        <FormInput
          helperText={'Helper Text'}
          name={'input'}
          title={'Input'}
          rules={{ required: true }}
        />
        <FormCheckbox
          name={'checkbox'}
          title={'Checkbox'}
          helperText={'Helper Text'}
          rules={{ required: true }}
        >
          <Text ml={4}>Right Text</Text>
        </FormCheckbox>
        <Button onPress={form.handleSubmit(onSubmit)}>Submit</Button>
      </Form>
    </View>
  );

  return (
    <View style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
      <ScrollView style={{ flex: 0.5, padding: 16 }}>
        <Form form={form}>
          <FormInput
            name={'input'}
            title={'Input'}
            rules={{ required: true }}
          />
          <Divider />
          <FormCheckbox name={'checkbox'} title={'Checkbox'}>
            <Text>Checkbox example</Text>
          </FormCheckbox>
          <Divider />
          <FormSwitch name={'switch'} title={'Switch'} label={'Switch'} />
          <Divider />
          <FormRadioGroup
            name={'radio'}
            title={'Radio Group'}
            options={[
              { key: 'key1', label: 'Key 1' },
              { key: 'key2', label: 'Key 2' },
              { key: 'key3', label: 'Key 3' },
            ]}
          />
          <Divider />
          <FormSelect
            name={'select'}
            options={[
              { key: 'key1', label: 'Key 1' },
              { key: 'key2', label: 'Key 2' },
              { key: 'key3', label: 'Key 3' },
            ]}
          />
          <Divider />
          <FormList<FormItemDto>
            name={'itemModal'}
            title={'List (modal)'}
            renderItem={FormListItem}
            renderForm={(props) => {
              const form = useForm({
                values: props.initialValues ?? {},
              });
              return (
                <Form form={form}>
                  <FormInput name={'item_input'} />
                  <FormCheckbox name={'item_checkbox'}>
                    <Text>Checkbox</Text>
                  </FormCheckbox>
                  <Button onPress={form.handleSubmit(props.onSubmit)}>
                    {props.initialValues ? 'Update' : 'Create'}
                  </Button>
                </Form>
              );
            }}
          />
          <Divider />
          <FormList
            name={'itemInline'}
            title={'List (inline)'}
            mode={'inline'}
            renderItem={FormListItem}
            renderForm={(props) => {
              const form = useForm({
                values: props.initialValues ?? {},
              });
              return (
                <Form form={form}>
                  <View
                    style={{
                      width: '100%',
                      backgroundColor: 'yellow',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <FormInput
                      name={'item_input'}
                      rules={{ required: true }}
                      itemContainerStyle={{
                        flex: 1,
                        marginRight: 8,
                      }}
                    />
                    <FormCheckbox
                      name={'item_checkbox'}
                      itemContainerStyle={{
                        flex: 0.5,
                      }}
                    >
                      <Text>Item Checkbox</Text>
                    </FormCheckbox>
                    <Button
                      variant={'ghost'}
                      onPress={form.handleSubmit(props.onSubmit)}
                    >
                      {props.initialValues ? 'Update' : 'Create'}
                    </Button>
                    <Button variant={'ghost'} onPress={props.dismiss}>
                      Cancel
                    </Button>
                  </View>
                </Form>
              );
            }}
          />
          <Divider />
          <FormCalendar
            name={'calendar'}
            mode={'dual'}
            selectionType={selectionType}
            minDate={dayjs().subtract(5, 'days').toString()}
            maxDate={dayjs().add(5, 'd').toString()}
          />
          <Button onPress={form.handleSubmit(setCurrentValue)}>Submit</Button>
        </Form>
      </ScrollView>
      <ScrollView style={{ flex: 0.5 }}>
        <View>
          <Text>{JSON.stringify(currentValue, null, '')}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default FormExample;
