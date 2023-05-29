import { Drawer } from 'expo-router/drawer';

const RootLayout = () => {
  return (
    <Drawer
      screenOptions={{
        drawerType: 'permanent',
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
