import React, {useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import Header from '../Header/Header';

const Progress = () => {
  const [selectedValue, setSelectedValue] = useState('osteoporosis');
  const disease = [
    'osteoporosis',
    'Heart Disease',
    'Cancer',
    'Diabetes',
    'Stroke',
    'Obesity',
    'Blood Clots',
    'Dementia',
    'Arthritis and joint pain',
    'Digestion',
  ];

  const yetToWatch = [
    ['Physicians suggestions', 'Dur: 8:10 min'],
    ['Risk factors', 'Dur: 6:30 min'],
    ['Physical workout', 'Dur: 5:10 min'],
  ];

  const completed = [
    ['Introduction', 'Dur: 10:30 min'],
    ['What is the risk', 'Dur: 5:50 min'],
    ['Signs for disease', 'Dur: 7:30 min'],
    ['Signs for disease', 'Dur: 7:30 min'],
  ];

  return (
    <>
      <Header />
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          backgroundColor: 'rgb(226	244	254	)',
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text style={{fontSize: 20}}>Select the risk to view resources</Text>
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedValue}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedValue(itemValue)
            }>
            {disease.map((value, index) => (
              <Picker.Item label={value} value={value} key={index} />
            ))}
          </Picker>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.yetToWatch}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Text>Yet to watch</Text>
            </View>
            <View
              style={{
                borderRadius: 1,
                borderRightWidth: 0,
                borderLeftWidth: 0,
                borderColor: 'black',
              }}>
              {yetToWatch.map((value, index) => (
                <View key={index} style={styles.eachYetToWatch}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                    }}>
                    <View style={{marginRight: 10}}>
                      <Icon name="target" size={20} color="red" />
                    </View>
                    <View>
                      <Text>{yetToWatch[index][0]}</Text>
                      <Text>{yetToWatch[index][1]}</Text>
                    </View>
                  </View>
                  <Icon name="external-link" size={20} color="black" />
                </View>
              ))}
            </View>
          </View>
          <View style={styles.yetToWatch}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Text>Completed</Text>
            </View>
            <View
              style={{
                borderRadius: 1,
                borderRightWidth: 0,
                borderLeftWidth: 0,
                borderColor: 'black',
              }}>
              {completed.map((value, index) => (
                <View key={index} style={styles.eachYetToWatch}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                    }}>
                    <View style={{marginRight: 10}}>
                      <IoniconsIcon
                        name="checkmark-circle-outline"
                        size={20}
                        color="red"
                      />
                    </View>
                    <View>
                      <Text>{completed[index][0]}</Text>
                      <Text>{completed[index][1]}</Text>
                    </View>
                  </View>
                  <Icon name="external-link" size={20} color="black" />
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
    margin: 25,
    width: '80%',
    borderRadius: 10,
  },
  // picker: {
  //   width: 200,
  //   height: 45,
  //   backgroundColor: '#FFF',
  //   borderColor: 'black',
  //   borderWidth: 1,
  // },
  // pickerContainer: {
  //   borderWidth: 1,
  //   // borderColor: '#007AFF',
  //   borderRadius: 8,
  //   overflow: 'hidden',
  // },
  pickerContainer: {
    borderWidth: 1,
    // margin: 'auto',
    // borderColor: '#007AFF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    width: 200,
    height: 45,
    backgroundColor: '#FFF',
    // paddingBottom: 15,
    // color: '#333',
  },
  yetToWatch: {
    padding: 30,
  },
  eachYetToWatch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 3,
    margin: 8,
  },
});

export default Progress;
