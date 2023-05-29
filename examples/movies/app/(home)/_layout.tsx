import { Drawer } from 'expo-router/drawer';
import { Button, View } from 'react-native';
import DrawerContent from '@react-navigation/drawer/src/views/DrawerContent';
import { useNavigationService } from '@artsiombarouski/rn-expo-router-service/src/hooks/useNavigationService';

const RootLayout = () => {
  const navigation = useNavigationService();
  return (
    <Drawer
      screenOptions={{
        drawerType: 'permanent',
      }}
      drawerContent={(props) => {
        return (
          <View>
            <DrawerContent {...props} />
            <Button
              title={'Login'}
              onPress={() => {
                navigation.push('/login');
              }}
            />
          </View>
        );
      }}
    >
      <Drawer.Screen
        name={'index'}
        options={{
          title: 'Movies',
          drawerLabel: 'Movies',
        }}
      />
      <Drawer.Screen
        name={'tv'}
        options={{
          title: 'TVs',
          drawerLabel: 'TVs',
        }}
      />
    </Drawer>
  );
};

export default RootLayout;
