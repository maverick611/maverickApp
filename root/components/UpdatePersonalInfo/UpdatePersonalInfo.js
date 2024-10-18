import React, {useEffect, useState} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  Alert,
  TouchableOpacity,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
const UpdatePersonalInfo = props => {
  const [modalBodyText, SetModalBodyText] = useState('');
  const {loginToken} = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    password: '',
    username: '',
    dob: '',
  });
  // toISOString().split('T')[0]
  const fetchPersonalDetails = async () => {
    const response = await fetch('http://10.0.2.2:3000/get_personal_info', {
      method: 'GET',
      headers: {
        authorization: `Bearer ${loginToken}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log('data from json', data);

    setUserDetails({...data, password: ''});
  };
  console.log('line 40', userDetails);
  useEffect(() => {
    fetchPersonalDetails();
  }, []);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const setPersonalDetails = async () => {
    console.log(userDetails);
    // return;
    try {
      // return;
      const response = await fetch(
        'http://10.0.2.2:3000/update_personal_info',
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${loginToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userDetails),
        },
      );
      console.log('bbbbbb', response);
      if (response.ok) {
        SetModalBodyText('Changes Saved Succesfully');
      } else {
        SetModalBodyText('Some Issue occured'); // will make changes
      }
    } catch (err) {
      console.log('some error occurred', err);
    } finally {
      openModal();
      fetchPersonalDetails();
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.dataContainer}>
        <Text>First Name</Text>
        <TextInput
          value={userDetails.first_name}
          style={styles.textInput}
          onChangeText={text =>
            setUserDetails(prev => ({...prev, first_name: text}))
          }
        />
        <Text>Last Name</Text>
        <TextInput
          value={userDetails.last_name}
          style={styles.textInput}
          onChangeText={text =>
            setUserDetails(prev => ({...prev, last_name: text}))
          }
        />
        <Text>Date of Birth</Text>
        <TouchableOpacity onPress={() => setOpen(true)}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              // justifyContent: 'space-around',
              backgroundColor: 'white',
            }}>
            <TextInput
              value={
                userDetails.dob == ''
                  ? ''
                  : String(new Date(userDetails['dob']).toLocaleDateString())
              }
              style={styles.textInput}
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
              date={
                userDetails.dob == ''
                  ? new Date()
                  : new Date(userDetails['dob'])
              }
              onConfirm={date => {
                setOpen(false);
                setUserDetails(prev => ({
                  ...prev,
                  dob: date.toISOString().split('T')[0],
                }));
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />
          </View>
        </TouchableOpacity>
        <Text>Password</Text>
        <TextInput
          style={styles.textInput}
          value={userDetails.password}
          secureTextEntry={true}
          placeholder="***********"
          onChangeText={text =>
            setUserDetails(prev => ({...prev, password: text}))
          }
        />
        <Text>Email</Text>
        <TextInput
          value={userDetails.email}
          style={styles.textInput}
          onChangeText={text =>
            setUserDetails(prev => ({...prev, email: text}))
          }
        />
        <Text>Phone Number</Text>
        <TextInput
          value={userDetails.phone_number}
          style={styles.textInput}
          onChangeText={text =>
            setUserDetails(prev => ({...prev, phone_number: text}))
          }
        />
      </View>
      <View style={styles.button}>
        {/* <Button title="Save Changes" onPress={openModal} /> */}
        <Button title="Save Changes" onPress={setPersonalDetails} />
      </View>
      <View style={styles.button}>
        <Button title="Cancel" onPress={fetchPersonalDetails} />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalBodyText}</Text>
            <Button title="Close" onPress={closeModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... (previous styles remain the same)
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
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
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default UpdatePersonalInfo;
