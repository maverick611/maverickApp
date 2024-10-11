import React, { useState, useRef } from 'react';
import NavBar from '../Utils/NavBar';
import SideBar from '../Utils/SideBar';
import { FaSearch } from 'react-icons/fa';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import './Questions.css';
import DialogComponent from '../Utils/Dialog';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const Questions = (props) => {
    const [questions, setQuestions] = useState([
        { question_id: 1, question: "Do you sit for more than 4 hours a day?", disease: "Heart", tye: "single-select", options: { Yes: 0, No: 1 } },
        { question_id: 2, question: "Have you been diagnosed with high blood pressure?", disease: "Heart", tye: "single-select", options: { Yes: 0, No: 1 } },
        { question_id: 3, question: "Have you been diagnosed with prediabetes or type 2 diabetes?", disease: "Diabetes", tye: "single-select", options: { Yes: 0, No: 1 } },
        { question_id: 4, question: "Do you sit for more than 4 hours a day?", disease: "Heart", tye: "single-select", options: { Yes: 0, No: 1 } },
        { question_id: 5, question: "Have you been diagnosed with high blood pressure?", disease: "Heart", tye: "single-select", options: { Yes: 0, No: 1 } },
        { question_id: 6, question: "Have you been diagnosed with prediabetes or type 2 diabetes?", disease: "Diabetes", tye: "single-select", options: { Yes: 0, No: 1 } },
        { question_id: 7, question: "Do you sit for more than 4 hours a day?", disease: "Heart", tye: "single-select", options: { Yes: 0, No: 1 } },
        { question_id: 8, question: "Have you been diagnosed with high blood pressure?", disease: "Heart", tye: "single-select", options: { Yes: 0, No: 1 } },
        { question_id: 9, question: "Have you been diagnosed with prediabetes or type 2 diabetes?", disease: "Diabetes", tye: "single-select", options: { Yes: 0, No: 1 } },
        { question_id: 10, question: "Do you sit for more than 4 hours a day?", disease: "Heart", tye: "single-select", options: { Yes: 0, No: 1 } },
        { question_id: 11, question: "Have you been diagnosed with high blood pressure?", disease: "Heart", tye: "single-select", options: { Yes: 0, No: 1 } },
        { question_id: 12, question: "Have you been diagnosed with prediabetes or type 2 diabetes?", disease: "Diabetes", tye: "single-select", options: { Yes: 0, No: 1 } },
    ]);
    const [allQuestions, setAllQuestions] = useState([
        { question_id: 1, question: "Do you sit for more than 4 hours a day?", disease: "Heart", tye: "single-select", options: { Yes: 0, No: 1 } },
        { question_id: 2, question: "Have you been diagnosed with high blood pressure?", disease: "Heart", tye: "single-select", options: { Yes: 0, No: 1 } },
        { question_id: 3, question: "Have you been diagnosed with prediabetes or type 2 diabetes?", disease: "Diabetes", tye: "single-select", options: { Yes: 0, No: 1 } },
        { question_id: 4, question: "Do you sit for more than 4 hours a day?", disease: "Heart", tye: "single-select", options: { Yes: 0, No: 1 } },
        { question_id: 5, question: "Have you been diagnosed with high blood pressure?", disease: "Heart", tye: "single-select", options: { Yes: 0, No: 1 } },
        { question_id: 6, question: "Have you been diagnosed with prediabetes or type 2 diabetes?", disease: "Diabetes", tye: "single-select", options: { Yes: 0, No: 1 } },
        { question_id: 7, question: "Do you sit for more than 4 hours a day?", disease: "Heart", tye: "single-select", options: { Yes: 0, No: 1 } },
        { question_id: 8, question: "Have you been diagnosed with high blood pressure?", disease: "Heart", tye: "single-select", options: { Yes: 0, No: 1 } },
        { question_id: 9, question: "Have you been diagnosed with prediabetes or type 2 diabetes?", disease: "Diabetes", tye: "single-select", options: { Yes: 0, No: 1 } },
        { question_id: 10, question: "Do you sit for more than 4 hours a day?", disease: "Heart", tye: "single-select", options: { Yes: 0, No: 1 } },
        { question_id: 11, question: "Have you been diagnosed with high blood pressure?", disease: "Heart", tye: "single-select", options: { Yes: 0, No: 1 } },
        { question_id: 12, question: "Have you been diagnosed with prediabetes or type 2 diabetes?", disease: "Diabetes", tye: "single-select", options: { Yes: 0, No: 1 } },
    ]);
    const allDiseases = [...new Set(allQuestions.map(q => q.disease))]
    const [editQuestion, setEditQuestion] = useState(null);
    const [editedValue, setEditedValue] = useState("");
    const [popupVisible, setPopupVisible] = useState(null);

    const [newUser, setNewUser] = useState("");
    const [viewOptions, setViewOptions] = useState(null);

    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
    const [dialog, setDialog] = useState({ open: false, message: '' });
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const viewLinkRefs = useRef([]); // To store refs of each "View" link

    const BarStyle = { width: "20rem", background: "white", border: "1px solid", margin: "0.5rem", padding: "0.5rem" };

    const handleDiseaseChange = (e) => {
        const updatedQuestions = e.target.value === 'ALL' ? allQuestions : allQuestions.filter(question => question.disease === e.target.value);
        setQuestions(updatedQuestions);
    }
    const deleteQuestion = (id) => {
        const updatedQuestions = questions.filter(question => question.question_id !== id);
        // Add delet api here
        setQuestions(updatedQuestions);
        setAlert({ show: true, message: "Question deleted successfully!", type: "success" });
    }

    const handleDelete = (question) => {
        setDialog({ open: true, message: `Are you sure you want to delete "${question.question}" question?`, data: question.question_id });
    };

    const handleCancelDelete = () => {
        setDialog({ open: false, message: "" });
    };

    const handleEdit = (question) => {
        setEditQuestion(question);
        setEditedValue(question.question);
    };

    const handleInputChange = (e) => {
        setEditedValue(e.target.value);
    };

    const saveEdit = () => {
        if (editQuestion) {
            //   saveQuestion({ ...editQuestion, question: editedValue }); // Send the updated question to the API
            const updatedQuestions = questions.map(q => q.question_id === editQuestion.question_id ? { ...editQuestion, question: editedValue } : q);
            setQuestions(updatedQuestions);
            setEditQuestion(null);
        }
    };

    // Function to add a new user/question
    const addUser = () => {
        const newId = questions.length + 1;
        const newQuestion = { id: newId, description: newUser, type: "Dr. David" };
        setQuestions([...questions, newQuestion]);
        setNewUser("");
        alert("User added successfully!");
    };

    const handleView = (question, index) => {
        const linkElement = viewLinkRefs.current[index];
        const rect = linkElement.getBoundingClientRect();
        setPopupPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
        setPopupVisible(popupVisible === question.question_id ? null : question.question_id);
        setViewOptions(question.options)
    };

    const handleAdd = () => {
        setDialog({ open: true, message: `Add possible answers to "${editedValue}" question`, data: 'addOptions' });
    };
    const updateWeight = (question, option, increment) => {
        if (viewOptions) {
            setViewOptions((prevOptions) => ({
                ...prevOptions,
                [option]: increment ? prevOptions[option] + 1 : Math.max(prevOptions[option] - 1, 0),
            }));
        }
    };

    return (
        <div className="user-container">
            <NavBar userLoggesIn="true" />
            <div className="user-content">
                <SideBar access="true" tab={props.tab} />
                <div className="user-main-content">
                    {alert.show && <Alert icon={<CheckIcon fontSize="inherit" />} variant="outlined" severity={alert.type}>
                        {alert.message}
                    </Alert>}
                    {dialog.open && <DialogComponent openDialog={dialog.open} alertMessage={dialog.message} data={dialog.data} action={deleteQuestion} cancel={handleCancelDelete} />}
                    <div className='question-filters'>
                        <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-standard-label">Disease</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                onChange={handleDiseaseChange}
                                label="Age"
                            >
                                <MenuItem key="all" value="ALL">
                                    <em>All</em>
                                </MenuItem>
                                {allDiseases.map(disease => <MenuItem key={disease} value={disease}>{disease}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <span className='question-search'>
                            <FaSearch />
                            <input
                                style={BarStyle}
                                key="search-bar"
                                placeholder={"search with keywords"}
                            />
                        </span>
                    </div>

                    <table style={{ backgroundColor: "white" }}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Questions</th>
                                {props.isDaily ? null : <th>Diesease</th>}
                                <th>Answers</th>
                                <th>Action</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((question, index) => (
                                <tr key={question.question_id}>
                                    <td>{question.question_id}</td>
                                    <td className='question-column'>
                                        {editQuestion && editQuestion.question_id === question.question_id ?
                                            <span className='edit-question'>
                                                <input className='input-question' type="text" id="question"
                                                    name="question" value={editedValue}
                                                    onChange={handleInputChange} />
                                                <button type="cancel" className="question-btn-cancel" onClick={() => setEditQuestion(null)}><CloseIcon fontSize="inherit" /></button>
                                                <button type="submit" className="question-btn-submit" onClick={saveEdit}><CheckIcon fontSize="inherit" /></button>
                                            </span> : question.question}</td>
                                    {props.isDaily ? null : <td>{question.disease}</td>}
                                    <td>
                                        <a
                                            ref={(el) => (viewLinkRefs.current[index] = el)}
                                            style={{ textDecoration: "underline", cursor: "pointer" }}
                                            onClick={() => handleView(question, index)}
                                        >
                                            View
                                        </a>
                                        {popupVisible === question.question_id && (
                                            <div className="popup-overlay"
                                                style={{
                                                    position: "absolute",
                                                    top: popupPosition.top + "px",
                                                    left: popupPosition.left + "px",
                                                }}>
                                                <div className="popup-content">
                                                    {Object.entries(viewOptions).map(([option, weight]) => {
                                                        return (<div className='question-filters'>
                                                            <label>{option}: {weight}</label>
                                                            <button onClick={() => updateWeight(question, option, true)}>+</button>
                                                            <button onClick={() => updateWeight(question, option, false)}>-</button>
                                                        </div>)
                                                    })}

                                                    <button className='question-dropdown'>Add Answer</button>
                                                    <span className='question-filters'>
                                                        <button onClick={() => setPopupVisible(null)}><CloseIcon fontSize="inherit" /></button>
                                                        <button onClick={() => setPopupVisible(null)}><CheckIcon fontSize="inherit" /></button>
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td><a style={{ color: "green", cursor: "pointer" }} onClick={() => handleEdit(question)}>Edit</a></td>
                                    <td><a style={{ color: "red", cursor: "pointer" }} onClick={() => handleDelete(question)}>Delete</a></td>
                                </tr>
                            ))}
                            <tr>
                                <td>{questions.length + 1}</td>
                                <td><input value={newUser} placeholder="Add Question" onChange={(e) => setNewUser(e.target.value)} /></td>
                                {props.isDaily ? null : <td><input value={''} placeholder="Add Disease" onChange={(e) => setNewUser(e.target.value)} /></td>}
                                <td><button className="add-btn"
                                    onClick={handleAdd}>Add</button></td>
                                {dialog.open && <DialogComponent openDialog={dialog.open} alertMessage={dialog.message} data={dialog.data} action={deleteQuestion} cancel={handleCancelDelete} />}
                                <td><button className="add-btn" onClick={addUser}>Save</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
};

export default Questions;
