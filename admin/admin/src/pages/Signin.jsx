import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Signin.css';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Admin login fallback
    if (username === 'admin' && password === '1234') {
      const adminUser = {
        username: 'admin',
        role: 'admin',
        email: 'admin@example.com',
        phone: '0000000000',
      };
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      window.dispatchEvent(new Event('userLogin'));
      setMessage('Login successful!');
      setTimeout(() => {
        navigate('/adminhome');
      }, 300); // Wait before redirecting
      return;
    }

    // User login check
    const matchedUser = users.find(
      (user) => user.name === username && user.password === password
    );

    if (matchedUser) {
      if (!matchedUser.role) matchedUser.role = 'user';
      localStorage.setItem('currentUser', JSON.stringify(matchedUser));
      window.dispatchEvent(new Event('userLogin'));
      setMessage('Login successful!');
      navigate('/adminhome');
    } else {
      setMessage('Invalid username or password.');
      setLoading(false);
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

        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="toggle-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {loading ? (
          <div className="loading-spinner">Signing in...</div>
        ) : (
          <button type="submit">Sign In</button>
        )}
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
