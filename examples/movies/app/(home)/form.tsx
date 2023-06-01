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
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Divider, IconButton, Text } from 'react-native-paper';
import dayjs from 'dayjs';

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
        variant={'titleMedium'}
        style={{
          flexShrink: 1,
          flexGrow: 1,
        }}
      >
        {item.item_input}
      </Text>
      <Text>{item.item_checkbox ? 'Checked' : 'Not checked'}</Text>
      <IconButton icon={'pencil-circle'} onPress={edit} size={20} />
      <IconButton icon={'delete'} onPress={remove} size={20} />
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

  return (
    <View style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
      <ScrollView style={{ flex: 0.5 }}>
        <Form form={form}>
          <FormInput name={'input'} title={'Input'} />
          <Divider />
          <FormCheckbox
            name={'checkbox'}
            title={'Checkbox'}
            label={'Checkbox example'}
          />
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
                  <FormCheckbox name={'item_checkbox'} label={'Checkbox'} />
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
                      dense={true}
                      itemContainerStyle={{
                        flex: 1,
                        marginRight: 8,
                      }}
                    />
                    <FormCheckbox
                      name={'item_checkbox'}
                      label={'Checkbox'}
                      itemContainerStyle={{
                        flex: 0.5,
                      }}
                    />
                    <Button onPress={form.handleSubmit(props.onSubmit)}>
                      {props.initialValues ? 'Update' : 'Create'}
                    </Button>
                    <Button onPress={props.dismiss}>Cancel</Button>
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
          <Button
            mode={'contained'}
            onPress={form.handleSubmit(setCurrentValue)}
          >
            Submit
          </Button>
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
