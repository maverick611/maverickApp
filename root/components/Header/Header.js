import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Profile from '../Profile/Profile';
import {useNavigation} from '@react-navigation/native';

const logo = require('../../assets/Logo.png');

const Header = () => {
  const navigation = useNavigation();
  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };
  return (
    <SafeAreaView>
      <View style={styles.headerContainer}>
        <View style={styles.profile}>
          <TouchableOpacity onPress={handleProfilePress}>
            <Icon name="user-circle" size={40} />
          </TouchableOpacity>
        </View>

        <Image source={logo} resizeMode="contain" style={styles.logo} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    // padding: 5,
    // borderWidth: 2,
    display: 'flex',
    flexDirection: 'row',
    borderRadius: -30,
    backgroundColor: 'rgb(199	221	166	)',
    // justifyContent: 'center',
  },
  profile: {
    padding: 3,
    backgroundColor: 'rgb(176	216	236	)',
  },
  logo: {
    width: '80%',
    height: 50,
  },
});

export default Header;
