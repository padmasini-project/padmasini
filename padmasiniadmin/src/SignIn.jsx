import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css"; // Optional, for styling

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Dummy credentials
    if (username === "admin" && password === "1234") {
      navigate("/home"); // Redirect to HomePage
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="signin-container">
      <h1>Sign In</h1>
      <form onSubmit={handleLogin} className="signin-form">
        <input
          type="text"
          placeholder="admin"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="1234"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Login</button>
        {error && <p className="error-msg">{error}</p>}
      </form>
    </div>
  );
}

export default SignIn;
