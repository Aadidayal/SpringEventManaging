import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import './Auth.css';

export default function Signup() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    console.log('Signup form data:', { firstName, lastName, email, password: '***' });
    
    try {
      const result = await userService.signup({ firstName, lastName, email, password });
      console.log('Signup successful:', result);
      alert('Account created successfully! Please login.');
      navigate('/login');
    } catch (err) {
      console.error('Signup failed:', err);
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
            placeholder="First Name" 
            value={firstName} 
            onChange={e => setFirstName(e.target.value)} 
            required
          />
          <input 
            className="auth-input" 
            placeholder="Last Name" 
            value={lastName} 
            onChange={e => setLastName(e.target.value)} 
            required
          />
          <input 
            className="auth-input" 
            placeholder="Email" 
            type="email"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required
          />
          <input 
            className="auth-input" 
            placeholder="Password" 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required
          />
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px', textAlign: 'left' }}>
            Password must contain:
            <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
              <li>At least 8 characters</li>
              <li>1 uppercase letter (A-Z)</li>
              <li>1 lowercase letter (a-z)</li>
              <li>1 number (0-9)</li>
              <li>1 special character (@$!%*?&)</li>
            </ul>
          </div>
          <button className="auth-button" type="submit">Create account</button>
        </form>
        <button className="auth-link" onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    </div>
  );
}


