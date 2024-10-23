import React, { useState } from 'react';
import NavBar from '../Utils/NavBar';
import SideBar from '../Utils/SideBar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import './Profile.css';
import { useLocation } from 'react-router-dom';
import DialogComponent from '../Utils/Dialog';
import { Alert } from '@mui/material';

const Profile = (props) => {
    const { state } = useLocation();

    const [userInfo, setUserInfo] = useState(state.userInfo);
    const [dialog, setDialog] = useState({ open: false, message: '' });
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const handleChangeInFirstName = async (e) => {
        setUserInfo({ ...userInfo, first_name: e.target.value })
    }
    const handleChangeInLastName = async (e) => {
        setUserInfo({ ...userInfo, last_name: e.target.value })
    }
    const handleChangeInUsername = async (e) => {
        setUserInfo({ ...userInfo, username: e.target.value })
    }
    const handleChangeInPhone = async (e) => {
        setUserInfo({ ...userInfo, phone: e.target.value })
    }
    const handleChangeInEmail = async (e) => {
        setUserInfo({ ...userInfo, email: e.target.value })
    }
    const handlePersonalDetailsUpdate = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const requestBody = {
            admin_id: userInfo.admin_id,
            first_name: data.get('first_name'),
            username: data.get('username'),
            last_name: data.get('last_name'),
            phone: data.get('phone'),
            email: data.get('email'),
            updated_by: data.get('username'),
            password: "admin456"
        };
        try {
            const response = await fetch('http://localhost:3030/adminPersonalDetails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                setUserInfo(requestBody);
                setAlert({ show: true, message: "Personal details updated successfully!", type: "success" });
            } else {
                const data = await response.json();
                setAlert({ show: true, message: data.message || 'Invalid details provided', type: "error" });
            }
        } catch (error) {
            console.error('Error during update:', error);
            setAlert({ show: true, message: 'An error occurred. Please try again.', type: "error" });
        }
    };
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
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
                setAlert({ show: true, message: "Password updated successfully!", type: "success" });
            } else {
                const data = await response.json();
                setAlert({ show: true, message: data.message || 'Invalid details provided', type: "success" });
            }
        } catch (error) {
            console.error('Error during update:', error);
            setAlert({ show: true, message: "An error occurred. Please try again.", type: "success" });
        }
    };

    const handleCancelDelete = () => {
        setDialog({ open: false, message: "" });
    };
    return (
        <div className="profile-content">
            <SideBar access="true" tab="profile" />
            <div className='profile-section'>
                <div className="profile-info">
                    <div className='center-user'><Avatar sx={{ width: 72, height: 72 }}>A</Avatar></div>
                    <div >{userInfo.username}</div>
                    <button className="profile-btn" onClick={() => setDialog({ open: true, message: `Update Password` })}>
                        Update Password
                    </button>
                </div>
                {alert.show && <Alert className="profile-form" onClose={() => setAlert({ show: false, message: '' })} variant="outlined" severity={alert.type}>
                    {alert.message}
                </Alert>}
                {dialog.open && <DialogComponent openDialog={dialog.open} alertMessage={dialog.message} no={"Cancel"} yes={"Save"} action={handlePasswordUpdate} cancel={handleCancelDelete} >
                    <form className='profile-form-password'>
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
                    </form>
                </DialogComponent>}
                <Card sx={{ width: "80%" }}>
                    <CardContent>
                        <form className='profile-form' onSubmit={handlePersonalDetailsUpdate}>
                            <h2>Personal Information</h2>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name</label>
                                    <input className="form-control" type="text" value={userInfo.first_name} id="first_name" name="first_name" onChange={handleChangeInFirstName} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input type="text" id="lastName" value={userInfo.last_name} name="last_name" onChange={handleChangeInLastName} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <input type="text" id="username" value={userInfo.username} name="username" onChange={handleChangeInUsername} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input type="tel" id="phone" name="phone" value={userInfo.phone} onChange={handleChangeInPhone} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" name="email" value={userInfo.email} onChange={handleChangeInEmail} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="profilePicture">Profile Picture</label>
                                    <input type="file" id="pp" name="profilepic" />
                                </div>
                            </div>
                            <div className='profile-info'>
                                <button type="submit" className="btn-submit">Save</button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
