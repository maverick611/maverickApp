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
  const myIcon = (
    <Icon name={'calendar'} size={26} color="#900" style={{marginTop: 10}} />
  );
  const {loginToken} = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    username: '',
    dob: '',
  });

  const fetchPersonalDetails = async () => {
    const response = await fetch('http://10.0.2.2:3000/get_personal_info', {
      method: 'GET',
      headers: {
        authorization: `Bearer ${loginToken}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log('userDetailsss', data);

    setUserDetails(data);
  };
  useEffect(() => {
    fetchPersonalDetails();
  }, []);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.dataContainer}>
        <Text>First Name</Text>
        <TextInput value={userDetails.first_name} style={styles.textInput} />
        <Text>Last Name</Text>
        <TextInput value={userDetails.last_name} style={styles.textInput} />
        {/* <Text>Username</Text>
        <TextInput value={userDetails.username} style={styles.textInput} /> */}
        <Text>Date of Birth</Text>
        <TouchableOpacity onPress={() => setOpen(true)}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              // justifyContent: 'space-around',
              backgroundColor: 'white',
              padding: 10,
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
                setUserDetails(prev => ({...prev, dob: date}));
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />
          </View>
        </TouchableOpacity>
        <Text>Password</Text>
        <TextInput style={styles.textInput} secureTextEntry={true} />
        <Text>Email</Text>
        <TextInput value={userDetails.email} style={styles.textInput} />
        <Text>Phone Number</Text>
        <TextInput value={userDetails.phone_number} style={styles.textInput} />
      </View>
      <View style={styles.button}>
        <Button title="Save Changes" onPress={openModal} />
      </View>
      <View style={styles.button}>
        <Button title="Cancel" />
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
            <Text style={styles.modalText}>Changes Saved Successfully!</Text>
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
