import React from 'react';
import {View, Text, TextInput, StyleSheet, Button} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const takeTitleBodyReturnNotification = (title, notification) => {
  return (
    <View style={styles.notifyBlock}>
      <View style={{marginRight: 15}}>
        <Icon name="info-circle" size={22} color="#000000" />
      </View>
      <View>
        <Text>{title}</Text>
        <Text>{notification}</Text>
      </View>
      <View style={{marginLeft: 'auto'}}>
        <Icon name="close" size={20} color="#000000" />
      </View>
    </View>
  );
};

const Notify = () => {
  const notifications = [
    ['Daily Questionnaire', 'Ready to take up the daily survey!!'],
    ['Learning Progress', 'Complete watching the videos!!'],
    ['Update Avatar', 'Get your new Avatar now!!'],
    ['Reports', 'View your reports and risk analysis!!'],
    ['Take Questionnaire', 'Ready to take up the daily survey!!'],
    ['Update Profile Picture', 'Get your new photo updated!!'],
  ];

  return (
    <View style={{backgroundColor: 'rgb(226	244	254	)', height: '100%'}}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <Text style={{fontSize: 22}}>NOTIFICATIONS</Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgb(235	247	217	)',
          margin: 20,
          paddingTop: 15,
          borderWidth: 1,
          borderRadius: 18,
          height: '75%',
          ...Platform.select({
            android: {
              elevation: 5,
            },
          }),
        }}>
        {notifications.map((value, index) => (
          <View key={index}>
            {takeTitleBodyReturnNotification(value[0], value[1])}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  notifyBlock: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: 'black',
    margin: 10,
    padding: 10,
    borderRadius: 5,
    width: '80%',
    backgroundColor: 'white',
  },
});

export default Notify;
