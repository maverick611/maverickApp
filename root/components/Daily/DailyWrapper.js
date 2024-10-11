import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Daily from './Daily';
import DailyQuestionsResponse from '../DailyQuestionsResponse/DailyQuestionsResponse';
import Profile from '../Profile/Profile';

const DailyWrapper = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DailyMain"
        component={Daily}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DailyQuestionsResponse"
        component={DailyQuestionsResponse}
        // options={{headerShown: false}}
      />
      {/* <Stack.Screen name="Profile" component={Profile} /> */}
    </Stack.Navigator>
  );
};

export default DailyWrapper;
