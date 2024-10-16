import React, {useEffect, useState} from 'react';
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
import {useRoute} from '@react-navigation/native';
import HorizontalBarChart from '../HorizontalBarChart/HorizontalBarChart';
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
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.questionText}>{question.question.trim()}</Text>
          <Text style={{color: 'red'}}>*</Text>
        </View>
        <View style={styles.optionsHolder}>
          {question.options.map((option, i) => (
            <TouchableOpacity
              onPress={() =>
                updateQuestionsAnswer(
                  option.id,
                  question.question_id,
                  'single_choice',
                )
              }
              key={i}>
              <View
                style={{display: 'flex', flexDirection: 'row', margin: 5}}
                key={i}>
                {currentAnswers[question.question_id][0] === option.id ? (
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
  const [todayQ, setTodayQ] = useState(false);
  const {navigation, isItDailyQuestions, loginToken} = props;
  const route = useRoute();

  try {
    var {setNewSub} = route.params;
  } catch (error) {}

  const [currentPage, setCurrentPage] = useState(0);
  const [currentAnswers, setCurrentAnswers] = useState({});
  const [barChartData, setBarChartData] = useState([]);
  const [errorText, setErrorText] = useState('');
  console.log('barChartData', barChartData);

  const updateQuestionsAnswer = (option_id, question_id, questionType) => {
    if (questionType === 'single_choice') {
      setCurrentAnswers(prev => ({...prev, [question_id]: [option_id]}));
    }
  };
  const url = isItDailyQuestions
    ? 'http://10.0.2.2:3000/daily_questionnaire'
    : 'http://10.0.2.2:3000/questionnaire';

  const submitURL = !isItDailyQuestions
    ? 'http://10.0.2.2:3000/questionnaire_responses'
    : 'http://10.0.2.2:3000/daily_questionnaire_responses';

  const transformToDesiredStructure = data => {
    return Object.entries(data).map(([question_id, options_selected]) => {
      return {
        question_id: parseInt(question_id, 10),
        options_selected: options_selected,
      };
    });
  };

  const submitQuestionnare = async () => {
    setErrorText('');
    if (Object.values(currentAnswers).filter(a => a.length == 0).length != 0) {
      setErrorText('Please answer all the questions');
      return;
    }
    const response = await fetch(submitURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${loginToken}`,
      },
      body: JSON.stringify({
        responses: transformToDesiredStructure(currentAnswers),
      }),
    });
    const data = await response.json();

    if (response.ok) {
      if (!isItDailyQuestions) {
        setBarChartData(
          data.map(e => ({
            value: e.risk_score,
            label: e.disease_name,
          })),
        );
      }
      setTodayQ(true);
    }
    try {
      setNewSub(a => a + 1);
    } catch (error) {
      console.log(error);
    }
  };
  const [questions, setLongQuestionnaire] = useState([]);
  useEffect(() => {
    const fetchLongQuestionnaire = async () => {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${loginToken}`,
          'Content-Type': 'application/json',
        },
      });
      const allQuestions = await response.json();
      if (response.ok) {
        let allQuesionID = allQuestions.map(q => ({[q.question_id]: []}));
        allQuesionID = allQuesionID.reduce((acc, curr) => {
          const key = Object.keys(curr)[0];
          acc[key] = curr[key];
          return acc;
        }, {});

        setCurrentAnswers(allQuesionID);
        setLongQuestionnaire(allQuestions);
      }
    };
    fetchLongQuestionnaire();
  }, []);
  let whichQuestionsToUse = questions;
  return isItDailyQuestions && todayQ ? (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={styles.thanksText}>
        Thank you for filling today's questionnaire
      </Text>
    </View>
  ) : !isItDailyQuestions && todayQ ? (
    <HorizontalBarChart data={barChartData} />
  ) : (
    <ScrollView style={{backgroundColor: 'rgb(226	244	254	)'}}>
      <View style={styles.container}>
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
        </View>
        <View style={styles.saveAsDraftContainer}>
          <Button title="save draft" />
          {currentPage == Math.ceil(whichQuestionsToUse.length / 10) - 1 && (
            <View style={{marginTop: 5}}>
              {errorText.length > 0 && (
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.errorText}>{errorText}</Text>
                </View>
              )}
              <Button title="Submit" onPress={submitQuestionnare} />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
  },
  thanksText: {
    fontSize: 20,
  },
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
