import { ScrollView, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import IonicIcon from '@expo/vector-icons/Ionicons';

const Login = () => {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ alignItems: 'center' }}
      >
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
