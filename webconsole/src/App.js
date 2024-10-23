import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import Users from './components/Users/Users';
import Profile from './components/Profile/Profile';
import Questions from './components/Questions/Questions';
import Resources from './components/Resources/Resources';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  const [userInfo, setUserInfo] = useState({});

  const updateUserInfo = (userInfo) => {
    console.log("App.js", userInfo)
    setUserInfo(userInfo);
  }
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login updateUser={updateUserInfo} />} />
          <Route path="/dashboard/" element={<Dashboard userInfo={userInfo} />} >
            <Route path="users" element={<Users userInfo={userInfo} />} />
            <Route path="profile" element={<Profile userInfo={userInfo} />} />
            <Route path="resources" element={<Resources tab="resources" userInfo={userInfo} />} />
            <Route path="questions" element={<Questions tab="questions" userInfo={userInfo} />} />
            <Route path="daily-questions" element={<Questions isDaily="true" tab="daily" userInfo={userInfo} />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;