import React, { useState, useEffect } from 'react';
import './Table.css';
import SearchBar from '../Utils/SearchBar';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Paper } from '@mui/material';

const UserTable = () => {

  const columns: GridColDef[] = [
    {
      field: 'user',
      headerName: 'User',
      sortable: false,
      flex: 1,
      valueGetter: (value, row) => `${row.first_name || ''} ${row.last_name || ''}`,
    },
    { field: 'email', headerName: 'Email', flex: 0.7 },
    { field: 'updated_by', headerName: 'Updated By', flex: 0.5 },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0.3,
      renderCell: (user) => {
        console.log(user)
        return <button className="revoke-btn" onClick={() => revokeUser(user.admin_id)}>Revoke</button>;
      }
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };
  const [existingUsers, setExistingUsers] = useState([]);
  const [newUser, setNewUser] = useState("");

  const rows = existingUsers.map(user => {
    user.id = user.admin_id;
    return user;
  });

  useEffect(() => {
    getAllAdmins();
  }, []);

  const getAllAdmins = async () => {
    try {
      const response = await fetch('http://localhost:3030/getAdmins', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const admins = await response.json();
        setExistingUsers(admins);
      } else {
        alert("Failed to get all admin user");
      }
    } catch (error) {
      console.error("Error fetching admin users :", error);
      alert("Error fetching admin users");
    }
  };

  const revokeUser = async (userId) => {
    try {
      const response = await fetch('/api/revokeUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setExistingUsers(existingUsers.filter(user => user.admin_id !== userId)); // Remove the revoked user from state
        alert("User revoked successfully");
      } else {
        alert("Failed to revoke user");
      }
    } catch (error) {
      console.error("Error revoking user:", error);
      alert("Error revoking user");
    }
  };

  const addUser = async () => {
    try {
      const response = await fetch('/api/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: newUser, updatedBy: 'Dr. David' }),
      });

      if (response.ok) {
        const addedUser = await response.json();
        setExistingUsers([...existingUsers, addedUser]); // Add the new user to the state
        setNewUser(""); // Clear the input field
        alert("User added successfully");
      } else {
        alert("Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Error adding user");
    }
  };

  return (
    <div className="user-table">
      <div className='user-section'>
        <h3>Existing Admin Users</h3>
        <div className='user-content'>
          <button className="menu-btn" >Add User</button>
          <SearchBar />
        </div>

      </div>
      <Paper sx={{ height: 700, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[10, 20]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </div >
  );
};

export default UserTable;
