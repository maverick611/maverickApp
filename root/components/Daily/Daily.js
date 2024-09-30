import React from 'react';
import {Button, Text, View} from 'react-native';
import DailyQuestionsResponse from '../DailyQuestionsResponse/DailyQuestionsResponse.js';
const Daily = () => {
  const history = [
    [['Response on 09/27/2024'], ['at 2:30PM']],
    [['Response on 07/25/2024'], ['at 2:30PM']],
    [['Response on 07/25/2024'], ['at 2:30PM']],
    [['Response on 07/25/2024'], ['at 2:30PM']],
  ];
  return (
    <View>
      <DailyQuestionsResponse />
      <Text>Take today's questionnaire</Text>
      <Text>
        We've got your response for today...Retake Questionnaire tomorrow!
      </Text>
      <View>
        <Text>View history</Text>
        <View>
          {history.map((value, index) => {
            return (
              <View style={{borderWidth: 2}} key={index}>
                <View>
                  <Text>{history[index][0]}</Text>
                  <Text>{history[index][1]}</Text>
                </View>
                <Button title="See Response" />
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default Daily;
