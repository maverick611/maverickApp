import React, {useEffect, useState} from 'react';
import {Button, Text, View, StyleSheet} from 'react-native';
import DailyQuestionsResponse from '../DailyQuestionsResponse/DailyQuestionsResponse.js';
import {useNavigation} from '@react-navigation/native';
import Header from '../Header/Header.js';
import {ScrollView} from 'react-native-gesture-handler';
const Daily = props => {
  const {loginToken} = props;
  const formatReport = isoString => {
    const date = new Date(isoString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return [`Report on ${day}/${month}/${year}`, `at ${hours}:${minutes}`];
  };

  const [newSub, setNewSub] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchPreviousDailyQuestionnare = async () => {
      const response = await fetch('http://10.0.2.2:3000/daily_reports', {
        method: 'GET',
        headers: {
          authorization: `Bearer ${loginToken}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setHistory(data);
    };
    fetchPreviousDailyQuestionnare();
  }, [newSub]);

  const navigation = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <Header />
      <View style={{padding: 20}}>
        <Button
          onPress={() =>
            navigation.navigate('dq', {
              setNewSub: setNewSub,
            })
          }
          title="Take today's questionnaire"
        />
      </View>

      <View style={styles.viewHistory}>
        <ScrollView>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 22}}>View history</Text>
          </View>
          <View>
            {history.length > 0 &&
              history.map((value, index) => {
                return (
                  <View style={styles.eachHistoryHolder} key={index}>
                    <View>
                      <Text>{formatReport(value.timestamp)[0]}</Text>
                      <Text>{formatReport(value.timestamp)[1]}</Text>
                    </View>
                    <Button
                      title="See Response"
                      onPress={() =>
                        navigation.navigate('LongQuestionnaireResponses', {
                          submission_id: value.submission_id,
                          loginToken: loginToken,
                        })
                      }
                    />
                  </View>
                );
              })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Daily;

const styles = StyleSheet.create({
  viewHistory: {
    margin: 10,
    backgroundColor: 'rgb(226	242	215	)',
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    maxHeight: '80%',
  },
  mainContainer: {
    backgroundColor: 'rgb(226	244	254	)',
    height: '100%',
  },
  eachHistoryHolder: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
  },
});
