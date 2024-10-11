import React from 'react';
import {View, Text, TextInput, StyleSheet, Button} from 'react-native';

const takePlaceHolderAndLogoReturnTextInput = (logo, placeHolder) => {
  return <TextInput placeholder={placeHolder} style={styles.input} />;
};

const Verification = props => {
  const {setIsAuth} = props;
  const fields = ['Code Sent To Your Phone', 'Code Sent To Your Mail'];
  return (
    <View
      style={{
        backgroundColor: 'rgb(226	244	254	)',
        padding: 15,
        margin: 0,
        borderRadius: 10,
        height: '100%',
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
      }}>
      <View
        style={{
          padding: 10,
          paddingTop: 40,
          paddingBottom: 40,
          backgroundColor: 'rgb(235	247	217	)',
        }}>
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Confirm your Email and Phone</Text>
        </View>
        <View>
          <View>
            {fields.map((field, index) => (
              <View key={index}>
                {takePlaceHolderAndLogoReturnTextInput('None', field)}
              </View>
            ))}
          </View>
          <View style={{marginTop: 15}}>
            <Button title="Submit" onPress={() => setIsAuth(true)} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 6,
    borderWidth: 0,
    borderColor: 'black',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
});

export default Verification;
