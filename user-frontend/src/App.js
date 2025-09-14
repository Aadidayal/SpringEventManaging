import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import UserEditModal from './components/UserEditModal';
import EventManagement from './components/EventManagement';
import Login from './components/Login';
import Signup from './components/Signup';
import Message from './components/Message';
import userService from './services/userService';
import './App.css';

function MainApp() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [activeModule, setActiveModule] = useState('users'); // 'users' or 'events'

  // Show message with auto-dismiss
  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 5000);
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersData = await userService.getAllUsers();
      setUsers(usersData);
      showMessage('Users loaded successfully!', 'success');
    } catch (error) {
      showMessage('Error fetching users. Make sure Spring Boot is running on port 8080.', 'error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new user
  const handleUserCreated = async (newUser) => {
    try {
      setLoading(true);
      await userService.createUser(newUser);
      showMessage('User created successfully!', 'success');
      fetchUsers(); // Refresh the list
    } catch (error) {
      showMessage('Error creating user. Email might already exist.', 'error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update user
  const handleUserUpdated = async (id, updatedUser) => {
    try {
      setLoading(true);
      // Only send password if it's provided
      const userToUpdate = { ...updatedUser };
      if (!userToUpdate.password) {
        delete userToUpdate.password;
      }
      
      await userService.updateUser(id, userToUpdate);
      showMessage('User updated successfully!', 'success');
      setEditingUser(null); // Close the modal
      fetchUsers(); // Refresh the list
    } catch (error) {
      showMessage('Error updating user. Email might already exist.', 'error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      setLoading(true);
      await userService.deleteUser(id);
      showMessage('User deleted successfully!', 'success');
      fetchUsers(); // Refresh the list
    } catch (error) {
      showMessage('Error deleting user.', 'error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal
  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  // Close edit modal
  const handleCloseEdit = () => {
    setEditingUser(null);
  };

  // Load users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authUser');
    navigate('/login');
  };

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1100px' }}>
          <h1>🎯 Spring Event System</h1>
          <button onClick={handleLogout} className="module-btn" style={{ padding: '10px 16px' }}>Logout</button>
        </div>
        <p className="app-subtitle">Complete User & Event Management</p>
        
        <Message 
          message={message.text} 
          type={message.type}
          onClose={() => setMessage({ text: '', type: '' })}
        />

        {/* Module Navigation */}
        <div className="module-navigation">
          <button 
            className={`module-btn ${activeModule === 'users' ? 'active' : ''}`}
            onClick={() => setActiveModule('users')}
          >
            👥 User Management
          </button>
          <button 
            className={`module-btn ${activeModule === 'events' ? 'active' : ''}`}
            onClick={() => setActiveModule('events')}
          >
            📅 Event Management
          </button>
        </div>

        {/* User Management Module */}
        {activeModule === 'users' && (
          <div className="user-module">
            <UserForm 
              onUserCreated={handleUserCreated}
              loading={loading}
            />

            <UserList 
              users={users}
              onDeleteUser={handleDeleteUser}
              onEditUser={handleEditUser}
              onRefresh={fetchUsers}
              loading={loading}
            />

            {editingUser && (
              <UserEditModal
                user={editingUser}
                onClose={handleCloseEdit}
                onUpdate={handleUserUpdated}
                loading={loading}
              />
            )}
          </div>
        )}

        {/* Event Management Module */}
        {activeModule === 'events' && (
          <div className="event-module">
            <EventManagement />
          </div>
        )}
      </header>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const isAuthed = !!localStorage.getItem('authUser');
  return isAuthed ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<ProtectedRoute><MainApp /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
