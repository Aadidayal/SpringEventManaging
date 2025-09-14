import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await userService.login({ email, password });
      localStorage.setItem('authUser', JSON.stringify(user));
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Login</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <input className="auth-input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="auth-input" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="auth-button" type="submit">Login</button>
        </form>
        <button className="auth-link" onClick={() => navigate('/signup')}>Go to Signup</button>
      </div>
    </div>
  );
}


