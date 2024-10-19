import React from 'react';
import {View} from 'react-native';
import {BarChart, XAxis} from 'react-native-svg-charts';

// const HorizontalBarChart = props => {
//   console.log('from ddddd', props.data);
//   const {needHorizontal} = props;
//   const graphLabelMaker = {
//     'Cardiovascular Disease Risk': 'Heart Disease Risk',
//     'Diabetes and Metabolic Syndrome Risk': 'Diabetes',
//     'Obesity Risk': 'Obesity Risk',
//     'Stroke Risk': 'Stroke Risk',
//     daily: 'daily',
//   };

//   const colorMapper = value => {
//     if (value >= 8) {
//       return '#ff0000';
//     }
//     if (value >= 4) {
//       return '#FFFF29';
//     }
//     return '#007900';
//   };

//   if (needHorizontal) {
//     var data = props.data.map(e => ({
//       value: e.value,
//       label: graphLabelMaker[e.label],
//       color: colorMapper(e.value),
//     }));
//   } else {
//     var data = props.data.map(e => ({
//       value: e.value,
//       label: e.label,
//       color: colorMapper(e.value),
//     }));
//   }

//   data = data.filter(e => e.label != 'daily');
//   const barData = data.map(item => ({
//     value: item.value,
//     svg: {fill: item.color},
//     label: item.label,
//   }));
//   console.log('bdata', barData);

//   const Labels = ({x, y, bandwidth, data}) =>
//     data.map((item, index) => (
//       <Text
//         style={{display: 'none'}}
//         key={index}
//         x={x(0) + 5}
//         y={y(index) + bandwidth / 2}
//         fontSize={14}
//         fill={'white'}
//         alignmentBaseline={'middle'}>
//         {`${item.label}: ${item.value}`}
//       </Text>
//     ));

//   const AxisLabels = ({data}) => (
//     <View
//       style={{
//         position: 'absolute',
//         left: 0,
//         top: 0,
//         bottom: 0,
//         justifyContent: 'space-around',
//       }}>
//       {data.map((item, index) => (
//         <Text
//           key={index}
//           style={{
//             fontSize: 12,
//             color: 'black',
//             textAlign: 'right',
//             marginRight: 5,
//           }}>
//           {item.label}
//         </Text>
//       ))}
//     </View>
//   );

//   return (
//     <View style={{flexDirection: 'row', height: 300, padding: 20}}>
//       <View style={{width: 80, marginRight: 10}}>
//         <AxisLabels data={barData} />
//       </View>
//       <View style={{flex: 1}}>
//         <BarChart
//           style={{flex: 1}}
//           data={barData}
//           horizontal={true}
//           yAccessor={({item}) => item.value}
//           contentInset={{top: 10, bottom: 10, left: 10, right: 10}}
//           spacing={0.2}
//           spacingInner={0.4}
//           spacingOuter={0.4}
//           gridMin={0}>
//           {false && <Labels />}
//         </BarChart>
//       </View>
//     </View>
//   );
// };

const HorizontalBarChart = props => {
  const data = [
    {value: 0.2, label: 'Jan'},
    {value: 0.5, label: 'Feb'},
    {value: 0.9, label: 'Mar'},
    {value: 0.1, label: 'Apr'},
    {value: 0.7, label: 'May'},
  ];

  // Function to determine bar color based on value
  const fillColors = data.map(item => {
    if (item.value <= 0.3) {
      return 'green';
    } else if (item.value > 0.3 && item.value < 0.8) {
      return 'yellow';
    } else {
      return 'red';
    }
  });

  // Prepare data for the BarChart
  const barData = data.map((item, index) => ({
    value: item.value,
    svg: {
      fill: fillColors[index],
    },
  }));

  return (
    <View style={{padding: 20}}>
      <BarChart
        style={{height: 200}}
        data={barData}
        yAccessor={({item}) => item.value}
        spacingInner={0.2}
        contentInset={{top: 10, bottom: 10}}
        gridMin={0}
        gridMax={1}
      />
      <XAxis
        style={{marginTop: 10}}
        data={data}
        formatLabel={(value, index) => data[index].label}
        contentInset={{left: 30, right: 30}}
        svg={{fontSize: 12, fill: 'black'}}
      />
    </View>
  );
};

export default HorizontalBarChart;
