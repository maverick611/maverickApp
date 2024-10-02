import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Button} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
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
        <View style={styles.optionsHolder}>
          {question.options.map((option, i) => (
            <View style={{display: 'flex', flexDirection: 'row', margin: 5}}>
              {question.answer != option ? (
                <EntypoIcon name="circle" size={15} />
              ) : (
                <FontAwesomeIcon name="dot-circle-o" size={19} />
              )}
              <Text key={i} style={styles.optionText}>
                {option}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  }
};

const DailyQuestions = props => {
  const {navigation} = props;
  const [selectedValue, setSelectedValue] = useState('4-5'); // For dropdown picker state

  const questions = [
    {
      question: 'Have you taken 3L of water today?',
      options: ['yes', 'no'],
      type: 'single',
    },
    {
      question: 'Did you consume any fruits or vegetables today?',
      options: ['yes', 'no'],
      type: 'single',
    },
    {
      question: 'How long do you sit (hrs)',
      options: ['<1', '1-2', '2-3', '3-4', '4-5', '5>'],
      type: 'dropdown',
    },
    {
      question: 'Have you taken 3L of water today?',
      options: ['yes', 'no'],
      type: 'single',
    },
    {
      question: 'Did you consume any fruits or vegetables today?',
      options: ['yes', 'no'],
      type: 'single',
    },
    {
      question: 'How long do you sit (hrs)',
      options: ['<1', '1-2', '2-3', '3-4', '4-5', '5>'],
      type: 'dropdown',
    },
    {
      question: 'Have you taken 3L of water today?',
      options: ['yes', 'no'],
      type: 'single',
    },
    {
      question: 'Did you consume any fruits or vegetables today?',
      options: ['yes', 'no'],
      type: 'single',
    },
    {
      question: 'How long do you sit (hrs)',
      options: ['<1', '1-2', '2-3', '3-4', '4-5', '5>'],
      type: 'dropdown',
    },
  ];

  return (
    <ScrollView style={{backgroundColor: 'rgb(226	244	254	)'}}>
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
        <Button title="Back" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  optionsHolder: {
    display: 'flex',
    flexDirection: 'row',
  },
  container: {
    margin: 30,
    padding: 20,
    borderWidth: 1,
    borderRadius: 8,
    ...Platform.select({
      android: {
        elevation: 5,
      },
    }),
    backgroundColor: '#EBF7D9',
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
    borderWidth: 1,
    borderColor: 'black',
  },
});

export default DailyQuestions;
