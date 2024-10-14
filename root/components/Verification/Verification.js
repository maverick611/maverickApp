import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, Button} from 'react-native';

const takePlaceHolderAndLogoReturnTextInput = (
  logo,
  placeHolder,
  stateValue,
  updateEnteredOTP,
  index,
) => {
  return (
    <TextInput
      placeholder={placeHolder}
      style={styles.input}
      value={stateValue}
      onChangeText={text => updateEnteredOTP(text, index)}
    />
  );
};

const Verification = props => {
  const [otp, SetOtp] = useState({phoneCode: '', emailCode: ''});
  const [errorMSG, setErrorMSG] = useState('');
  const {setIsAuth} = props;
  const fields = ['Code Sent To Your Phone', 'Code Sent To Your Mail'];
  const mapper = ['phoneCode', 'emailCode'];
  const updateEnteredOTP = (text, pm) => {
    console.log(text);
    console.log(pm);
    SetOtp(prev => ({...prev, [mapper[pm]]: text}));
  };
  const sendCodesToBE = async () => {
    setErrorMSG('');
    const response = await fetch('http://10.0.2.2:3000/confirm_signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(otp),
    });
    const data = await response.json();
    if (response.ok) {
      setIsAuth(true);
    } else {
      setErrorMSG(data.error);
    }
  };
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
      {console.log('SetOtp', otp)}
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
                {takePlaceHolderAndLogoReturnTextInput(
                  'None',
                  field,
                  otp[mapper[index]],
                  updateEnteredOTP,
                  index,
                )}
              </View>
            ))}
          </View>
          <View style={{marginTop: 15}}>
            {errorMSG.length > 0 && (
              <Text style={styles.errorMSG}>{errorMSG}</Text>
            )}
            <Button title="Submit" onPress={() => sendCodesToBE()} />
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
  errorMSG: {
    color: 'red',
  },
});

export default Verification;
