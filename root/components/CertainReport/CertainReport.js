import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import {BarChart} from 'react-native-svg-charts';

const HorizontalBarChart = () => {
  const data = [
    {value: 50, label: 'Apple', color: '#ff6b6b'},
    {value: 80, label: 'Banana', color: '#feca57'},
    {value: 30, label: 'Cherry', color: '#ff9ff3'},
    {value: 70, label: 'Date', color: '#54a0ff'},
    {value: 40, label: 'Elderberry', color: '#5f27cd'},
  ];

  const barData = data.map(item => ({
    value: item.value,
    svg: {fill: item.color},
    label: item.label,
  }));

  const Labels = ({x, y, bandwidth, data}) =>
    data.map((item, index) => (
      <Text
        style={{display: 'none'}}
        key={index}
        x={x(0) + 5}
        y={y(index) + bandwidth / 2}
        fontSize={14}
        fill={'white'}
        alignmentBaseline={'middle'}>
        {`${item.label}: ${item.value}`}
      </Text>
    ));

  const AxisLabels = ({data}) => (
    <View
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'space-around',
      }}>
      {data.map((item, index) => (
        <Text
          key={index}
          style={{
            fontSize: 12,
            color: 'black',
            textAlign: 'right',
            marginRight: 5,
          }}>
          {item.label}
        </Text>
      ))}
    </View>
  );

  return (
    <View style={{flexDirection: 'row', height: 300, padding: 20}}>
      <View style={{width: 80, marginRight: 10}}>
        <AxisLabels data={barData} />
      </View>
      <View style={{flex: 1}}>
        <BarChart
          style={{flex: 1}}
          data={barData}
          horizontal={true}
          yAccessor={({item}) => item.value}
          contentInset={{top: 10, bottom: 10, left: 10, right: 10}}
          spacing={0.2}
          gridMin={0}>
          {false && <Labels />}
        </BarChart>
      </View>
    </View>
  );
};

export default HorizontalBarChart;
