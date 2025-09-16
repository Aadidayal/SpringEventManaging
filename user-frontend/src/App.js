import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

// Protected Route Component
function ProtectedRoute({ children }) {
  const isAuthed = !!localStorage.getItem('authUser');
  return isAuthed ? children : <Navigate to="/login" replace />;
}

// Dashboard Router - determines which dashboard to show based on user role
function DashboardRouter() {
  const authUser = localStorage.getItem('authUser');
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(authUser);
  // Check if user is admin (you can modify this logic based on your needs)
  // For now, let's check if the email contains 'admin' or firstName is 'admin'
  const isAdmin = user.email?.toLowerCase().includes('admin') || 
                  user.firstName?.toLowerCase() === 'admin';

  return isAdmin ? <AdminDashboard /> : <UserDashboard />;
}

// Main App Component
function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;