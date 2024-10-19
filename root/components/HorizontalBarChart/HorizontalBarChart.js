// import React from 'react';
import {useState} from 'react';
import {View} from 'react-native';
// import {BarChart, XAxis} from 'react-native-svg-charts';

// // const HorizontalBarChart = props => {
// //   console.log('from ddddd', props.data);
// //   const {needHorizontal} = props;
// //   const graphLabelMaker = {
// //     'Cardiovascular Disease Risk': 'Heart Disease Risk',
// //     'Diabetes and Metabolic Syndrome Risk': 'Diabetes',
// //     'Obesity Risk': 'Obesity Risk',
// //     'Stroke Risk': 'Stroke Risk',
// //     daily: 'daily',
// //   };

// //   const colorMapper = value => {
// //     if (value >= 8) {
// //       return '#ff0000';
// //     }
// //     if (value >= 4) {
// //       return '#FFFF29';
// //     }
// //     return '#007900';
// //   };

// //   if (needHorizontal) {
// //     var data = props.data.map(e => ({
// //       value: e.value,
// //       label: graphLabelMaker[e.label],
// //       color: colorMapper(e.value),
// //     }));
// //   } else {
// //     var data = props.data.map(e => ({
// //       value: e.value,
// //       label: e.label,
// //       color: colorMapper(e.value),
// //     }));
// //   }

// //   data = data.filter(e => e.label != 'daily');
// //   const barData = data.map(item => ({
// //     value: item.value,
// //     svg: {fill: item.color},
// //     label: item.label,
// //   }));
// //   console.log('bdata', barData);

// //   const Labels = ({x, y, bandwidth, data}) =>
// //     data.map((item, index) => (
// //       <Text
// //         style={{display: 'none'}}
// //         key={index}
// //         x={x(0) + 5}
// //         y={y(index) + bandwidth / 2}
// //         fontSize={14}
// //         fill={'white'}
// //         alignmentBaseline={'middle'}>
// //         {`${item.label}: ${item.value}`}
// //       </Text>
// //     ));

// //   const AxisLabels = ({data}) => (
// //     <View
// //       style={{
// //         position: 'absolute',
// //         left: 0,
// //         top: 0,
// //         bottom: 0,
// //         justifyContent: 'space-around',
// //       }}>
// //       {data.map((item, index) => (
// //         <Text
// //           key={index}
// //           style={{
// //             fontSize: 12,
// //             color: 'black',
// //             textAlign: 'right',
// //             marginRight: 5,
// //           }}>
// //           {item.label}
// //         </Text>
// //       ))}
// //     </View>
// //   );

// //   return (
// //     <View style={{flexDirection: 'row', height: 300, padding: 20}}>
// //       <View style={{width: 80, marginRight: 10}}>
// //         <AxisLabels data={barData} />
// //       </View>
// //       <View style={{flex: 1}}>
// //         <BarChart
// //           style={{flex: 1}}
// //           data={barData}
// //           horizontal={true}
// //           yAccessor={({item}) => item.value}
// //           contentInset={{top: 10, bottom: 10, left: 10, right: 10}}
// //           spacing={0.2}
// //           spacingInner={0.4}
// //           spacingOuter={0.4}
// //           gridMin={0}>
// //           {false && <Labels />}
// //         </BarChart>
// //       </View>
// //     </View>
// //   );
// // };

// const HorizontalBarChart = props => {
//   const data = [
//     {value: 0.7, label: 'Jan'},
//     {value: 0.2, label: 'Febb'},
//     // Add more data points as they become available
//   ];

//   // Function to determine bar color based on value
//   const fillColors = data.map(item => {
//     if (item.value <= 0.3) {
//       return 'green';
//     } else if (item.value > 0.3 && item.value < 0.8) {
//       return 'yellow';
//     } else {
//       return 'red';
//     }
//   });

//   // Prepare data for the BarChart
//   const barData = data.map((item, index) => ({
//     value: item.value,
//     svg: {
//       fill: fillColors[index],
//     },
//     label: item.label,
//   }));

//   // Calculate dynamic spacing based on the number of bars
//   const numberOfBars = data.length;

//   // Function to calculate spacing and contentInset dynamically
//   const calculateSpacing = numBars => {
//     if (numBars === 1) {
//       return {
//         spacingInner: 0,
//         spacingOuter: 0,
//         contentInset: {left: 0, right: 0, top: 10, bottom: 10},
//       };
//     } else if (numBars === 2) {
//       return {
//         spacingInner: 0.05,
//         spacingOuter: 0,
//         contentInset: {left: 30, right: 200, top: 10, bottom: 10},
//       };
//     } else {
//       return {
//         spacingInner: 0.1,
//         spacingOuter: 0.05,
//         contentInset: {left: 10, right: 10, top: 10, bottom: 10},
//       };
//     }
//   };

//   const {spacingInner, spacingOuter, contentInset} =
//     calculateSpacing(numberOfBars);

//   return (
//     <View style={{padding: 20}}>
//       {/* BarChart Component */}
//       <BarChart
//         style={{height: 200}}
//         data={barData}
//         yAccessor={({item}) => item.value}
//         xAccessor={({item, index}) => index}
//         spacingInner={spacingInner}
//         spacingOuter={spacingOuter}
//         contentInset={contentInset}
//         gridMin={0}
//         gridMax={1}
//         svg={{fill: 'blue'}}
//       />

//       {/* XAxis Component for labels */}
//       <XAxis
//         style={{marginTop: 10}}
//         data={barData}
//         xAccessor={({item, index}) => index}
//         formatLabel={(value, index) => data[index].label}
//         contentInset={{left: contentInset.left, right: contentInset.right}}
//         svg={{fontSize: 12, fill: 'black'}}
//       />
//     </View>
//   );
// };

// export default HorizontalBarChart;

import {BarChart} from 'react-native-gifted-charts';
const HorizontalBarChart = props => {
  let {barData} = props;
  const [data, setData] = useState(barData);
  const addFrontColorAndModifyLabel = objects => {
    return objects.map(obj => {
      const date = new Date(obj.label);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      obj.label = `${day}/${month}/${year}`;
      if (obj.value > 0 && obj.value <= 0.3) {
        obj.frontColor = 'green';
      } else if (obj.value > 0.3 && obj.value <= 0.8) {
        obj.frontColor = 'yellow';
      } else if (obj.value > 0.8) {
        obj.frontColor = 'red';
      }

      return obj;
    });
  };
  const barDataValue = addFrontColorAndModifyLabel(data);
  return (
    <View>
      <BarChart
        barWidth={22}
        noOfSections={1}
        barBorderRadius={4}
        frontColor="lightgray"
        data={barDataValue}
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
