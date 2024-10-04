import React, { useState } from 'react';
import NavBar from '../Utils/NavBar';
import SideBar from '../Utils/SideBar';
import { SlUser } from "react-icons/sl";
import './Profile.css';

const Profile = (props) => {
    const [username, setUsername] = useState("Dr. David");
    const [isReadOnly, setIsReadOnly] = useState(true);
    const [passwordUpdate, setPasswordUpdate] = useState(false);
    return (
        <div className="profile-container">
            <NavBar userLoggesIn="true" />
            <div className="profile-content">
                <SideBar access="true" tab="profile" />
                <div className='profile-section'>
                    <div className="profile-info">
                        <SlUser /> <div className='text-left'>{username}</div>
                        <button className="profile-btn" onClick={() => setPasswordUpdate(!passwordUpdate)}>
                            Update Password
                        </button>
                        <button className="profile-btn" onClick={() => setIsReadOnly(!isReadOnly)}>
                            Update Details
                        </button>
                    </div>
                    {passwordUpdate ?
                        <form className='profile-form-password'>
                            <h3>Password Update</h3>
                            <div>
                                <div className="form-group">
                                    <label htmlFor="password">Current Password</label>
                                    <input type="password" id="password" name="password" />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <input type="password" id="password" name="password" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="confirmPassword">Confirm Password</label>
                                        <input type="password" id="confirmPassword" name="confirmPassword" />
                                    </div>
                                </div>
                            </div>
                            <div style={{ "display": "flex" }}>
                                <button type="submit" className="signup-btn">Save</button>
                                <button type="cancel" className="signup-btn">Cancel</button>
                            </div>
                        </form> : null}
                    <form className='profile-form'>
                        <span className='profile-content'>
                            <h3>Personal Information</h3><p className='text-left info-text'>(Click "Update Details" button to edit)</p>
                        </span>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <input className="form-control" type="text" id="firstName" name="firstName" disabled={isReadOnly} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input type="text" id="username" name="username" disabled={isReadOnly} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input type="text" id="lastName" name="lastName" disabled={isReadOnly} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="dob">Date of Birth</label>
                                <input type="date" id="dob" name="dob" disabled={isReadOnly} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input type="tel" id="phone" name="phone" disabled={isReadOnly} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" name="email" disabled={isReadOnly} />
                            </div>
                        </div>
                        <div style={{ "display": "flex" }}>
                            <button type="submit" className="signup-btn">Save</button>
                            <button type="cancel" className="signup-btn">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
