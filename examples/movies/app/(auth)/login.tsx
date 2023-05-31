import { ScrollView, View } from 'react-native';
import { Form, FormInput, FormValues, useForm } from '@artsiombarouski/rn-form';
import { useNavigationService } from '@artsiombarouski/rn-expo-router-service';
import { Button } from 'react-native-paper';
import { useUsers } from '../../services/utils';

const Login = () => {
  const form = useForm();
  const users = useUsers();
  const navigation = useNavigationService();
  const processLogin = async (values: FormValues) => {
    await new Promise<void>((resolve) => {
      setTimeout(async () => {
        await users.addUser({
          key: values.email,
          info: {
            email: values.email,
          },
        });
        navigation.push('/');
        resolve();
      }, 1000);
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        <Form form={form}>
          <View style={{ maxWidth: 400, width: '100%', alignItems: 'stretch' }}>
            <FormInput
              name={'email'}
              title={'Email'}
              placeholder={'Email'}
              rules={{ required: true }}
            />
            <FormInput
              name={'password'}
              title={'Password'}
              placeholder={'Password'}
              rules={{ required: true }}
            />
            <Button
              mode={'contained'}
              onPress={form.handleSubmit(processLogin)}
              loading={form.formState.isSubmitting}
            >
              Login
            </Button>
          </View>
        </Form>
      </ScrollView>
    </View>
  );
};

export default Login;
