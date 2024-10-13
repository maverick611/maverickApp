import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import DatePicker from 'react-native-date-picker';
const takePlaceHolderAndLogoReturnTextInput = (
  logo,
  placeHolder,
  stateValue,
  onChangeFunc,
  field,
  open,
  setOpen,
  errorFields,
  inlineErrorMsg,
  valueMapper,
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

  return logo === 'calendar' ? (
    <TouchableOpacity onPress={() => setOpen(true)}>
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
          value={
            stateValue == '' ? '' : String(stateValue.toLocaleDateString())
          }
          style={styles.input}
          placeholder="Date of Birth"
          onPress={event => {
            event.preventDefault();
            setOpen(true);
          }}
        />
        <DatePicker
          mode="date"
          minimumDate={new Date('1900-01-01')}
          modal
          open={open}
          date={stateValue == '' ? new Date() : stateValue}
          onConfirm={date => {
            setOpen(false);
            // setDate(date)
            onChangeFunc(date, field);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </View>
    </TouchableOpacity>
  ) : (
    <View>
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
          style={
            errorFields[valueMapper[field]] ? styles.inputError : styles.input
          }
          onChangeText={text => onChangeFunc(text, field)}
          secureTextEntry={placeHolder.includes('asswo')}
        />
      </View>
      {errorFields[valueMapper[field]] && (
        <Text style={{color: 'red'}}>{inlineErrorMsg[valueMapper[field]]}</Text>
      )}
    </View>
  );
};

const SignUp = props => {
  const [errorFields, setErrorFields] = useState({
    firstName: false,
    lastName: false,
    username: false,
    phoneNumber: false,
    password: false,
    confirmPassword: false,
    dateOfBirth: false,
    email: false,
  });
  const [inlineErrorMsg, setInlineErrorMsg] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    email: '',
  });
  const [open, setOpen] = useState(false);
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

  const checkEmail = mail => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(postData.email);
  };

  const checkPhoneNumber = phoneNumber => {
    const phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    return phoneRegex.test(phoneNumber);
  };

  const addUser = async () => {
    setErrorMsg('');
    if (Object.values(errorFields).filter(a => a).length > 0) {
      setErrorMsg('Please check all fields');
      return;
    }
    console.log('postData', postData);

    if (!checkPhoneNumber(postData.phoneNumber)) {
      setErrorMsg('Invalid phone number');
      return;
    }

    if (postData.confirmPassword !== postData.password) {
      setErrorMsg("Passwords don't match");
      return;
    }
    if (!checkEmail(postData.email)) {
      setErrorMsg('Invalid Email');
      return;
    }

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

  const forSettingInlineError = (field, msg) => {
    setErrorFields(prev => ({...prev, [field]: true}));
    setInlineErrorMsg(prev => ({...prev, [field]: msg}));
  };

  const forRemovingInlineError = field => {
    setErrorFields(prev => ({...prev, [field]: false}));
    setInlineErrorMsg(prev => ({...prev, [field]: ''}));
  };

  const findWhichAndSetValue = (text, id) => {
    const field = valueMapper[id];
    const regexToCheckIfAllAlphabets = /^[A-Za-z]+$/;
    if (field === 'firstName' || field === 'lastName') {
      if (!regexToCheckIfAllAlphabets.test(text)) {
        forSettingInlineError(field, 'only alphabets allowed');
      } else {
        forRemovingInlineError(field);
      }
    }
    if (field === 'username') {
    }
    if (field === 'phoneNumber') {
      // handle for diff countries
      if (!checkPhoneNumber(text)) {
        forSettingInlineError(field, 'Invalid Phone Number');
      } else {
        forRemovingInlineError(field);
      }
    }
    if (field === 'password') {
      if (text.length < 6) {
        forSettingInlineError(field, 'Password must be more than 6 characters');
      } else {
        forRemovingInlineError(field);
      }
    }
    if (field === 'confirmPassword') {
      if (postData.password !== text) {
        forSettingInlineError(field, 'Passwords do not match');
      } else {
        forRemovingInlineError(field);
      }
    }
    if (field === 'dateOfBirth') {
      // any age limit on users ??
    }
    if (field === 'email') {
      if (!checkEmail(text)) {
        forSettingInlineError(field, 'Invalid Email');
      } else {
        forRemovingInlineError(field);
      }
    }
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
                  open,
                  setOpen,
                  errorFields,
                  inlineErrorMsg,
                  valueMapper,
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
  inputError: {
    width: '90%',
    height: 40,
    margin: 6,
    borderWidth: 2,
    borderColor: 'red',
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
});

export default SignUp;
