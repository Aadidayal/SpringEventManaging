import React, { useState } from 'react';
import './UserEditModal.css';

const UserEditModal = ({ user, onClose, onUpdate, loading }) => {
  const [editUser, setEditUser] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: '' // Keep password empty for security
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editUser.firstName || !editUser.lastName || !editUser.email) {
      alert('Please fill all required fields');
      return;
    }
    onUpdate(user.id, editUser);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit User</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label>First Name *</label>
            <input
              type="text"
              name="firstName"
              value={editUser.firstName}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={editUser.lastName}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={editUser.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label>New Password (optional)</label>
            <input
              type="password"
              name="password"
              value={editUser.password}
              onChange={handleChange}
              disabled={loading}
              placeholder="Leave empty to keep current password"
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="update-btn" disabled={loading}>
              {loading ? 'Updating...' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;
