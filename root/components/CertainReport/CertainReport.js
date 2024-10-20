// import React from 'react';
// import {View} from 'react-native';
// const data = [
//   {label: 'Cardiovascular Disease Risk', value: 1},
//   {label: 'Diabetes and Metabolic Syndrome Risk', value: 1},
//   {label: 'Obesity Risk', value: 0},
//   {label: 'Stroke Risk', value: 1},
//   {label: 'daily', value: 1},
// ];

// const HorizontalBarChart = barData => {
//   barData = [
//     {label: 'Cardiovascular Disease Risk', value: 0.8},
//     {label: 'Diabetes and Metabolic Syndrome Risk', value: 1},
//     {label: 'Obesity Risk', value: 0.3},
//     {label: 'Cancer Risk', value: 1},
//     {label: 'Blood Clots Risk', value: 1},
//     {label: 'Musculoskeletal Disorders Risk', value: 1},
//     {label: 'Gastrointestinal Risk', value: 1},
//     {label: 'Mental Health Risk', value: 1},
//     {label: 'Stroke Risk', value: 1},
//     {label: 'Osteoporosis Risk', value: 1},
//     {label: 'daily', value: 1},
//   ];
//   const getColor = a => {
//     if (a >= 0 && a <= 0.3) {
//       return 'green';
//     } else if (a > 0.3 && a <= 0.8) {
//       return 'yellow';
//     } else if (a > 0.8) {
//       return 'red';
//     }
//   };

//   barData = barData.map(e => ({...e, frontColor: getColor(e.value)}));
//   return (
//     <View style={styles.barChartContainer}>
//       <BarChart
//         barWidth={28}
//         noOfSections={1}
//         horizontal={true}
//         shiftX={-80}
//         rtl
//         frontColor="lightgray"
//         data={barData}
//         yAxisThickness={0}
//         xAxisThickness={0}
//         showYAxisIndices={false}
//         hideYAxisText={true}
//         hideRules={true}
//         spacing={15}
//         xAxisLabelTextStyle={{fontSize: 12}}
//         yAxisLabelWidth={180}
//         renderYAxisLabel={label => (
//           <View style={{paddingLeft: 200}}>
//             <Text style={{fontSize: 12}}>{label}</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// };
// const CertainReport = () => {
//   return <View>{HorizontalBarChart('aa')}</View>;
// };

// export default CertainReport;

import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

// The getColor function as provided
const getColor = a => {
  if (a >= 0 && a <= 0.3) {
    return 'green';
  } else if (a > 0.3 && a <= 0.8) {
    return 'yellow';
  } else if (a > 0.8) {
    return 'red';
  }
};

// Sample data with labels and values ranging from 0 to 1

const CertainReport = ({route}) => {
  const {loginToken, submission_id} = route.params;
  var [data, setData] = useState([]);
  const fetchCertainReport = async () => {
    const response = await fetch('http://10.0.2.2:3000/submission_report', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${loginToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({submission_id: submission_id}),
    });
    const data = await response.json();
    console.log('dataaa', data);
    setData(data);
  };

  useEffect(() => {
    fetchCertainReport();
  }, []);
  data = data.map(e => ({label: e.disease_name, value: e.risk_score}));
  console.log('submission_id', submission_id);
  return (
    <ScrollView style={styles.container}>
      {data.map((item, index) => {
        const barWidth = item.value * 100;
        return (
          <View key={index} style={styles.barContainer}>
            <Text style={styles.label}>{item.label}</Text>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.bar,
                  {
                    width: `${barWidth}%`,
                    backgroundColor: getColor(item.value),
                  },
                ]}
              />
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default CertainReport;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    flex: 1,
    marginRight: 8,
    fontSize: 14,
  },
  barBackground: {
    flex: 3,
    height: 20,
    // backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
  },
});
