import React from 'react';
import { View } from 'react-native';
import { useService } from '@artsiombarouski/rn-services';
import { UserScopeService } from '../../services/UserScopeService';
import { Text } from 'react-native-paper';

const Dashboard = () => {
  const userScopeService = useService(UserScopeService);
  return (
    <View style={{ flex: 1 }}>
      <Text>Current user scope: {userScopeService.currentUserKey}</Text>
    </View>
  );
};

export default Dashboard;
