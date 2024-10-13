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
  const {setIsAuth} = props;
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
                ? setIsAuth(false)
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
