import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import NavBar from '../Utils/NavBar';
import SideBar from '../Utils/SideBar';
import { FaSearch } from 'react-icons/fa';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import './Questions.css';
import DialogComponent from '../Utils/Dialog';
import { FormControl, InputLabel, MenuItem, Paper, Select } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useLocation } from 'react-router-dom';

const Questions = (props) => {
    const location = useLocation();
    const paginationModel = { page: 0, pageSize: 15 };

    const [questions, setQuestions] = useState([]);
    const [allQuestions, setAllQuestions] = useState([]);
    const [allDiseases, setAllDiseases] = useState([]);
    const [editQuestion, setEditQuestion] = useState(null);
    const [editedValue, setEditedValue] = useState("");
    const inputRef = useRef(null);

    const [dialogDelete, setDialogDelete] = useState({ open: false, message: '' });

    const [newUser, setNewUser] = useState(null);
    const [popupVisible, setPopupVisible] = useState(null);

    const [viewOptions, setViewOptions] = useState(null);

    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
    const [dialog, setDialog] = useState({ open: false, message: '' });
    const [dialogQues, setDialogQues] = useState({ open: false, message: '' })
    const [dialogDisease, setDialogDisease] = useState({ open: false, message: '' })
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const viewLinkRefs = useRef([]); // To store refs of each "View" link

    const BarStyle = { width: "20rem", background: "white", border: "1px solid", margin: "0.5rem", padding: "0.5rem" };

    useEffect(() => {
        const pathSplits = location.pathname.split('/')
        const questionType = pathSplits[pathSplits.length - 1]
        getAllQuestionsAndDiseases(questionType);
    }, [location]);

    const rows = questions.map(q => {
        q.id = q.question_id;
        return q;
    });

    const getDiseases = (data, questionType) => {
        const diseaseMap = new Map();

        data.forEach(question => {
            question.diseases.forEach(disease => {
                if (!diseaseMap.has(disease.disease_id)) {
                    diseaseMap.set(disease.disease_id, disease.disease_name);
                }
            });
        });
        if (questionType.includes('daily')) {
            setAllDiseases(Array.from(diseaseMap).filter(([id, name]) => name === 'daily').map(([id, name]) => ({ disease_id: id, disease_name: name })));
            console.log(allDiseases)
        }
        else {
            setAllDiseases(Array.from(diseaseMap).filter(([id, name]) => name !== 'daily').map(([id, name]) => ({ disease_id: id, disease_name: name })));
        }
    };

    const getAllQuestionsAndDiseases = async (questionsType) => {
        try {
            const response = await fetch('http://localhost:3030/getQuestionsWithDetails', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const questions = data.filter(question => {
                    const diseases = question.diseases;
                    if (!questionsType.includes('daily')) {
                        return diseases.length > 1 || !diseases.every(disease => disease.disease_name === 'daily');
                    }
                    return diseases.some(disease => disease.disease_name === 'daily');
                });
                setQuestions(questions);
                setAllQuestions(questions);
                getDiseases(questions, questionsType);
            } else {
                setAlert({ show: true, message: "Failed to get all questions", type: "error" });
            }
        } catch (error) {
            console.log(error)
            setAlert({ show: true, message: "Error fetching all questions", type: "error" });
        }
    };

    const handleDiseaseChange = (e) => {
        const updatedQuestions = e.target.value === 'ALL' ? allQuestions : allQuestions.filter(question =>
            question.diseases.some(disease => disease.disease_id === e.target.value));
        setQuestions(updatedQuestions);
    }

    const handleSearch = (e) => {
        const updatedQuestions = allQuestions.filter(question =>
            question.question.includes(e.target.value));
        setQuestions(updatedQuestions);
    }
    const deleteQuestion = async (id) => {
        try {
            const response = await fetch(`http://localhost:3030/deleteQuestion/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const updatedQuestions = questions.filter(question => question.question_id !== id);
                setQuestions(updatedQuestions);
                setNewUser("")
                setAlert({ show: true, message: "Question deleted successfully!", type: "success" });
            } else {
                setAlert({ show: true, message: "Failed to delete question", type: "error" });
            }
        } catch (error) {
            console.error("Error revoking user:", error);
            setAlert({ show: true, message: "Error in deleting question", type: "error" });
        }
    }

    const handleDelete = (question) => {
        setDialogDelete({ open: true, message: `Are you sure you want to delete "${question.question}" question?`, data: question.question_id });
    };

    const handleCancelDelete = () => {
        setDialogDelete({ open: false, message: "" });
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
        const newQuestion = { id: newId, description: "", type: "Dr. David" };
        setQuestions([...questions, newQuestion]);
        alert("User added successfully!");
    };

    const handleView = (question) => {
        setPopupVisible(question);
        const initialWeights = {};
        question.diseases.forEach(disease => {
            disease.options.forEach(option => {
                initialWeights[`${disease.disease_id}-${option.options_id}`] = option.weightage;
            });
        });
        console.log(initialWeights)
        setViewOptions(initialWeights)
    };

    const handleAdd = () => {
        setDialog({ open: true, message: `Add possible answers to "${editedValue}" question`, data: 'addOptions' });
    };
    const updateWeight = (diseaseId, optionId, newWeight) => {
        setViewOptions(prevWeights => ({
            ...prevWeights,
            [`${diseaseId}-${optionId}`]: newWeight
        }));
    };
    const handleCancelWeights = () => {
        setPopupVisible(null);
    }
    const saveWeightChanges = async (question) => {
        // api
        const x = Object.keys(viewOptions)[0].split('-');
        const requestBody = {
            "question_id": question.question_id,
            "disease_id": x[0],
            "options_id": x[1],
            "weightage": viewOptions[`${x[0]}-${x[1]}`]
        }
        console.log('request body', requestBody)
        try {
            const response = await fetch(`http://localhost:3030/editOption/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                setAlert({ show: true, message: "Answers updated successfully!", type: "success" });
            } else {
                setAlert({ show: true, message: "Failed to update answers", type: "error" });
            }
        } catch (error) {
            console.error("Error revoking user:", error);
            setAlert({ show: true, message: "Error in update answers", type: "error" });
        }
        // diseases.forEach(disease => {
        //     disease.options.forEach(option => {
        //         const key = `${disease.disease_id}-${option.options_id}`;
        //         if (tempWeights[key] !== undefined) {
        //             option.weightage = tempWeights[key];
        //         }
        //     });
        // });
        setPopupVisible(null); // Close the dialog after saving
    };
    const columns: GridColDef[] = [
        {
            field: 'question',
            headerName: 'Questions',
            sortable: false,
            flex: 2,
            renderCell: (question) => {
                return editQuestion && editQuestion.question_id === question.id ?
                    <div className='edit-question'>
                        <input className='input-question' type="text" id="question"
                            name="question" value={editedValue}
                            onChange={handleInputChange} />
                        <button type="cancel" className="question-btn-cancel" onClick={() => setEditQuestion(null)}><CloseIcon fontSize="inherit" /></button>
                        <button type="submit" className="question-btn-submit" onClick={saveEdit}><CheckIcon fontSize="inherit" /></button>
                    </div> : question.question
            },
        },
        {
            field: 'disease',
            headerName: 'Diseases',
            sortable: false,
            flex: 1.1,
            valueGetter: (value, row) => {
                const diseaseNames = row.diseases.map(disease => disease.disease_name);
                return diseaseNames.join(', ');
            }
        },
        {
            field: 'answers',
            headerName: 'Answers',
            sortable: false,
            flex: 0.3,
            renderCell: (question) => {
                return <a
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                    onClick={() => handleView(question.row)}
                >
                    View
                </a>
            },
        },
        { field: 'action', headerName: 'Action', flex: 0.3, renderCell: (question) => <a style={{ color: "green", cursor: "pointer" }} onClick={() => handleEdit(question.row)}>Edit</a> },
        { field: 'delete', headerName: 'Delete', flex: 0.3, renderCell: (question) => <a style={{ color: "red", cursor: "pointer" }} onClick={() => handleDelete(question.row)}>Delete</a> },
    ];

    return (
        <div className="user-content">
            <SideBar access="true" tab={props.tab} />
            <div className="user-main-content">
                {alert.show && <Alert variant="outlined" onClose={() => setAlert({ show: false })} severity={alert.type}>
                    {alert.message}
                </Alert>}
                {dialogDelete.open && <DialogComponent openDialog={dialogDelete.open} alertMessage={dialogDelete.message} data={dialogDelete.data} no={"No"} yes={"Yes"} action={deleteQuestion} cancel={handleCancelDelete} />}
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
                            {allDiseases.map(disease => <MenuItem key={disease.disease_id} value={disease.disease_id}>{disease.disease_name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <span className='question-search'>

                        <button className="menu-btn" onClick={() => setDialogQues({ open: true, message: `Add Question` })}>Add Question</button>
                        <button className="menu-btn" onClick={() => setDialogDisease({ open: true, message: `Add Disease` })}>Add Disease</button>
                        <FaSearch />
                        <input
                            style={BarStyle}
                            key="search-bar"
                            placeholder={"search with keywords"}
                            onChange={handleSearch}
                        />
                    </span>
                </div>
                {popupVisible && (
                    <DialogComponent openDialog={popupVisible !== null} alertMessage={`Answers for Question "${popupVisible.question}" with different diseases`} data={popupVisible} no={"Cancel"} yes={"Save"} action={saveWeightChanges} cancel={handleCancelWeights}>
                        <div className="popup-content">
                            {popupVisible.diseases.map(disease => (
                                <div key={disease.disease_id} className='disease-section'>
                                    <h3>{disease.disease_name} <button >Add Answer</button></h3>
                                    {disease.options.map(option => (
                                        <div key={option.options_id} className='question-filters'>
                                            <label className='full-width'>
                                                {option.option_text.toUpperCase()}:
                                                <input
                                                    className='answers-input'
                                                    type="number"
                                                    value={viewOptions[`${disease.disease_id}-${option.options_id}`]}
                                                    onChange={(e) => updateWeight(disease.disease_id, option.options_id, parseInt(e.target.value))}
                                                />
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </DialogComponent>
                )}
                {dialogQues.open && (
                    <DialogComponent openDialog={dialogQues.open} alertMessage={`Add a new Question`} data={dialogQues} no={"Cancel"} yes={"Save"} action={saveWeightChanges} cancel={handleCancelWeights}>
                        <div className="popup-content">
                            <form className='profile-form'>
                                <div style={{ textAlign: "left" }}>
                                    <label htmlFor="resourceName">Question</label>
                                    <input className="form-control" type="text" id="resourceName" name="resourceName" />
                                </div>
                                <div style={{ textAlign: "left" }}>
                                    <FormControl variant="standard" sx={{ m: 0, minWidth: 550 }}>
                                        <InputLabel id="demo-simple-select-standard-label">Disease</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            label="Age"
                                        >
                                            <MenuItem key="all" value="ALL">
                                                <em>All</em>
                                            </MenuItem>
                                            {allDiseases.map(disease => <MenuItem key={disease.disease_id} value={disease.disease_id}>{disease.disease_name}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </div>
                                <div style={{ textAlign: "left" }}>
                                    <button >Add Answer</button>
                                </div>
                            </form>
                        </div>
                    </DialogComponent>
                )}
                {dialogDisease.open && (
                    <DialogComponent openDialog={dialogDisease} alertMessage={`Add a new diseases`} data={popupVisible} no={"Cancel"} yes={"Save"} action={saveWeightChanges} cancel={handleCancelWeights}>
                        <div className="popup-content">
                            <form className='profile-form'>
                                <div style={{ textAlign: "left" }}>
                                    <label htmlFor="lastName">Disease Name</label>
                                    <input type="text" id="diseaseName" name="diseaseName" />
                                </div>
                            </form>
                        </div>
                    </DialogComponent>
                )}
                <Paper sx={{ height: 700, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[15, 20, 25]}
                        sx={{ border: 0 }}
                    />
                </Paper>
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
                                        onClick={() => handleView(question)}
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
    );
};

export default Questions;
