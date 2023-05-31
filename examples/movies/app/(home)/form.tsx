import { ScrollView, View } from 'react-native';
import {
  Form,
  FormCheckbox,
  FormInput,
  FormList,
  FormListItemRenderProps,
  FormRadioGroup,
  FormSelect,
  FormSwitch,
  FormValues,
  useForm,
} from '@artsiombarouski/rn-form';
import { Button, Divider, IconButton, Text } from 'react-native-paper';
import { useState } from 'react';

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

const FormExample = () => {
  const [currentValue, setCurrentValue] = useState<FormValues>({});
  const form = useForm();
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
