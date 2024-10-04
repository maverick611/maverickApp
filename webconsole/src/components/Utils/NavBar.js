import React, { useState } from 'react';
import logo from '../../resources/images/logo.png';
import { FaUser } from 'react-icons/fa';
import './NavBar.css';

const NavBar = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(props.userLoggesIn); 
  const [username, setUsername] = useState("Dr. David"); 
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Maverick Logo" />
      </div>
      <div className="navbar-links">
        {isLoggedIn ? (
          <div className="user-info">
            <FaUser /> <span>{username}</span>
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
