import React from 'react';
import {useNavigate} from 'react-router-dom';
import logo from '../../resources/images/logo.png';
import NavBar from '../Utils/NavBar';
import './Login.css';

const Login = (props, context) => {
  const navigate = useNavigate();
  return (
  <div className="loginMain">
    <NavBar />
    <img className="mainLogo" src={logo} alt="Maverick Logo" />
    <div className="login">
          <h1>LOGIN</h1>
          <form>
            <label>Username</label>
            <input type="text" name="username" />
            <label>Password</label>
            <input type="password" name="password" />
            <button type="submit" onClick={() => navigate('/profile')}>Login</button>
          </form>
          <p>Not yet registered? Sign up now</p>
        </div>
  </div>
  );
}

export default Login;
