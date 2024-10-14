import React, { useState, useEffect } from 'react';
import './Table.css';
import SearchBar from '../Utils/SearchBar';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Paper } from '@mui/material';
import DialogComponent from '../Utils/Dialog';

const UserTable = (props) => {

  const columns: GridColDef[] = [
    {
      field: 'user',
      headerName: 'User',
      sortable: false,
      flex: 1,
      valueGetter: (value, row) => row.first_name ? `${row.first_name || ''} ${row.last_name || ''}` : row.username,
    },
    { field: 'email', headerName: 'Email', flex: 0.7 },
    { field: 'updated_by', headerName: 'Updated By', flex: 0.5 },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0.3,
      renderCell: (user) => {
        console.log(user)
        return <button className="revoke-btn" onClick={() => setDialogDelete({ open: true, message: `Are sure you want to delete ${user.row.username}?`, data: user.row.username })}>Revoke</button>;
      }
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  const [dialog, setDialog] = useState({ open: false, message: '' });
  const [dialogDelete, setDialogDelete] = useState({ open: false, message: '' });
  const [existingUsers, setExistingUsers] = useState([]);
  const [newUser, setNewUser] = useState("")

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

  const revokeUser = async (username) => {
    try {
      const response = await fetch(`http://localhost:3030/deleteAdmin/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setExistingUsers(existingUsers.filter(user => user.username !== username)); // Remove the revoked user from state
        setNewUser("")
        alert("User revoked successfully");
      } else {
        alert("Failed to revoke user");
      }
    } catch (error) {
      console.error("Error revoking user:", error);
      alert("Error revoking user");
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch('http://localhost:3030/addAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: newUser, updatedBy: props.username }),
      });

      if (response.ok) {
        const addedUser = await response.json();
        setExistingUsers([...existingUsers, addedUser]); // Add the new user to the state
        alert("User added successfully");
      } else {
        alert("Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Error adding user");
    }
  };

  const handleCancelUser = () => {
    setDialog({ open: false, message: "" });
  };

  return (
    <div className="user-table">
      <div className='user-section'>
        <h3>Existing Admin Users</h3>
        <div className='user-content'>
          <button className="menu-btn" onClick={() => setDialog({ open: true, message: `Add User` })}>Add User</button>
          <SearchBar />
        </div>
        {dialog.open && <DialogComponent openDialog={dialog.open} alertMessage={dialog.message} no={"Cancel"} yes={"Add"} action={handleAddUser} cancel={handleCancelUser} >
          <form className='user-form' >
            <div>
              <div >
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" onChange={(e) => setNewUser(e.target.value)} />
              </div>
              <h3>OR</h3>
              <div >
                <label htmlFor="email">Email</label>
                <input type="text" id="email" name="email" />
              </div>
            </div>
          </form>
        </DialogComponent>}
      </div>
      {dialogDelete.open && <DialogComponent openDialog={dialogDelete.open} alertMessage={dialogDelete.message} data={dialogDelete.data} no={"No"} yes={"Yes"} action={revokeUser} cancel={handleCancelUser} />}
      <Paper sx={{ height: 700, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[10, 20]}
          sx={{ border: 0 }}
        />
      </Paper>
    </div >
  );
};

export default UserTable;
