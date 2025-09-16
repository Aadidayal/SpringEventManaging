import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import './UserList.css';

const UserList = ({ onDeleteUser, onEditUser, onRefresh, loading, refresh }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const userData = await userService.getAllUsers();
      setUsers(userData || []);
    } catch (err) {
      setError('Failed to load users. Please check if the backend is running.');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refresh]);

  const handleRefresh = () => {
    fetchUsers();
    if (onRefresh) onRefresh();
  };

  const handleDeleteUser = async (userId) => {
    try {
      await userService.deleteUser(userId);
      if (onDeleteUser) onDeleteUser(userId);
      fetchUsers(); // Refresh the list after deletion
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h2>Users List ({users.length})</h2>
        <button onClick={handleRefresh} disabled={isLoading || loading} className="refresh-btn">
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="no-users">
          <p>No users found.</p>
          <p>Add some users or check if Spring Boot is running on port 8080.</p>
        </div>
      ) : (
        <div className="users-grid">
          {users.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <div className="user-name">
                  {user.firstName} {user.lastName}
                </div>
                <div className="user-email">{user.email}</div>
                <div className="user-id">ID: {user.id}</div>
              </div>
              <div className="user-actions">
                <button 
                  onClick={() => onEditUser(user)}
                  className="edit-btn"
                  disabled={isLoading || loading}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteUser(user.id)}
                  className="delete-btn"
                  disabled={isLoading || loading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;
