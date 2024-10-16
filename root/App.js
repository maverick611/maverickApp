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
import CertainReport from './components/CertainReport/CertainReport.js';
import UpdateProfilePicture from './components/UpdateProfilePicture/UpdateProfilePicture.js';
import Avatar from './components/Avatar/Avatar.js';
import Profile from './components/Profile/Profile.js';
import LongQuestionnaireResponses from './components/LongQuestionnaireResponses/LongQuestionnaireResponses.js';
import UpdatePersonalInfo from './components/UpdatePersonalInfo/UpdatePersonalInfo.js';
import HorizontalBarChart from './components/HorizontalBarChart/HorizontalBarChart.js';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const MyTabs = props => {
  const {loginToken} = props;
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
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Home">
        {props => <Home {...props} loginToken={loginToken} />}
      </Tab.Screen>
      <Tab.Screen name="Notify" component={Notify} />
      <Tab.Screen name="Report">
        {props => <Reports {...props} loginToken={loginToken} />}
      </Tab.Screen>
      <Tab.Screen name="Resources" component={Progress} />
      <Tab.Screen name="Daily">
        {props => <Daily {...props} loginToken={loginToken} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const App = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [loginToken, setLoginToken] = useState(null);
  return isAuth ? (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="none" options={{headerShown: false}}>
          {props => <MyTabs {...props} loginToken={loginToken} />}
        </Stack.Screen>
        <Stack.Screen name="Profile">
          {props => (
            <Profile
              {...props}
              setIsAuth={setIsAuth}
              setLoginToken={setLoginToken}
              loginToken={loginToken}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="UpdateProfilePicture"
          component={UpdateProfilePicture}
          options={{title: ''}}
        />
        <Stack.Screen name="Avatar" component={Avatar} options={{title: ''}} />
        <Stack.Screen
          name="DailyQuestionsResponse"
          component={DailyQuestionsResponse}
          options={{title: 'Your Response'}}
        />
        <Stack.Screen name="dq" options={{title: "Today's Questionnaire"}}>
          {props => (
            <LongQuestionnaire
              {...props}
              isItDailyQuestions={true}
              loginToken={loginToken}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="LongQuestionnaire"
          options={{title: 'Your Personalised Questionnare'}}>
          {props => (
            <LongQuestionnaire
              {...props}
              isItDailyQuestions={false}
              loginToken={loginToken}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="LongQuestionnaireResponses"
          options={{title: 'Your Response'}}
          component={LongQuestionnaireResponses}
        />
        <Stack.Screen
          name="CertainReport"
          component={CertainReport}
          options={{title: 'Your Report'}}
        />
        <Stack.Screen
          name="UpdatePersonalInfo"
          // component={UpdatePersonalInfo}
          options={{title: ''}}>
          {props => <UpdatePersonalInfo {...props} loginToken={loginToken} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  ) : (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" options={{headerShown: false}}>
          {props => (
            <Login
              {...props}
              setIsAuth={setIsAuth}
              setLoginToken={setLoginToken}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="SignUp" component={SignUp} />
        {/* how to handle user_id ??? */}
        <Stack.Screen name="Verification">
          {props => (
            <Verification
              {...props}
              setIsAuth={setIsAuth}
              setLoginToken={setLoginToken}
            />
          )}
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
