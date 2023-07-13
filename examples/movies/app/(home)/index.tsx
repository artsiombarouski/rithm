import { UserScopeService } from '../../services/UserScopeService';
import { useService } from '@artsiombarouski/rn-services';
import { Text } from 'native-base';
import React from 'react';
import { View } from 'react-native';

const Dashboard = () => {
  const userScopeService = useService(UserScopeService);
  return (
    <View style={{ flex: 1 }}>
      <Text>Current user scope: {userScopeService.currentUserKey}</Text>
    </View>
  );
};

export default Dashboard;
