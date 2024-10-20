import React from 'react';
import NavBar from '../Utils/NavBar';
import './Dashboard.css';
import { Outlet } from 'react-router-dom';

const Dashboard = (props) => {
    return (
        <div className="container">
            <NavBar userLoggesIn="true" username={props.userInfo.username} />
            <div className="content">
                {/* Changable content based on different url */}
                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard;
