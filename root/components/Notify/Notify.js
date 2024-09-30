import React from 'react';
import {View, Text, TextInput, StyleSheet, Button} from 'react-native';

const takeTitleBodyReturnNotification = (title, notification) => {
  return (
    <View style={styles.notifyBlock}>
      <Text>{title}</Text>
      <Text>{notification}</Text>
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
    <View>
      <Text>NOTIFICATIONS</Text>
      <View>
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
    borderWidth: 2,
    borderColor: 'black',
    margin: 10,
    padding: 10,
    borderRadius: 5,
  },
});

export default Notify;
