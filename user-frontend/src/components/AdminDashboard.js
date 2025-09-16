import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

// Import the existing components
import UserForm from './UserForm';
import UserList from './UserList';
import UserEditModal from './UserEditModal';
import EventManagement from './EventManagement';
import Message from './Message';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState('events');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get user info and verify admin status
    const authUser = localStorage.getItem('authUser');
    if (authUser) {
      const userData = JSON.parse(authUser);
      setUser(userData);
      
      // Check if user is admin
      const adminStatus = userData.email?.toLowerCase().includes('admin') || 
                         userData.firstName?.toLowerCase() === 'admin';
      setIsAdmin(adminStatus);
      
      // If not admin, redirect to user dashboard
      if (!adminStatus) {
        showMessage('Access denied. Redirecting to user dashboard...', 'error');
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authUser');
    navigate('/login');
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleUserCreated = () => {
    showMessage('User created successfully!', 'success');
    setRefreshTrigger(prev => prev + 1); // Trigger refresh
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    showMessage('Data refreshed!', 'info');
  };

  // If not admin, show access denied
  if (!isAdmin && user) {
    return (
      <div className="admin-dashboard">
        <div className="access-denied-container">
          <div className="access-denied-content">
            <h2>🚫 Access Denied</h2>
            <p>You don't have admin privileges.</p>
            <p>Redirecting to user dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="brand">
            <h1>⚙️ Admin Dashboard</h1>
          </div>
          <div className="user-section">
            <span className="welcome-text">Admin Portal</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="admin-navigation">
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${activeModule === 'events' ? 'active' : ''}`}
            onClick={() => setActiveModule('events')}
          >
            <span className="nav-icon">📅</span>
            Manage Events
          </button>
          <button 
            className={`nav-tab ${activeModule === 'users' ? 'active' : ''}`}
            onClick={() => setActiveModule('users')}
          >
            <span className="nav-icon">👥</span>
            Manage Users
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="admin-content">
        {message.text && (
          <Message 
            message={message.text} 
            type={message.type}
            onClose={() => setMessage({ text: '', type: '' })}
          />
        )}

        {/* Event Management Module */}
        {activeModule === 'events' && (
          <div className="module-container">
            <div className="content-header">
              <h2 className="content-title">Event Management</h2>
              <p className="content-description">Create, view, and manage all events</p>
            </div>
            <EventManagement />
          </div>
        )}

        {/* User Management Module */}
        {activeModule === 'users' && (
          <div className="module-container">
            <div className="content-header">
              <h2 className="content-title">User Management</h2>
              <p className="content-description">Add new users and manage existing accounts</p>
            </div>
            
            <div className="user-management-content">
              <div className="user-form-section">
                <UserForm 
                  onUserCreated={handleUserCreated}
                  loading={loading}
                />
              </div>
              
              <div className="user-list-section">
                <UserList 
                  refresh={refreshTrigger}
                  onRefresh={handleRefresh}
                  onDeleteUser={(id) => {
                    showMessage('User deleted successfully!', 'success');
                    setRefreshTrigger(prev => prev + 1);
                  }}
                  onEditUser={(user) => {
                    showMessage(`Editing user: ${user.firstName} ${user.lastName}`, 'info');
                  }}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}