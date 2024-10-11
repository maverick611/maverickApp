import React, { useState } from 'react';
import NavBar from '../Utils/NavBar';
import SideBar from '../Utils/SideBar';
import { SlUser } from "react-icons/sl";
import './Profile.css';
import { useLocation } from 'react-router-dom';
// import { Route } from 'react-router-dom';

const Profile = (props) => {
    const { state } = useLocation();

    const [userInfo, setUserInfo] = useState(state.userInfo);
    const [isReadOnly, setIsReadOnly] = useState(true);
    const [passwordUpdate, setPasswordUpdate] = useState(false);
    const [message, setMessage] = useState('');

    // const { userInfo } = route.params;

    const handlePersonalDetailsUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        const data = new FormData(e.target);
        const requestBody = {
            firstName: data.get('firstName'),
            username: data.get('username'),
            lastName: data.get('lastName'),
            dob: data.get('dob'),
            phone: data.get('phone'),
            email: data.get('email'),
        };
        try {
            const response = await fetch('/update_passowrd', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                setPasswordUpdate(false)
                setMessage('Personal details updated successfully!')
            } else {
                const data = await response.json();
                setMessage(data.message || 'Invalid details provided');
            }
        } catch (error) {
            console.error('Error during update:', error);
            setMessage('An error occurred. Please try again.');
        }
    };
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        const data = new FormData(e.target);
        const requestBody = {
            currentPassword: data.get('currentPassword'),
            newPassword: data.get('newPassword'),
            confirmPassword: data.get('confirmPassword'),
        };
        try {
            const response = await fetch('/update_passowrd', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                setPasswordUpdate(false)
                setMessage('Password updated successfully!')
            } else {
                const data = await response.json();
                setMessage(data.message || 'Invalid details provided');
            }
        } catch (error) {
            console.error('Error during update:', error);
            setMessage('An error occurred. Please try again.');
        }
    };
    return (
        <div className="profile-container">
            <NavBar userLoggesIn="true" />
            <div className="profile-content">
                <SideBar access="true" tab="profile" />
                <div className='profile-section'>
                    <div className="profile-info">
                        <SlUser /> <div className='text-left'>{userInfo.username}</div>
                        <button className="profile-btn" onClick={() => setPasswordUpdate(!passwordUpdate)}>
                            Update Password
                        </button>
                        <button className="profile-btn" onClick={() => setIsReadOnly(!isReadOnly)}>
                            Update Details
                        </button>
                    </div>
                    {message && <p className="message">{message}</p>}
                    {passwordUpdate ?
                        <form className='profile-form-password' onSubmit={handlePasswordUpdate}>
                            <h3>Password Update</h3>
                            <div>
                                <div className="form-group">
                                    <label htmlFor="currentPassword">Current Password</label>
                                    <input type="password" id="currentPassword" name="password" />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="newPassword">Password</label>
                                        <input type="password" id="newPassword" name="password" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="confirmPassword">Confirm Password</label>
                                        <input type="password" id="confirmPassword" name="confirmPassword" />
                                    </div>
                                </div>
                            </div>
                            <div style={{ "display": "flex" }}>
                                <button type="cancel" className="btn-cancel" onClick={() => setPasswordUpdate(false)}>Cancel</button>
                                <button type="submit" className="btn-submit">Save</button>
                            </div>
                        </form> : null}
                    <form className='profile-form' onSubmit={handlePersonalDetailsUpdate}>
                        <span className='profile-content'>
                            <h3>Personal Information</h3><p className='text-left info-text'>(Click "Update Details" button to edit)</p>
                        </span>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <input className="form-control" type="text" value="Dr.David" id="firstName" name="firstName" disabled={isReadOnly} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input type="text" id="username" value="david" name="username" disabled={isReadOnly} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input type="text" id="lastName" value="K" name="lastName" disabled={isReadOnly} />
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
                        {!isReadOnly ? <div style={{ "display": "flex" }}>
                            <button type="cancel" className="btn-cancel" onClick={() => setIsReadOnly(true)}>Cancel</button>
                            <button type="submit" className="btn-submit">Save</button>
                        </div> : null}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
