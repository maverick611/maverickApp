/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import Login from './components/Login/Login.js';
import SignUp from './components/SignUp/SignUp.js';
import Verification from './components/Verification/Verification.js';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

function App() {
  return (
    <SafeAreaView>
      <Verification />
    </SafeAreaView>
  );
}

export default App;
