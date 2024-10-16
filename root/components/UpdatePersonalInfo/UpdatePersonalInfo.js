import React, {useDebugValue, useEffect, useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';

const UpdatePersonalInfo = props => {
  const {loginToken} = props;
  const [userDetails, setUserDetails] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    username: '',
    dob: '',
  });
  console.log('userDetails', userDetails);

  useEffect(() => {
    const fetchPersonalDetails = async () => {
      const response = await fetch('http://10.0.2.2:3000/get_personal_info', {
        method: 'GET',
        headers: {
          authorization: `Bearer ${loginToken}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setUserDetails(data);
    };
    fetchPersonalDetails();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.dataContainer}>
        <Text>First Name</Text>
        <TextInput value={userDetails.first_name} style={styles.textInput} />
        <Text>Last Name</Text>
        <TextInput value={userDetails.last_name} style={styles.textInput} />
        <Text>Username</Text>
        <TextInput value={userDetails.username} style={styles.textInput} />
        <Text>Password</Text>
        <TextInput style={styles.textInput} secureTextEntry={true} />
        <Text>Email</Text>
        <TextInput value={userDetails.email} style={styles.textInput} />
        <Text>Phone Number</Text>
        <TextInput value={userDetails.phone_number} style={styles.textInput} />
        {/* <Text>Date of Birth</Text> */}
      </View>
      <View style={styles.button}>
        <Button title="Save Changes" />
      </View>
      <View style={styles.button}>
        <Button title="Cancel" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 5,
  },
  mainContainer: {
    padding: 15,
    backgroundColor: 'rgb(226,244,254)',
    height: '100%',
  },
  dataContainer: {
    padding: 20,
    backgroundColor: 'rgb(235,247,217)',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
  },
  textInput: {
    marginBottom: 8,
    backgroundColor: 'white',
    borderRadius: 5,
  },
});

export default UpdatePersonalInfo;
