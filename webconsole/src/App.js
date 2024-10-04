import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import Users from './components/Users/Users';
import Signup from './components/Signup/Signup';
import Profile from './components/Profile/Profile';
import Questions from './components/Questions/Questions';
import Resources from './components/Resources/Resources';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/sign-up" element={<Signup />} />
            <Route path="/users" element={<Users />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/resources" element={<Resources tab="resources"/>} />
            <Route path="/questions" element={<Questions tab="questions"/>} />
            <Route path="/daily-questions" element={<Questions isDaily="true" tab="daily"/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;