import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
// import {ScrollView} from 'react-native-gesture-handler';
const renderQuestion = (
  question,
  index,
  selectedValue,
  setSelectedValue,
  updateQuestionsAnswer,
  currentAnswers,
) => {
  if (question.type === 'dropdown') {
    return (
      <View key={index} style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.question}</Text>
        <Picker
          selectedValue={selectedValue}
          style={styles.picker}
          onValueChange={itemValue => setSelectedValue(itemValue)}>
          {question.answer.map((option, i) => (
            <Picker.Item key={i} label={option} value={option} />
          ))}
        </Picker>
      </View>
    );
  } else if (question.type === 'single_choice') {
    return (
      <View key={index} style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.question}</Text>
        <View style={styles.optionsHolder}>
          {question.options.map((option, i) => (
            <TouchableOpacity
              onPress={() =>
                updateQuestionsAnswer(option.id, question.question_id)
              }
              key={i}>
              <View
                style={{display: 'flex', flexDirection: 'row', margin: 5}}
                key={i}>
                {currentAnswers[question.question_id] === option.id ? (
                  <FontAwesomeIcon name="dot-circle-o" size={19} />
                ) : (
                  <EntypoIcon name={'circle'} size={15} />
                )}

                <Text key={i} style={styles.optionText}>
                  {option.text}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
};

const LongQuestionnaire = props => {
  const {navigation, isItDailyQuestions} = props;
  const [currentPage, setCurrentPage] = useState(0);
  // while fetching questions , setCurrentAnswers
  const [currentAnswers, setCurrentAnswers] = useState({
    7: '',
    4: '',
    100: '',
    1: '',
    5: '',
    2: '',
    3: '',
    400: '',
    6: '',
    300: '',
    17: '',
    14: '',
    111: '',
    11: '',
    15: '',
    12: '',
    23: '',
    33: '',
    16: '',
    13: '',
  });
  const updateQuestionsAnswer = (option_id, disease_id) => {
    setCurrentAnswers(prev => ({...prev, [disease_id]: option_id}));
  };
  const questions = [
    {
      question_id: 7,
      question: 'Do you have a family history of cardiovascular disease?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
        {id: 3, text: 'sometimes', value: 2.5},
      ],
      type: 'single_choice',
      disease_id: null,
    },
    {
      question_id: 7,
      question: 'Do you have a family history of cardiovascular disease?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
        {id: 3, text: 'sometimes', value: 2.5},
      ],
      type: 'single_choice',
      disease_id: null,
    },
    {
      question_id: 4,
      question: 'Do you experience shortness of breath after minimal exertion?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
      ],
      type: 'single_choice',
      disease_id: null,
    },
    {
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
      ],
      question_id: 100,
      question: 'Do you sit for more than 8 hours a day?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
        ,
      ],
      type: 'single_choice',
      disease_id: 1,
    },
    {
      question_id: 1,
      question: 'Do you sit for more than 8 hours a day?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
      ],
      type: 'single_choice',
      disease_id: 10,
    },
    {
      question_id: 5,
      question: 'Have you been diagnosed with high cholesterol levels?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
      ],
      type: 'single_choice',
      disease_id: null,
    },
    {
      question_id: 2,
      question: 'Have you been diagnosed with high blood pressure?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
      ],
      type: 'single_choice',
      disease_id: null,
    },
    {
      question_id: 3,
      question:
        'Do you engage in less than 30 minutes of physical activity daily?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
        {id: 3, text: 'sometimes', value: 2.5},
      ],
      type: 'single_choice',
      disease_id: 1,
    },
    {
      question_id: 400,
      question:
        'Do you engage in less than 30 minutes of physical activity daily?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
      ],
      type: 'single_choice',
      disease_id: 3,
    },
    {
      question_id: 6,
      question: 'Do you often experience swelling in your legs or ankles?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
      ],
      type: 'single_choice',
      disease_id: null,
    },
    {
      question_id: 300,
      question:
        'Do you engage in less than 30 minutes of physical activity daily?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
      ],
      type: 'single_choice',
      disease_id: 10,
    },

    {
      question_id: 17,
      question: 'Do you have a family history of cardiovascular disease?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
        {id: 3, text: 'sometimes', value: 2.5},
      ],
      type: 'single_choice',
      disease_id: null,
    },
    {
      question_id: 14,
      question: 'Do you experience shortness of breath after minimal exertion?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
      ],
      type: 'single_choice',
      disease_id: null,
    },
    {
      question_id: 111,
      question: 'Do you sit for more than 8 hours a day?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
      ],
      type: 'single_choice',
      disease_id: 1,
    },
    {
      question_id: 11,
      question: 'Do you sit for more than 8 hours a day?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
      ],
      type: 'single_choice',
      disease_id: 10,
    },
    {
      question_id: 15,
      question: 'Have you been diagnosed with high cholesterol levels?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
      ],
      type: 'single_choice',
      disease_id: null,
    },
    {
      question_id: 12,
      question: 'Have you been diagnosed with high blood pressure?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
        {id: 3, text: 'sometimes', value: 2.5},
      ],
      type: 'single_choice',
      disease_id: null,
    },
    {
      question_id: 23,
      question:
        'Do you engage in less than 30 minutes of physical activity daily?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
      ],
      type: 'single_choice',
      disease_id: 1,
    },
    {
      question_id: 33,
      question:
        'Do you engage in less than 30 minutes of physical activity daily?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
        {id: 3, text: 'sometimes', value: 2.5},
      ],
      type: 'single_choice',
      disease_id: 3,
    },
    {
      question_id: 16,
      question: 'Do you often experience swelling in your legs or ankles?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
      ],
      type: 'single_choice',
      disease_id: null,
    },
    {
      question_id: 13,
      question:
        'Do you engage in less than 30 minutes of physical activity daily?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
        {id: 3, text: 'sometimes', value: 2.5},
      ],
      type: 'single_choice',
      disease_id: 10,
    },
  ];
  const dailyQuestions = [
    {
      question_id: 2,
      question: 'Have you been diagnosed with high blood pressure?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
      ],
      type: 'single_choice',
      disease_id: null,
    },
    {
      question_id: 3,
      question:
        'Do you engage in less than 30 minutes of physical activity daily?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
        {id: 3, text: 'sometimes', value: 2.5},
      ],
      type: 'single_choice',
      disease_id: 1,
    },
    {
      question_id: 400,
      question:
        'Do you engage in less than 30 minutes of physical activity daily?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
      ],
      type: 'single_choice',
      disease_id: 3,
    },
    {
      question_id: 6,
      question: 'Do you often experience swelling in your legs or ankles?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
      ],
      type: 'single_choice',
      disease_id: null,
    },
    {
      question_id: 111,
      question: 'Do you sit for more than 8 hours a day?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
      ],
      type: 'single_choice',
      disease_id: 1,
    },
    {
      question_id: 11,
      question: 'Do you sit for more than 8 hours a day?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
      ],
      type: 'single_choice',
      disease_id: 10,
    },
    {
      question_id: 15,
      question: 'Have you been diagnosed with high cholesterol levels?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
      ],
      type: 'single_choice',
      disease_id: null,
    },
    {
      question_id: 12,
      question: 'Have you been diagnosed with high blood pressure?',
      options: [
        {id: 1, text: 'no', value: 5},
        {id: 2, text: 'yes', value: 0},
        {id: 3, text: 'sometimes', value: 2.5},
      ],
      type: 'single_choice',
      disease_id: null,
    },
  ];
  let whichQuestionsToUse = isItDailyQuestions ? dailyQuestions : questions;
  return (
    <ScrollView style={{backgroundColor: 'rgb(226	244	254	)'}}>
      <View style={styles.container}>
        {console.log(
          'currentPage',
          whichQuestionsToUse.filter(
            (q, index) =>
              index >= currentPage * 10 && index <= 10 * (currentPage + 1),
          ),
        )}
        <View>
          {whichQuestionsToUse
            .filter(
              (q, index) =>
                index >= currentPage * 10 && index < 10 * (currentPage + 1),
            )
            .map((question, index) => (
              <View key={index}>
                {renderQuestion(
                  question,
                  index,
                  null,
                  null,
                  updateQuestionsAnswer,
                  currentAnswers,
                )}
              </View>
            ))}
        </View>
        <View style={styles.buttonNavContainer}>
          <View style={styles.navButton}>
            <Button
              title="Prev"
              onPress={() => setCurrentPage(page => Math.max(0, page - 1))}
            />
          </View>
          <Text>
            {currentPage + 1} / {Math.ceil(whichQuestionsToUse.length / 10)}
          </Text>
          <View style={styles.navButton}>
            {console.log(
              'Math.ceil(whichQuestionsToUse.length / 10)',
              Math.ceil(whichQuestionsToUse.length / 10),
            )}
            <Button
              title="Next"
              onPress={() =>
                setCurrentPage(page =>
                  Math.min(
                    Math.ceil(whichQuestionsToUse.length / 10) - 1,
                    page + 1,
                  ),
                )
              }
            />
          </View>
          {console.log('pageeee', currentPage)}
        </View>
        <View style={styles.saveAsDraftContainer}>
          <Button title="save draft" />
          {currentPage == Math.ceil(whichQuestionsToUse.length / 10) - 1 && (
            <View style={{marginTop: 5}}>
              <Button title="Submit" />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  saveAsDraftContainer: {
    margin: 5,
  },
  navButton: {
    width: '30%',
  },
  buttonNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
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

export default LongQuestionnaire;
