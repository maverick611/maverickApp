import React from 'react';
import {Image, View, Text, Button, StyleSheet} from 'react-native';
const avatar = require('../../assets/avatar1.png');
const Avatar = () => {
  return (
    <View style={styles.mainContainer}>
      <Text>Current Avthar</Text>
      <Image source={avatar} style={styles.avatarImage} />
      <Button title="Make Your Avatar" />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    margin: 20,
    width: '70%',
    height: '70%',
    borderRadius: 40,
  },
});

export default Avatar;
