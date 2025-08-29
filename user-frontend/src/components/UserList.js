import React from 'react';
import './UserList.css';

const UserList = ({ users, onDeleteUser, onEditUser, onRefresh, loading }) => {
  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h2>Users List ({users.length})</h2>
        <button onClick={onRefresh} disabled={loading} className="refresh-btn">
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      
      {users.length === 0 ? (
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
                  disabled={loading}
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDeleteUser(user.id)}
                  className="delete-btn"
                  disabled={loading}
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
