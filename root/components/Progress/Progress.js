import React, {useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
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
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Select the risk to view resources</Text>
      <Picker
        selectedValue={selectedValue}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}>
        {disease.map((value, index) => (
          <Picker.Item label={value} value={value} key={index} />
        ))}
      </Picker>
      <View>
        <View style={styles.yetToWatch}>
          <Text>Yet to watch</Text>
          {yetToWatch.map((value, index) => (
            <View key={index} style={styles.eachYetToWatch}>
              <Text>{yetToWatch[index][0]}</Text>
              <Text>{yetToWatch[index][1]}</Text>
            </View>
          ))}
        </View>
        <View style={styles.yetToWatch}>
          <Text>Completed</Text>
          {completed.map((value, index) => (
            <View style={styles.eachYetToWatch} key={index}>
              <Text>{completed[index][0]}</Text>
              <Text>{completed[index][1]}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  picker: {
    width: 300,
    height: 50,
    backgroundColor: '#FFF',
    borderColor: 'black',
    borderWidth: 1,
  },
  yetToWatch: {
    borderWidth: 2,
    borderColor: 'red',
    padding: 30,
  },
  eachYetToWatch: {
    padding: 3,
    margin: 8,
  },
});

export default Progress;
