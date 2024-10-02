import React, {useState} from 'react';
import {Button, StyleSheet, Text, View, Dimensions} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {BarChart} from 'react-native-chart-kit';
import Header from '../Header/Header';
const Reports = () => {
  const responseDates = [
    ['Report on 09/27/2024', 'at 2:30PM'],
    ['Report on 05/25/2024', 'at 2:30PM'],
    ['Report on 03/25/2024', 'at 2:30PM'],
    // ['Report on 01/25/2024', 'at 2:30PM'],
    // ['Report on 11/25/2023', 'at 2:30PM'],
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

  const data = {
    labels: [
      '09/27',
      '09/27',
      '09/27',
      '09/27',
      '09/27',
      '09/27',
      '09/27',
      '09/27',
      '09/27',
      '09/27',
    ],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 22, 19],
        colors: [
          (opacity = 1) => `#BE95FF`,
          (opacity = 1) => `#BE95FF`,
          (opacity = 1) => `#78A9FF`,
          (opacity = 1) => `#00FF00`,
          (opacity = 1) => `#AA1111`,
          (opacity = 1) => `#AA1111`,
          (opacity = 1) => `#00AA00`,
          (opacity = 1) => `#00BB00`,
        ],
      },
    ],
  };
  return (
    <View>
      <Header />
      <View
        style={{
          borderWidth: 2,
          padding: 10,
          margin: 5,
          backgroundColor: '#E2F2D7',
          borderRadius: 6,
          margin: 10,
        }}>
        <Text>VIEW HISTORY</Text>
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
                  <Button title="View Response" />
                </View>
                <View style={{margin: 1}}>
                  <Button title="View Report" />
                </View>
              </View>
            </View>
          );
        })}
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
          <View>
            <BarChart
              data={data}
              width={Dimensions.get('window').width - 16}
              height={220}
              withCustomBarColorFromData={true}
              flatColor={true}
              chartConfig={{
                withCustomBarColorFromData: true,
                flatColor: true,
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  picker: {
    width: 200,
    height: 30,
    backgroundColor: '#FFF',
    borderColor: 'black',
    borderWidth: 1,
  },
});

export default Reports;
