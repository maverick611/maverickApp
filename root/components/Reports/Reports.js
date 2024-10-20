import React, {useEffect, useState} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Header from '../Header/Header';
import {BarChart} from 'react-native-gifted-charts';
const HorizontalBarChart = barData => {
  console.log('input to bars', barData);

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
    <View style={styles.barChartContainer}>
      <BarChart
        barWidth={28}
        noOfSections={1}
        // barBorderRadius={4}
        frontColor="lightgray"
        data={barData}
        yAxisThickness={0}
        xAxisThickness={0}
        showYAxisIndices={false}
        hideYAxisText={true}
        hideRules={true}
        spacing={28}
        xAxisLabelTextStyle={{fontSize: 12}}
      />
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 10,
        }}>
        <Text>Last {barData.length * 6}W Analysis</Text>
      </View>
    </View>
  );
};

const Reports = props => {
  const formatReport = isoString => {
    const date = new Date(isoString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return [`Report on ${day}/${month}/${year}`, `at ${hours}:${minutes}`];
  };
  const {navigation, loginToken, newSubmissionAddedlq} = props;
  const [allReports, setAllReports] = useState([]);
  const disease = [
    'Blood Clots Risk',
    'Cancer Risk',
    'Cardiovascular Disease Risk',
    'Diabetes and Metabolic Syndrome Risk',
    'Gastrointestinal Risk',
    'Mental Health Risk',
    'Musculoskeletal Disorders Risk',
    'Obesity Risk',
    'Osteoporosis Risk',
    'Stroke Risk',
  ];
  const [selectedValue, setSelectedValue] = useState('Osteoporosis Risk');
  const [barChartData, setBarChartData] = useState([]);

  const setBarChartDataFromReports = reports => {
    let barData = [];
    const diseaseRiskDictionary = {};

    reports.forEach(report => {
      const timestamp = report.timestamp;

      if (report.risk_assessments && Array.isArray(report.risk_assessments)) {
        report.risk_assessments.forEach(assessment => {
          if (assessment.disease_name) {
            if (!diseaseRiskDictionary[assessment.disease_name]) {
              diseaseRiskDictionary[assessment.disease_name] = [];
            }
            diseaseRiskDictionary[assessment.disease_name].push({
              label: timestamp.split('T')[0],
              value: assessment.risk_score,
            });
          }
        });
      }
    });

    // return diseaseRiskDictionary;
    barData.push(diseaseRiskDictionary);
    setBarChartData(barData);
  };

  const fetchGetSubmission = async () => {
    const response = await fetch('http://10.0.2.2:3000/reports', {
      method: 'GET',
      headers: {
        authorization: `Bearer ${loginToken}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log('reports api', JSON.stringify(data));

    setAllReports(data);
    setBarChartDataFromReports(data);
  };
  useEffect(() => {
    console.log('in effect1');
    fetchGetSubmission();
  }, []);

  useEffect(() => {
    console.log('in effect2');

    fetchGetSubmission();
  }, [newSubmissionAddedlq]);

  const renderReportItem = ({item: report, index}) => (
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
        <Text>{formatReport(report.timestamp)[0]}</Text>
        <Text>{formatReport(report.timestamp)[1]}</Text>
      </View>
      <View style={{padding: 1}}>
        <View style={{margin: 1}}>
          <Button
            onPress={() =>
              navigation.navigate('LongQuestionnaireResponses', {
                submission_id: report.submission_id,
                loginToken: loginToken,
              })
            }
            title="View Response"
          />
        </View>
        <View style={{margin: 1}}>
          <Button
            onPress={() =>
              navigation.navigate('CertainReport', {
                submission_id: report.submission_id,
                loginToken: loginToken,
              })
            }
            title="View Report"
          />
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView>
      <Header />

      <View style={styles.ViewHistory}>
        <View style={styles.ViewHistoryText}>
          <Text>VIEW HISTORY</Text>
        </View>
        <View style={{height: 300}}>
          <FlatList
            data={allReports}
            renderItem={renderReportItem}
            keyExtractor={(item, index) => index.toString()}
            nestedScrollEnabled={true}
          />
        </View>
      </View>

      <View
        style={{
          margin: 7,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
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

        <ScrollView horizontal={true}>
          {barChartData.length > 0 ? (
            Object.keys(barChartData[0]).includes(selectedValue) ? (
              <View style={{width: '98%'}}>
                {HorizontalBarChart(barChartData[0][selectedValue])}
              </View>
            ) : (
              <Text>Some issue occured</Text>
            )
          ) : (
            <Text>Excited to see ? Make your First submission</Text>
          )}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  barChartContainer: {
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'rgb(226,242,215)',
    // padding: 10,
  },
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
