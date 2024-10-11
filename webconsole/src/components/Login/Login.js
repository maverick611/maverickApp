import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../resources/images/logo.png';
import NavBar from '../Utils/NavBar';
import './Login.css';

const Login = (props, context) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const loginData = {
      username: username,
      password: password,
    };
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        navigate('/profile', { state: { userInfo: { username: 'Dr. David' } } });
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'Invalid username or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      navigate('/profile', { state: { userInfo: { username: 'Dr. David' } } });
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="loginMain">
      <NavBar />
      <img className="mainLogo" src={logo} alt="Maverick Logo" />
      <div className="login">
        <h1>LOGIN</h1>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <form onSubmit={handleLogin}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
