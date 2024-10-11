import React from 'react';
import {Button, View, Text} from 'react-native';
const barData = [
  {value: 25, label: 'Heart', frontColor: 'green'},
  {value: 50, label: 'Diabetics', frontColor: 'red'},
  {value: 74, label: 'Obesity', frontColor: 'red'},
  {value: 32, label: 'Cancer', frontColor: 'yellow'},
  {value: 60, label: 'Dementia', frontColor: 'red'},
  {value: 25, label: 'Stroke', frontColor: 'green'},
  {value: 30, label: 'Arthritis', frontColor: 'yellow'},
];

const CertainReport = () => {
  return (
    <View>
      <View style={{margin: 15}}></View>
      <View>
        <Text>Things Worked Out</Text>
        <Text>1. you're glucose levels are in control.</Text>
        <Text>2. good, continue to maintain breathing exercise</Text>
      </View>
      <View>
        <Text>Things to be done</Text>
        <Text>1. drink 8 glasses of water everyday to stay healthy.</Text>
        <Text>2. walking 2 miles extra might keep you more healthy</Text>
      </View>
      <View>
        <Button title="Retake Questionare" />
        <Text>Retake Questionnaire in 6weeks i.e on 11/07</Text>
      </View>
    </View>
  );
};

export default CertainReport;
