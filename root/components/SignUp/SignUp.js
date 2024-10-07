import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
const takePlaceHolderAndLogoReturnTextInput = (
  logo,
  placeHolder,
  stateValue,
  onChangeFunc,
  field,
) => {
  const myIcon =
    logo == 'mail' ? (
      <EntypoIcon
        name={logo}
        size={logo == 'calendar' ? 26 : 30}
        color="#900"
        style={{marginTop: 10}}
      />
    ) : (
      <Icon
        name={logo}
        size={logo == 'calendar' ? 26 : 30}
        color="#900"
        style={{marginTop: 10}}
      />
    );

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        // justifyContent: 'space-around',
        backgroundColor: 'white',
        padding: 10,
      }}>
      {myIcon}
      <TextInput
        value={stateValue}
        placeholder={placeHolder}
        style={styles.input}
        onChangeText={text => onChangeFunc(text, field)}
        secureTextEntry={placeHolder.includes('asswo')}
      />
    </View>
  );
};

const SignUp = props => {
  const [errorMsg, setErrorMsg] = useState('');
  const [postData, setPostData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    email: '',
  });
  const logoMapper = {
    'First Name': 'user',
    'Last Name': 'user',
    Username: 'user',
    'Phone Number': 'phone',
    Password: 'lock',
    'Confirm Password': 'lock',
    'Date of Birth': 'calendar',
    Email: 'mail',
  };
  const fields = [
    'First Name',
    'Last Name',
    'Username',
    'Phone Number',
    'Password',
    'Confirm Password',
    'Date of Birth',
    'Email',
  ];
  const valueMapper = {
    'First Name': 'firstName',
    'Last Name': 'lastName',
    Username: 'username',
    'Phone Number': 'phoneNumber',
    Password: 'password',
    'Confirm Password': 'confirmPassword',
    'Date of Birth': 'dateOfBirth',
    Email: 'email',
  };

  const addUser = async () => {
    console.log(postData);
    setErrorMsg('');
    try {
      const response = await fetch('http://10.0.2.2:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      const result = await response.json();
      if (response.ok) {
        navigation.navigate('Verification');
      } else {
        setErrorMsg(JSON.stringify(result.error));
      }
    } catch (err) {
      console.log('something happened');
      console.log(err);
    } finally {
    }
  };

  const findWhichAndSetValue = (text, id) => {
    const field = valueMapper[id];
    setPostData(prev => ({...prev, [field]: text}));
  };

  const navigation = useNavigation();
  const {setIsAuth} = props;
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(226	244	254	)',
      }}>
      <ScrollView>
        <View style={{margin: 10}}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>Let's Get Started!</Text>
            <Text>Create an account experience all features</Text>
          </View>
          <View style={{backgroundColor: '#EBF7D9', margin: 10, padding: 10}}>
            {fields.map((field, index) => (
              <View key={index} style={{margin: 6}}>
                {takePlaceHolderAndLogoReturnTextInput(
                  logoMapper[field],
                  field,
                  postData[valueMapper[field]],
                  findWhichAndSetValue,
                  field,
                )}
              </View>
            ))}
          </View>

          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {errorMsg != '' && <Text style={styles.errorCode}>{errorMsg}</Text>}
            <Button
              title="       SignUp       "
              onPress={addUser}
              // onPress={() => navigation.navigate('Verification')}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  errorCode: {
    color: 'red',
  },
  input: {
    width: '90%',
    height: 40,
    margin: 6,
    borderWidth: 2,
    borderColor: 'black',
    borderWidth: 0,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
});

export default SignUp;
