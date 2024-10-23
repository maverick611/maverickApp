import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const UpdateProfilePicture = () => {
  return (
    <View style={styles.mainContainer}>
      <Icon name="user-circle" size={100} />
      <View style={styles.styleButton}>
        <Button title="Upload New Picture" />
      </View>
      <View style={styles.styleButton}>
        <Button style={{width: '100%'}} title="Make New Avatar" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    padding: 20,
    margin: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleButton: {
    paddingTop: 30,
    minWidth: '70%',
  },
});

export default UpdateProfilePicture;
