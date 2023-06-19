import { useUsers } from '../../services/utils';
import { Form, FormInput, useForm } from '@artsiombarouski/rn-form';
import { observer } from 'mobx-react-lite';
import { Button } from 'native-base';

const UserSettings = observer(() => {
  const users = useUsers();
  const currentUser = users.currentUser;
  if (!currentUser) {
    return <></>;
  }
  const form = useForm({
    values: {
      ...currentUser.info,
    },
  });
  const handleSubmit = (values: any) => {
    return users.updateUserProperty(currentUser.key, { info: values });
  };

  return (
    <Form form={form}>
      <FormInput name={'email'} />
      <Button onPress={form.handleSubmit(handleSubmit)}>Update</Button>
    </Form>
  );
});

export default UserSettings;
