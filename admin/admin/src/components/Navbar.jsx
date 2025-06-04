import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png'; // Adjust the path if needed

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>
      </div>
      <ul className="navbar-links">
        {/* You can add navigation links here if needed */}
      </ul>
      <div className="navbar-signin">
        <Link to="/signin" className="signin-button">Sign In</Link>
      </div>
    </nav>
  );
};

export default Navbar;
