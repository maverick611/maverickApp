import React, {useEffect, useState} from 'react';
import {Image, Text, View, StyleSheet, Button, Linking} from 'react-native';
import Header from '../Header/Header';
import {ScrollView} from 'react-native-gesture-handler';

const handlePress = async () => {
  const url = 'market://details?id=com.android.chrome';
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  } else {
    console.log(`Don't know how to open this URL: ${url}`);
  }
};

const Home = props => {
  const [homeDetails, setHomeDetails] = useState({});
  const {navigation} = props;
  const aboutUsImage = require('../../assets/homeAboutUsImage.jpg');

  useEffect(() => {
    const fetchHomeDetails = async () => {
      const response = await fetch('http://10.0.2.2:3000/home');
      const data = await response.json();
      setHomeDetails(data);
    };
    fetchHomeDetails();
  }, []);

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'rgb(226	244	254	)'}}>
      <Header />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          margin: 15,
        }}>
        <Text>WELCOME TO MAVERICK HEALTH</Text>
      </View>
      <View>
        <View style={{marginTop: 20, padding: 10}}>
          <Text>About Us</Text>
          <Image
            source={aboutUsImage}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={{marginTop: 20, padding: 10}}>
          <Text>Who are we?</Text>
          <Image
            source={aboutUsImage}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={{margin: 10}}>
          <Button
            onPress={() => navigation.navigate('LongQuestionnaire')}
            title="Take Questionnaire"
          />
        </View>
        <View style={{margin: 10}}>
          <Button onPress={handlePress} title="Maverick Website" />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '95%',
    height: 230,
    marginBottom: 20,
  },
});

export default Home;
