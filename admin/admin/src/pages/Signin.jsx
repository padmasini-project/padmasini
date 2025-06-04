import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 import useNavigate
import './Signin.css'; // Optional for styling

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // 👈 initialize navigate

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === 'admin' && password === '1234') {
      setMessage('Login successful!');
      setTimeout(() => {
        navigate('/adminhome'); // 👈 navigate to AdminHome
      }, 1000); // small delay so user can see the message
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
      {message && <p className="signin-message">{message}</p>}
    </div>
  );
};

export default SignIn;
