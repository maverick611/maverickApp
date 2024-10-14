import React from 'react';
import {
  Button,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const Profile = props => {
  const {setIsAuth, loginToken, setLoginToken} = props;
  const callLogOut = async () => {
    setIsAuth(false);
    setLoginToken(null);
    const response = await fetch('http://10.0.2.2:3000/logout', {
      method: 'GET',
      headers: {
        authorization: `Bearer ${loginToken}`,
        'Content-Type': 'application/json',
      },
    });
  };
  const {navigation} = props;
  const onClickComponentToShow = {
    'PERSONAL INFORMATION': 'UpdatePersonalInfo',
    'UPDATE PROFILE PICTURE': 'UpdateProfilePicture',
    'SEE YOUR HERO JOURNEY': 'Avatar',
  };
  return (
    <View style={styles.mainContainer}>
      <Icon name="user-circle" size={70} />
      <Text>USER NAME</Text>
      {[
        'PERSONAL INFORMATION',
        'UPDATE PROFILE PICTURE',
        'SEE YOUR HERO JOURNEY',
        'LOG OUT',
      ].map((value, index) => (
        <View key={index} style={{width: '60%', margin: 20}}>
          <Button
            title={value}
            onPress={() =>
              value === 'LOG OUT'
                ? callLogOut()
                : navigation.navigate(onClickComponentToShow[value])
            }
          />
        </View>
      ))}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 80,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  makeItAButton: {
    backgroundColor: 'rgb(25	31	99	)',
  },
});
