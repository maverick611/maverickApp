import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const renderQuestion = (question, index, selectedValue, setSelectedValue) => {
  if (question.type === 'dropdown') {
    return (
      <View key={index} style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.question}</Text>
        <Picker
          selectedValue={selectedValue}
          style={styles.picker}
          onValueChange={itemValue => setSelectedValue(itemValue)}>
          {question.options.map((option, i) => (
            <Picker.Item key={i} label={option} value={option} />
          ))}
        </Picker>
      </View>
    );
  } else if (question.type === 'single') {
    return (
      <View key={index} style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.question}</Text>
        {question.options.map((option, i) => (
          <Text key={i} style={styles.optionText}>
            {option}
          </Text>
        ))}
      </View>
    );
  }
};

const DailyQuestionsResponse = () => {
  const [selectedValue, setSelectedValue] = useState('4-5'); // For dropdown picker state

  const questions = [
    {
      question: 'Have you taken 3L of water today?',
      options: ['yes', 'no'],
      type: 'single',
      answer: 'yes',
    },
    {
      question: 'Did you consume any fruits or vegetables today?',
      options: ['yes', 'no'],
      type: 'single',
      answer: 'no',
    },
    {
      question: 'How long do you sit (hrs)',
      options: ['<1', '1-2', '2-3', '3-4', '4-5', '5>'],
      type: 'dropdown',
      answer: '4-5',
    },
  ];

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.headerText}>
          Response saved on 09/27/2024 at 2:30PM
        </Text>
      </View>
      <View>
        {questions.map((question, index) =>
          renderQuestion(question, index, selectedValue, setSelectedValue),
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 14,
    marginLeft: 10,
  },
  picker: {
    height: 50,
    width: 150,
  },
});

export default DailyQuestionsResponse;
