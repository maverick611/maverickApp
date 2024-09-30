import React from 'react';
import {Image, Text, View, StyleSheet, Button} from 'react-native';

const Home = () => {
  const aboutUsImage = require('../../assets/homeAboutUsImage.jpg');
  return (
    <View style={{flex: 1}}>
      <Text>WELCOME TO MAVERICK HEALTH</Text>
      <View>
        <View>
          <Text>About Us</Text>
          <Image
            source={aboutUsImage}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View>
          <Text>Who are we?</Text>
          <Image
            source={aboutUsImage}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={{margin: 10}}>
          <Button title="Take Questionnaire" />
        </View>
        <View style={{margin: 10}}>
          <Button title="Maverick Website" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 450,
    height: 150,
    marginBottom: 20,
  },
});

export default Home;
