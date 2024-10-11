// import React from 'react';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
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
  const [loading, setLoading] = useState(false);
  const {setIsAuth} = props;
  const [postData, setPostData] = useState({username: '', password: ''});
  const [errorMsg, showErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(true);

  const setUserName = text => {
    setPostData(prevValue => ({...prevValue, username: text}));
    // console.log(postData);
  };

  const setPassword = text => {
    setPostData(prevValue => ({...prevValue, password: text}));
  };

  const checkLogin = async () => {
    setLoading(true);
    showErrorMsg('');
    try {
      const response = await fetch('http://10.0.2.2:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      const statusCode = response.status;
      const result = await response.json();
      if (response.ok) {
        setIsAuth(true);
      } else {
        showErrorMsg(JSON.stringify(result.error));
      }
    } catch (err) {
      console.log('something happened');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View>
        <Image source={localImage} style={styles.image} resizeMode="contain" />
      </View>
      {errorMsg != '' && <Text style={styles.errorCode}>{errorMsg}</Text>}
      <View style={styles.loginBox}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text>Login</Text>
        </View>
        <View style={styles.TextInputContainer}>
          <FontAwesomeIcon name="user" size={25} />
          <TextInput
            style={styles.input}
            onChangeText={text => setUserName(text)}
            value={postData.username}
            placeholder="username"
          />
        </View>
        <View style={styles.TextInputContainer}>
          <TextInput
            value={postData.password}
            onChangeText={text => setPassword(text)}
            secureTextEntry={showPassword}
            style={styles.input}
            placeholder="password"
          />
          <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
            <FontAwesomeIcon
              name={showPassword ? 'eye-slash' : 'eye'}
              size={20}
            />
          </TouchableOpacity>
        </View>
        <Button title="Login" onPress={checkLogin} />
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
  errorCode: {
    color: 'red',
    // fontSize: '20',
  },
  TextInputContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 2,
    backgroundColor: 'white',
    padding: 3,
    margin: 5,
    // backgroundColor: 'red',
  },
  mainContainer: {
    borderWidth: 1,
    // borderColor: 'red',
    // justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  input: {
    height: 30,
    margin: 3,
    padding: 2,
    backgroundColor: 'white',
    flex: 1,
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
