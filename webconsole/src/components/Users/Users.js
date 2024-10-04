import React from 'react';
import NavBar from '../Utils/NavBar';
import SideBar from '../Utils/SideBar';
import UserTable from './UserTable';
//import Pagination from './components/Pagination';
import './Users.css';

const Users = () => {
  return (
    <div className="user-container">
      <NavBar userLoggesIn="true" />
      <div className="user-content">
        <SideBar access="true" tab="users" />
        <div className="user-main-content">
          <UserTable />
        </div>
      </div>
    </div>
  );
};

export default Users;
