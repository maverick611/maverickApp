import React from 'react';
import {View, Text, TextInput, StyleSheet, Button} from 'react-native';

const takePlaceHolderAndLogoReturnTextInput = (logo, placeHolder) => {
  return <TextInput value={placeHolder} style={styles.input} />;
};

const Verification = () => {
  const fields = ['Code Sent To Your Phone', 'Code Sent To Your Mail'];
  return (
    <View>
      <Text>Confirm your Email and Phone</Text>
      <View>
        {fields.map((field, index) => (
          <View key={index}>
            {takePlaceHolderAndLogoReturnTextInput('None', field)}
          </View>
        ))}
      </View>
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

export default Verification;
