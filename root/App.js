import React, {useState} from 'react';
import Login from './components/Login/Login.js';
import SignUp from './components/SignUp/SignUp.js';
import Verification from './components/Verification/Verification.js';
import Home from './components/Home/Home.js';
import Notify from './components/Notify/Notify.js';
import Progress from './components/Progress/Progress.js';
import DailyQuestionsResponse from './components/DailyQuestionsResponse/DailyQuestionsResponse.js';
import Reports from './components/Reports/Reports.js';
import Daily from './components/Daily/Daily.js';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const MyTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Notify" component={Notify} />
      <Tab.Screen name="Report" component={Reports} />
      <Tab.Screen name="Progress" component={Progress} />
      <Tab.Screen name="Daily" component={Daily} />
    </Tab.Navigator>
  );
};

const App = () => {
  const [isAuth, setIsAuth] = useState(false);

  return isAuth ? (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  ) : (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login">
          {props => <Login {...props} setIsAuth={setIsAuth} />}
        </Stack.Screen>
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Verification">
          {props => <Verification {...props} setIsAuth={setIsAuth} />}
        </Stack.Screen>
        <Stack.Screen name="Daily" component={Daily} />
        <Stack.Screen
          name="DailyQuestionsResponse"
          component={DailyQuestionsResponse}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
