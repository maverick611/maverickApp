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
import Ionicons from 'react-native-vector-icons/Ionicons.js';
import DailyQuestions from './components/DailyQuestions/DailyQuestions.js';
import LongQuestionnaire from './components/LongQuestionnaire/LongQuestionnaire.js';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import Avatar from './components/Avatar/Avatar.js';
import Profile from './components/Profile/Profile.js';
import LongQuestionnaireResponses from './components/LongQuestionnaireResponses/LongQuestionnaireResponses.js';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const MyTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Notify') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Report') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (route.name === 'Resources') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Daily') {
            iconName = focused ? 'calendar-sharp' : 'calendar-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Notify" component={Notify} />
      <Tab.Screen name="Report" component={Reports} />
      <Tab.Screen name="Resources" component={Progress} />
      <Tab.Screen name="Daily" component={Daily} />
    </Tab.Navigator>
  );
};

const App = () => {
  const [isAuth, setIsAuth] = useState(false);

  return isAuth ? (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="none"
          component={MyTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen
          name="DailyQuestionsResponse"
          component={DailyQuestionsResponse}
          options={{title: 'Your Response'}}
        />
        <Stack.Screen
          name="dq"
          component={DailyQuestions}
          options={{title: "Today's Questionnaire"}}
        />
        <Stack.Screen
          name="LongQuestionnaire"
          component={LongQuestionnaire}
          options={{title: 'Your Personalised Questionnare'}}
        />
        <Stack.Screen
          name="LongQuestionnaireResponses"
          component={LongQuestionnaireResponses}
          options={{title: 'Your Response'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  ) : (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" options={{headerShown: false}}>
          {props => <Login {...props} setIsAuth={setIsAuth} />}
        </Stack.Screen>
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Verification">
          {props => <Verification {...props} setIsAuth={setIsAuth} />}
        </Stack.Screen>
        {/* <Stack.Screen name="Daily" component={Daily} />
        <Stack.Screen
          name="DailyQuestionsResponse"
          component={DailyQuestionsResponse}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
