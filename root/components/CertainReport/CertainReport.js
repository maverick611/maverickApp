import React from 'react';
import HorizontalBarChart from '../HorizontalBarChart/HorizontalBarChart';
import {View} from 'react-native';
const data = [
  {label: 'Cardiovascular Disease Risk', value: 1},
  {label: 'Diabetes and Metabolic Syndrome Risk', value: 1},
  {label: 'Obesity Risk', value: 0},
  {label: 'Stroke Risk', value: 1},
  {label: 'daily', value: 1},
];
const CertainReport = () => {
  return (
    <View>
      <HorizontalBarChart data={data} needHorizontal={true} />
    </View>
  );
};

export default CertainReport;
