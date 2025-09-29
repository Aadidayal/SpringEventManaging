import React, { useState } from 'react';
import './UserForm.css';

const UserForm = ({ onUserCreated, loading }) => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!user.firstName || !user.lastName || !user.email || !user.password) {
      alert('Please fill all required fields');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(user.password)) {
      alert('Password must meet all requirements:\n• At least 8 characters\n• 1 uppercase letter\n• 1 lowercase letter\n• 1 number\n• 1 special character (@$!%*?&)');
      return;
    }
    
    onUserCreated(user);
    
    // Reset form
    setUser({
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    });
  };

  return (
    <div className="user-form-container">
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit} className="user-form">
        <input
          type="text"
          name="firstName"
          placeholder="First Name *"
          value={user.firstName}
          onChange={handleChange}
          disabled={loading}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name *"
          value={user.lastName}
          onChange={handleChange}
          disabled={loading}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email *"
          value={user.email}
          onChange={handleChange}
          disabled={loading}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password *"
          value={user.password}
          onChange={handleChange}
          disabled={loading}
          required
          title="Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character"
        />
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px', textAlign: 'left' }}>
          <strong>Password Requirements:</strong>
          <ul style={{ margin: '5px 0', paddingLeft: '20px', color: '#888' }}>
            <li>At least 8 characters</li>
            <li>1 uppercase letter (A-Z)</li>
            <li>1 lowercase letter (a-z)</li>
            <li>1 number (0-9)</li>
            <li>1 special character (@$!%*?&)</li>
          </ul>
        </div>
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Adding...' : 'Add User'}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
