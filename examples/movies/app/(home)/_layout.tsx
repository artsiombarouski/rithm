import { Drawer } from 'expo-router/drawer';
import { View } from 'react-native';
import DrawerContent from '@react-navigation/drawer/src/views/DrawerContent';
import { useNavigationService } from '@artsiombarouski/rn-expo-router-service/src/hooks/useNavigationService';
import {
  Avatar,
  Divider,
  IconButton,
  Menu,
  Text,
  useTheme,
} from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useUsers } from '../../services/utils';

const UserView = observer(() => {
  const theme = useTheme();
  const users = useUsers();
  const navigation = useNavigationService();
  const currentUser = users.currentUser;
  const [isMenuVisible, setMenuVisible] = useState(false);

  if (!currentUser) {
    return <></>;
  }

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceVariant,
      }}
    >
      <Avatar.Text
        size={32}
        label={currentUser.info.email.substring(0, 2)}
        style={{ marginRight: 16 }}
      />
      <Text variant={'titleMedium'} style={{ flex: 1 }}>
        {currentUser.info.email}
      </Text>
      <Menu
        visible={isMenuVisible}
        onDismiss={() => {
          setMenuVisible(false);
        }}
        anchor={
          <IconButton
            icon={'dots-vertical'}
            onPress={() => {
              setMenuVisible(!isMenuVisible);
            }}
          />
        }
      >
        {users.users.map((user) => {
          return (
            <Menu.Item
              key={user.key}
              title={
                <View
                  style={{
                    minWidth: 240,
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <Avatar.Text
                    size={32}
                    label={user.info.email.substring(0, 2)}
                    style={{ marginRight: 8 }}
                  />
                  <Text variant={'titleMedium'} style={{ flex: 1 }}>
                    {user.info.email}
                  </Text>
                </View>
              }
              onPress={() => {
                setMenuVisible(false);
                return users.setCurrentUser(user.key);
              }}
            />
          );
        })}
        <Divider style={{ marginVertical: 8 }} />
        <Menu.Item
          key={'add-account'}
          title={'Add account'}
          onPress={() => {
            setMenuVisible(false);
            navigation.push('/login');
          }}
        />
        <Menu.Item
          key={'logout'}
          title={'Logout'}
          onPress={() => {
            users.logout().then(() => {
              setMenuVisible(false);
            });
          }}
        />
      </Menu>
    </View>
  );
});

const RootLayout = () => {
  return (
    <Drawer
      screenOptions={{
        drawerType: 'permanent',
      }}
      drawerContent={(props) => {
        return (
          <View style={{ flex: 1 }}>
            <UserView />
            <DrawerContent {...props} />
            <View style={{ flex: 1 }} />
          </View>
        );
      }}
    >
      <Drawer.Screen
        name={'index'}
        options={{
          title: 'Dashboard',
          drawerLabel: 'Dashboard',
        }}
      />
      <Drawer.Screen
        name={'movie'}
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
      <Drawer.Screen
        name={'form'}
        options={{
          title: 'Form',
          drawerLabel: 'Form',
        }}
      />
    </Drawer>
  );
};

export default RootLayout;
