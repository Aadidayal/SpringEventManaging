import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import './Auth.css';

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await userService.signup({ username, email, password });
      alert('Account created successfully! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Signup</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <input 
            className="auth-input" 
            placeholder="Username" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
          />
          <input 
            className="auth-input" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
          <input 
            className="auth-input" 
            placeholder="Password" 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
          <button className="auth-button" type="submit">Create account</button>
        </form>
        <button className="auth-link" onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    </div>
  );
}


