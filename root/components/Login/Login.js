// import React from 'react';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
const localImage = require('./Logo.png');
const Login = props => {
  const navigation = useNavigation();
  const {setIsAuth} = props;
  return (
    <View style={styles.mainContainer}>
      <View>
        <Image source={localImage} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.loginBox}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text>Login</Text>
        </View>
        <TextInput style={styles.input} placeholder="username" />
        <TextInput style={styles.input} placeholder="password" />
        <Button title="Login" onPress={() => setIsAuth(true)} />
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text>
            Not yet registered?{' '}
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={{textDecorationLine: 'underline'}}>SignUp Now</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    borderWidth: 1,
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
