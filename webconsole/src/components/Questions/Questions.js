import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import NavBar from '../Utils/NavBar';
import SideBar from '../Utils/SideBar';
import { FaSearch } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './Questions.css';

const Questions = (props) => {
    const [modalShow, setModalShow] = useState(false);
    const questions = [
        { id: 1, description: "Question 1", type: "System", role: "Super User" },
        { id: 2, description: "Question 2", type: "Dr. David", role: "Resources" },
        { id: 3, description: "Question 3", type: "Dr. David", role: "Resources" },
        ];
    const BarStyle = {width:"20rem",background:"white", border:"1px solid", margin: "0.5rem", padding:"0.5rem"};
    return (
        <div className="user-container">
        <NavBar userLoggesIn="true"/>
        <div className="user-content">
            <SideBar access="true" tab={props.tab}/>
            <div className="user-main-content">
                <div className='question-filters'>
                    <Dropdown className='question-dropdown'>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Dropdown Button
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <span className='question-search'>
                        <FaSearch />
                        <input 
                            style={BarStyle}
                            key="search-bar"
                            placeholder={"search with keywords"}
                            />
                    </span>
                    
                </div>
                    
                    <table style={{"background-color": "white"}}>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Questions</th>
                        {props.isDaily ? null : <th>Type</th>}
                        <th>Answers</th>
                        <th>Action</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {questions.map((question) => (
                        <tr key={question.id}>
                        <td>{question.id}</td>
                        <td className='question-column'>{question.description}</td>
                        {props.isDaily ? null : <td>{question.type}</td>}
                        <td onClick={() => setModalShow(true)}><a style={{"text-decoration": "underline"}}>View</a></td>
                        <td><a style={{"color": "green"}}>Edit</a></td>
                        <td><a style={{"color": "red"}}>Delete</a></td>
                        </tr>
                    ))}
                    <tr>
                        <td>4</td>
                        <td><input placeholder="Add User" /></td>
                        {props.isDaily ? null : <td>Dr. David</td>}
                        <td><button className="add-btn">Add User</button></td>
                        <td></td>
                    </tr>
            </tbody>
                </table>
                {modalShow ? <Modal
                    {...props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                        Modal heading
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Centered Modal</h4>
                        <p>
                        Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                        dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
                        consectetur ac, vestibulum at eros.
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button>Close</Button>
                    </Modal.Footer>
                </Modal> : null}
            </div>
        </div>
        </div>
    );
};

export default Questions;
