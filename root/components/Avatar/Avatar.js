import React from 'react';
import {View, Text} from 'react-native';
import {Image} from 'react-native-svg';
const avatar = require('../../assets/avatar.png');
const Avatar = () => {
  return (
    <View>
      <Text>Current Avthar</Text>
      {/* <Image source={avatar} /> */}
    </View>
  );
};

export default Avatar;
