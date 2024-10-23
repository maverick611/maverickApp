import React from 'react';
import logo from '../../resources/images/logo.png';  // Assuming this is the correct path for your logo
import NavBar from '../Utils/NavBar';
import './Signup.css';

const Signup = () => {
  return (
    <div className="loginMain">
      <NavBar />
      <img className="mainLogo" src={logo} alt="Maverick Logo" />
      <div className="form-container">
        <h2>Let's Get Started!</h2>
        <form>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName"><i className="fas fa-user"></i> First Name</label>
              <input type="text" id="firstName" name="firstName" />
            </div>
            <div className="form-group">
              <label htmlFor="username"><i className="fas fa-user"></i> Username</label>
              <input type="text" id="username" name="username" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lastName"><i className="fas fa-user"></i> Last Name</label>
              <input type="text" id="lastName" name="lastName" />
            </div>
            <div className="form-group">
              <label htmlFor="dob"><i className="fas fa-calendar"></i> Date of Birth</label>
              <input type="date" id="dob" name="dob" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone"><i className="fas fa-phone"></i> Phone Number</label>
              <input type="tel" id="phone" name="phone" />
            </div>
            <div className="form-group">
              <label htmlFor="email"><i className="fas fa-envelope"></i> Email</label>
              <input type="email" id="email" name="email" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password"><i className="fas fa-lock"></i> Password</label>
              <input type="password" id="password" name="password" />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword"><i className="fas fa-lock"></i> Confirm Password</label>
              <input type="password" id="confirmPassword" name="confirmPassword" />
            </div>
          </div>
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
