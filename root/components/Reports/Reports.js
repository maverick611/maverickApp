import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, Text, View, Dimensions} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Header from '../Header/Header';
import {ScrollView} from 'react-native-gesture-handler';
import HorizontalBarChart from '../HorizontalBarChart/HorizontalBarChart';
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
  const [selectedValue, setSelectedValue] = useState('osteoporosis');
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

  // console.log(
  //   'finalData',
  //   JSON.stringify(
  //     setBarChartDataFromReports([
  //       {
  //         submission_id: '34fa64dc-3a28-42ba-9b47-b21ad30899bf',
  //         timestamp: '2024-10-14T03:36:13.904Z',
  //         risk_assessments: [
  //           {
  //             disease_id: '1',
  //             disease_name: 'Cardiovascular Disease Risk',
  //             risk_score: 1,
  //           },
  //           {
  //             disease_id: '2',
  //             disease_name: 'Diabetes and Metabolic Syndrome Risk',
  //             risk_score: 1,
  //           },
  //           {
  //             disease_id: '9',
  //             disease_name: 'Stroke Risk',
  //             risk_score: 0,
  //           },
  //         ],
  //       },
  //       {
  //         submission_id: 'd0db1eca-6c5d-413b-b63d-0a45ead448df',
  //         timestamp: '2024-10-14T03:20:23.953Z',
  //         risk_assessments: [],
  //       },
  //       {
  //         submission_id: 'd2618715-7744-4ab2-a65d-9b49cdadfc35',
  //         timestamp: '2024-10-14T02:20:33.327Z',
  //         risk_assessments: [],
  //       },
  //       {
  //         submission_id: '14d6e534-2903-4205-86db-bd9f163a45cf',
  //         timestamp: '2024-10-14T02:20:21.485Z',
  //         risk_assessments: [],
  //       },
  //       {
  //         submission_id: 'a84fc9ee-17bf-4268-817d-9f8865397934',
  //         timestamp: '2024-10-14T02:18:39.458Z',
  //         risk_assessments: [],
  //       },
  //       {
  //         submission_id: '63d60bc1-8104-4431-8289-32743ff0cd4d',
  //         timestamp: '2024-10-14T02:18:33.588Z',
  //         risk_assessments: [],
  //       },
  //       {
  //         submission_id: '377ad7f3-9430-4721-98b6-5fe6747d9b74',
  //         timestamp: '2024-10-14T02:18:28.001Z',
  //         risk_assessments: [],
  //       },
  //       {
  //         submission_id: '89036f60-e1aa-4b0a-b337-43a771c7dde7',
  //         timestamp: '2024-10-14T02:18:21.041Z',
  //         risk_assessments: [],
  //       },
  //       {
  //         submission_id: 'df5deea3-1a8e-4d0c-b217-9f913ace26b4',
  //         timestamp: '2024-10-13T21:20:37.224Z',
  //         risk_assessments: [
  //           {
  //             disease_id: '1',
  //             disease_name: 'Cardiovascular Disease Risk',
  //             risk_score: 1,
  //           },
  //           {
  //             disease_id: '2',
  //             disease_name: 'Diabetes and Metabolic Syndrome Risk',
  //             risk_score: 1,
  //           },
  //           {
  //             disease_id: '9',
  //             disease_name: 'Stroke Risk',
  //             risk_score: 1,
  //           },
  //         ],
  //       },
  //       {
  //         submission_id: '0bd7393f-5aeb-4536-a590-a7d05e92b64d',
  //         timestamp: '2024-10-13T21:20:14.686Z',
  //         risk_assessments: [
  //           {
  //             disease_id: '1',
  //             disease_name: 'Cardiovascular Disease Risk',
  //             risk_score: 1,
  //           },
  //           {
  //             disease_id: '2',
  //             disease_name: 'Diabetes and Metabolic Syndrome Risk',
  //             risk_score: 1,
  //           },
  //           {
  //             disease_id: '9',
  //             disease_name: 'Stroke Risk',
  //             risk_score: 0,
  //           },
  //         ],
  //       },
  //     ]),
  //   ),
  // );

  const fetchGetSubmission = async () => {
    const response = await fetch('http://10.0.2.2:3000/reports', {
      method: 'GET',
      headers: {
        authorization: `Bearer ${loginToken}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();

    setAllReports(data);
    setBarChartDataFromReports(data);
  };
  useEffect(() => {
    fetchGetSubmission();
  }, []);

  useEffect(() => {
    fetchGetSubmission();
  }, [newSubmissionAddedlq]);

  return (
    <View style={{height: '100%'}}>
      <ScrollView>
        <Header />
        <View style={styles.ViewHistory}>
          <ScrollView>
            <View style={styles.ViewHistoryText}>
              <Text>VIEW HISTORY</Text>
            </View>
            {allReports.map((report, index) => {
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

        {barChartData.length > 0 ? (
          Object.keys(barChartData[0]).includes(selectedValue) ? (
            <HorizontalBarChart barData={barChartData[0][selectedValue]} />
          ) : (
            <Text>Some issue occured</Text>
          )
        ) : (
          <Text>Excited to see ? Make your First submission</Text>
        )}
      </ScrollView>
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
