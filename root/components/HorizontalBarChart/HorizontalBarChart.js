// import React from 'react';
import {View} from 'react-native';

import {BarChart} from 'react-native-gifted-charts';
const HorizontalBarChart = props => {
  var {barData} = props;
  console.log('barDaraaaa', barData);

  const getColor = a => {
    if (a >= 0 && a <= 0.3) {
      return 'green';
    } else if (a > 0.3 && a <= 0.8) {
      return 'yellow';
    } else if (a > 0.8) {
      return 'red';
    }
  };

  const changeLabel = lab => {
    const date = new Date(lab);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  barData = barData.map(e => ({...e, frontColor: getColor(e.value)}));
  barData = barData.map(e => ({...e, label: changeLabel(e.label)}));

  return (
    <View>
      <BarChart
        barWidth={22}
        noOfSections={1}
        barBorderRadius={4}
        frontColor="lightgray"
        data={barData}
        yAxisThickness={0}
        xAxisThickness={0}
        showYAxisIndices={false}
        hideYAxisText={true}
        hideRules={true}
        spacing={35}
        rotateXAxisTexts={200}
      />
    </View>
  );
};

export default HorizontalBarChart;
