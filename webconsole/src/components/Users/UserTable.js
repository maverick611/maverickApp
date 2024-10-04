import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import './Table.css';

const UserTable = () => {
  const [existingUsers, setExistingUsers] = useState([
    { id: 1, user: "Dr. David", updatedBy: "System", role: "Super User" },
    { id: 2, user: "Chris J", updatedBy: "Dr. David", role: "Resources" },
    { id: 3, user: "Omar", updatedBy: "Dr. David", role: "Resources" },
    { id: 4, user: "Dr. David", updatedBy: "System", role: "Super User" },
    { id: 5, user: "Chris J", updatedBy: "Dr. David", role: "Resources" },
    { id: 6, user: "Omar", updatedBy: "Dr. David", role: "Resources" },
    { id: 7, user: "Dr. David", updatedBy: "System", role: "Super User" },
    { id: 8, user: "Chris J", updatedBy: "Dr. David", role: "Resources" },
    { id: 9, user: "Omar", updatedBy: "Dr. David", role: "Resources" },
  ]);
  const [newUser, setNewUser] = useState("");
  const BarStyle = { width: "20rem", background: "white", border: "1px solid", margin: "0.5rem", padding: "0.5rem" };

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
        setExistingUsers(existingUsers.filter(user => user.id !== userId)); // Remove the revoked user from state
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
      <h3>Existing Users</h3>
      <span className='user-search'>
        <FaSearch />
        <input
          style={BarStyle}
          key="search-bar"
          placeholder={"search with keywords"}
        />
      </span>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Users</th>
            <th>Updated By</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {existingUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td className='user-column'>{user.user}</td>
              <td>{user.updatedBy}</td>
              <td><button className="revoke-btn" onClick={() => revokeUser(user.id)}> Revoke</button></td>
            </tr>
          ))}
          <tr>
            <td>{existingUsers.length + 1}</td>
            <td>
              <input
                placeholder="Add User"
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
              />
            </td>
            <td>Dr. David</td>
            <td>
              <button className="add-btn" onClick={addUser}>Add User</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div >
  );
};

export default UserTable;
