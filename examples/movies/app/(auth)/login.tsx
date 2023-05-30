import { ActivityIndicator, Button, ScrollView, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import IonicIcon from '@expo/vector-icons/Ionicons';
import {
  Form,
  FormCheckbox,
  FormInput,
  FormSelect,
  FormSwitch,
  useForm,
} from '@artsiombarouski/rn-form';

const Login = () => {
  const form = useForm();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        <Form form={form}>
          <FormInput
            name={'email'}
            title={'Email'}
            rules={{ required: true }}
          />
          <FormInput
            name={'password'}
            placeholder={'Password'}
            rules={{ required: true }}
          />
          <FormSwitch name={'isSwitched'} title={'Is Switched'} />
          <FormCheckbox name={'isChecked'} label={'Is Checked'} />
          <FormSelect
            name={'selected'}
            options={[
              { key: 'k1', label: 'Key 1' },
              { key: 'k2', label: 'Key 2' },
              { key: 'k3', label: 'Key 3' },
            ]}
          />
          <Button
            title={'Login'}
            onPress={form.handleSubmit(
              async (values) => {
                console.log('values', values);
                await new Promise((resolve) => {
                  setTimeout(resolve, 5000);
                });
              },
              (errors) => {
                console.log('onError', errors);
              },
            )}
          />
          {form.formState.isSubmitting && <ActivityIndicator />}
        </Form>

        <View style={{ maxWidth: 400, width: '100%' }}>
          <TextInput
            // left={<IonicIcon name={'md-checkmark-circle'} />}
            left={
              <TextInput.Icon icon={'eye'} focusable={false} disabled={true} />
            }
            underlineStyle={{ height: 0 }}
            placeholder={'Email'}
          />
          <TextInput
            left={<IonicIcon name={'md-checkmark-circle'} size={24} />}
            right={<TextInput.Icon icon={'eye'} />}
            placeholder={'password'}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Login;
