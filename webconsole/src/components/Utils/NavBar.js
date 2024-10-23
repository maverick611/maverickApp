import React, { useState } from 'react';
import logo from '../../resources/images/logo.png';
import { FaUser } from 'react-icons/fa';
import './NavBar.css';
import { useNavigate } from 'react-router-dom';

const NavBar = (props) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(props.userLoggesIn);

  const handleLogout = () => {
    setIsLoggedIn(!isLoggedIn)
    navigate('/');
  }
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Maverick Logo" />
      </div>
      <div className="navbar-links">
        {isLoggedIn ? (
          <div className="nav-btns">
            <FaUser className='nav-user' /> <span className='nav-user'>{props.username}</span>
            <button className="login-btn" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button className="login-btn">
            <FaUser /> <span>Login</span>
          </button>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
