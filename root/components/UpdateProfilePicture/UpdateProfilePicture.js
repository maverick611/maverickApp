import React, {useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {launchImageLibrary} from 'react-native-image-picker';
const UpdateProfilePicture = () => {
  const getProfilePic = async () => {
    const pic = await launchImageLibrary();
  };
  const [photo, setPhoto] = useState(null);

  const handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    launchImageLibrary(options, response => {
      if (response.assets && response.assets[0].uri) {
        setPhoto(response.assets[0]);
      }
    });
  };

  const handleUploadPhoto = async () => {
    if (!photo) {
      console.log('No photo selected');
      return;
    }

    try {
      // Convert image to blob
      const photoBlob = await BlobUtil.createFromUri(photo.uri);

      // Create form data
      const formData = new FormData();
      formData.append('photo', {
        uri: photo.uri,
        type: photo.type,
        name: photo.fileName || 'photo.jpg',
      });

      // Upload to your server
      const response = await axios.post('YOUR_UPLOAD_URL', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload successful', response.data);
      // Handle successful upload (e.g., update user profile)
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Icon name="user-circle" size={100} />
      <View style={styles.styleButton}>
        <Button title="Upload New Picture" onPress={getProfilePic} />
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
