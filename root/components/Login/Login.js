// import React from 'react';
import React from 'react';

import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
const localImage = require('./Logo.png');
const Login = () => {
  return (
    <View style={styles.mainContainer}>
      <View>
        <Image source={localImage} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.loginBox}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text>Login</Text>
        </View>
        <TextInput style={styles.input} value="username" />
        <TextInput style={styles.input} value="password" />
        <Button title="Login" />
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text>
            Not yet registered?{' '}
            <Text style={{textDecorationLine: 'underline'}}>SignUp Now</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    borderWidth: 2,
    // borderColor: 'red',
    // justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  input: {
    height: 40,
    margin: 6,
    borderWidth: 2,
    borderColor: 'black',
    padding: 10,
    backgroundColor: 'white',
  },
  loginBox: {
    padding: 50,
    backgroundColor: '#EBF7D9',
    borderWidth: 5,
    borderRadius: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  image: {
    width: 250,
    height: 150,
    marginBottom: 20,
  },
});

export default Login;
