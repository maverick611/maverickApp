import React, { useState } from 'react';
import './SideBar.css';
import { useNavigate } from 'react-router-dom';

const Sidebar = (props) => {
  const [tab, setTab] = useState(props.tab);
  const [userInfo, setUserInfo] = useState(props.userInfo);
  const navigate = useNavigate();
  return (
    <div className="sidebar">
      <ul>
        <li className={props.tab == 'profile' ? 'active' : ''} username={userInfo} onClick={() => navigate('/profile')}>Profile</li>
        <li className={props.tab == 'users' ? 'active' : ''} username={userInfo} onClick={() => navigate('/users')}>Manage Users</li>
        <li className={props.tab == 'questions' ? 'active' : ''} username={userInfo} onClick={() => navigate('/questions')}>Manage Questionnaire</li>
        <li className={props.tab == 'resources' ? 'active' : ''} username={userInfo} onClick={() => navigate('/resources')}>Manage Resource</li>
        <li className={props.tab == 'daily' ? 'active' : ''} username={userInfo} onClick={() => navigate('/daily-questions')}>Manage Daily Questionnaire</li>
      </ul>
    </div>
  );
};

export default Sidebar;
