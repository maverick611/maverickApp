import React, {useState} from 'react';
import {Button, StyleSheet, Text, View, Dimensions} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Header from '../Header/Header';
import {ScrollView} from 'react-native-gesture-handler';
import {BarChart, Grid} from 'react-native-svg-charts';
const barData = [
  {quarter: 1, earnings: 13000},
  {quarter: 2, earnings: 16500},
  {quarter: 3, earnings: 14250},
  {quarter: 4, earnings: 19000},
];

const Reports = props => {
  const {navigation} = props;
  const responseDates = [
    ['Report on 09/27/2024', 'at 2:30PM'],
    ['Report on 05/25/2024', 'at 2:30PM'],
    ['Report on 03/25/2024', 'at 2:30PM'],
    ['Report on 01/25/2024', 'at 2:30PM'],
    ['Report on 11/25/2023', 'at 2:30PM'],
  ];
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
  const [selectedValue, setSelectedValue] = useState('osteoporosis');

  const fill = 'rgb(134, 65, 244)';
  const data = [50, 10, 40, 95, null, 85, 0, 35, 53, 24, 50];
  return (
    <View>
      <Header />
      <View style={styles.ViewHistory}>
        <ScrollView>
          <View style={styles.ViewHistoryText}>
            <Text>VIEW HISTORY</Text>
          </View>
          {responseDates.map((date, index) => {
            return (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  borderWidth: 2,
                  justifyContent: 'space-around',
                  margin: 10,
                  paddingBottom: 2,
                  borderTopWidth: 0,
                  borderRightWidth: 0,
                  borderLeftWidth: 0,
                }}
                key={index}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}>
                  <Text>{responseDates[index][0]}</Text>
                  <Text>{responseDates[index][1]}</Text>
                </View>
                <View style={{padding: 1}}>
                  <View style={{margin: 1}}>
                    <Button
                      onPress={() =>
                        navigation.navigate('LongQuestionnaireResponses')
                      }
                      title="View Response"
                    />
                  </View>
                  <View style={{margin: 1}}>
                    <Button
                      onPress={() => navigation.navigate('CertainReport')}
                      title="View Report"
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <View
        style={{
          margin: 7,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: 10,
            }}>
            <Text style={{fontSize: 20}}>Select to view progress</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
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
          </View>
          <View></View>
        </View>
      </View>
      <BarChart
        style={{height: 200}}
        data={data}
        svg={{fill}}
        contentInset={{top: 30, bottom: 30}}>
        <Grid />
      </BarChart>
    </View>
  );
};

const styles = StyleSheet.create({
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
  ViewHistory: {
    borderWidth: 2,
    padding: 10,
    margin: 5,
    backgroundColor: '#E2F2D7',
    borderRadius: 6,
    margin: 10,
    maxHeight: '48%',
  },
  ViewHistoryText: {
    margin: 'auto',
  },
});

export default Reports;
