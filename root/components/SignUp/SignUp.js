import React from 'react';
import {View, Text, TextInput, StyleSheet, Button} from 'react-native';

const takePlaceHolderAndLogoReturnTextInput = (logo, placeHolder) => {
  return <TextInput value={placeHolder} style={styles.input} />;
};

const SignUp = () => {
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
  return (
    <View>
      <Text>Let's Get Started!</Text>
      <Text>Create an account experience all features</Text>
      {fields.map((field, index) =>
        takePlaceHolderAndLogoReturnTextInput('None', field),
      )}
      <Button title="SignUp" />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 6,
    borderWidth: 2,
    borderColor: 'black',
    padding: 10,
    backgroundColor: 'white',
  },
});

export default SignUp;
