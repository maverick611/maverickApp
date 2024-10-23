import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../Header/Header';
import {ScrollView} from 'react-native-gesture-handler';

const Notify = () => {
  const notifications = {
    toShow: [
      {
        id: '1',
        title: 'Daily Questionnaire',
        body: 'Ready to take up the daily survey!!',
      },
      {
        id: '2',
        title: 'Learning Progress',
        body: 'Complete watching the videos!!',
      },
      {id: '3', title: 'Update Avatar', body: 'Get your new Avatar now!!'},
      {
        id: '4',
        title: 'Reports',
        body: 'View your reports and risk analysis!!',
      },
      {
        id: '5',
        title: 'Take Questionnaire',
        body: 'Ready to take up the daily survey!!',
      },
      {
        id: '6',
        title: 'Update Profile Picture',
        body: 'Get your new photo updated!!',
      },
      {
        id: '7',
        title: 'Take Questionnaire',
        body: 'Ready to take up the daily survey!!',
      },
      {
        id: '8',
        title: 'Update Profile Picture',
        body: 'Get your new photo updated!!',
      },
      {
        id: '9',
        title: 'Take Questionnaire',
        body: 'Ready to take up the daily survey!!',
      },
      {
        id: '10',
        title: 'Update Profile Picture',
        body: 'Get your new photo updated!!',
      },
    ],
  };

  const [allNotification, updateNotifications] = useState(notifications);
  const removeNotifications = id => {
    updateNotifications({
      toShow: allNotification.toShow.filter(a => a.id !== id),
    });
  };

  const takeTitleBodyReturnNotification = (title, notification, id) => {
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
          <TouchableOpacity onPress={() => removeNotifications(id)}>
            <Icon name="close" size={20} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{backgroundColor: 'rgb(226	244	254	)', height: '100%'}}>
      <Header />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <Text style={{fontSize: 22}}>NOTIFICATIONS</Text>
      </View>
      <ScrollView>
        <View style={styles.NotificationContainer}>
          {allNotification['toShow'].length > 0 ? (
            allNotification['toShow'].map((value, index) => (
              <View key={index}>
                {takeTitleBodyReturnNotification(
                  value['title'],
                  value['body'],
                  value['id'],
                )}
              </View>
            ))
          ) : (
            <Text>Nothing to Show</Text>
          )}
        </View>
      </ScrollView>
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
  NotificationContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(235	247	217	)',
    margin: 20,
    paddingTop: 15,
    paddingBottom: 15,
    borderWidth: 1,
    borderRadius: 18,
    // height: '75%',
    ...Platform.select({
      android: {
        elevation: 5,
      },
    }),
  },
});

export default Notify;
