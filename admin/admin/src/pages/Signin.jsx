import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signin.css';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (username === 'admin' && password === '1234') {
      const adminUser = {
        username: 'admin',
        role: 'admin',
        email: 'admin@example.com',
        phone: '0000000000'
      };
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      setMessage('Login successful!');
      setTimeout(() => navigate('/adminhome'), 1000);
      return;
    }

    const matchedUser = users.find(
      (user) => user.username === username && user.password === password
    );

    if (matchedUser) {
      localStorage.setItem('currentUser', JSON.stringify(matchedUser));
      setMessage('Login successful!');
      setTimeout(() => navigate('/adminhome'), 1000);
    } else {
      setMessage('Invalid username or password.');
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit} className="signin-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
      {message && (
        <p className={`signin-message ${message === 'Login successful!' ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default SignIn;
