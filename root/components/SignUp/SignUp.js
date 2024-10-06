import React from 'react';
import {View, Text, TextInput, StyleSheet, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
const takePlaceHolderAndLogoReturnTextInput = (logo, placeHolder) => {
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
      <TextInput placeholder={placeHolder} style={styles.input} />
    </View>
  );
};

const SignUp = props => {
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
      <Text>Let's Get Started!</Text>
      <Text>Create an account experience all features</Text>
      <View style={{backgroundColor: '#EBF7D9', margin: 10, padding: 10}}>
        {fields.map((field, index) => (
          <View key={index} style={{margin: 6}}>
            {takePlaceHolderAndLogoReturnTextInput(logoMapper[field], field)}
          </View>
        ))}
      </View>
      <Button
        title="SignUp"
        onPress={() => navigation.navigate('Verification')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
