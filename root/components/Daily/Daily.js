import React from 'react';
import {Button, Text, View, StyleSheet} from 'react-native';
import DailyQuestionsResponse from '../DailyQuestionsResponse/DailyQuestionsResponse.js';
import {useNavigation} from '@react-navigation/native';
import Header from '../Header/Header.js';
import {ScrollView} from 'react-native-gesture-handler';
const Daily = () => {
  const history = [
    [['Response on 09/27/2024'], ['at 2:30PM']],
    [['Response on 07/25/2024'], ['at 2:30PM']],
    [['Response on 07/25/2024'], ['at 2:30PM']],
    [['Response on 07/25/2024'], ['at 2:30PM']],
    [['Response on 07/25/2024'], ['at 2:30PM']],
    [['Response on 07/25/2024'], ['at 2:30PM']],
    [['Response on 07/25/2024'], ['at 2:30PM']],
    [['Response on 07/25/2024'], ['at 2:30PM']],
    [['Response on 07/25/2024'], ['at 2:30PM']],
    [['Response on 07/25/2024'], ['at 2:30PM']],
    [['Response on 07/25/2024'], ['at 2:30PM']],
    [['Response on 07/25/2024'], ['at 2:30PM']],
    [['Response on 07/25/2024'], ['at 2:30PM']],
  ];
  const navigation = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <Header />
      {/* <DailyQuestionsResponse /> */}
      <View style={{padding: 20}}>
        <Button
          onPress={() => navigation.navigate('dq')}
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
            {history.map((value, index) => {
              return (
                <View style={styles.eachHistoryHolder} key={index}>
                  <View>
                    <Text>{history[index][0]}</Text>
                    <Text>{history[index][1]}</Text>
                  </View>
                  <Button
                    title="See Response"
                    onPress={() =>
                      navigation.navigate('DailyQuestionsResponse')
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
