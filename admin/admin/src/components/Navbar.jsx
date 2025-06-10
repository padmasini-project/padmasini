import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  // Function to update user from localStorage
  const updateUser = () => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(storedUser);
  };

  // Load current user and listen for login/logout events
  useEffect(() => {
    updateUser();

    // Listen for custom login/logout events
    window.addEventListener('userLogin', updateUser);
    window.addEventListener('userLogout', updateUser);

    // Optional: update on localStorage change (cross-tab sync)
    window.addEventListener('storage', updateUser);

    return () => {
      window.removeEventListener('userLogin', updateUser);
      window.removeEventListener('userLogout', updateUser);
      window.removeEventListener('storage', updateUser);
    };
  }, []);

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setDropdownOpen(false);
    window.dispatchEvent(new Event('userLogout')); // Notify others
    navigate('/signin');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>
      </div>

      <ul className="navbar-links">{/* Add links if needed */}</ul>

      <div className="navbar-signin">
        {!currentUser ? (
          <Link to="/signin" className="signin-button">Sign In</Link>
        ) : (
          <div className="user-dropdown" ref={dropdownRef}>
            <button className="user-button" onClick={toggleDropdown}>
              {currentUser.username}
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <p><strong>Name:</strong> {currentUser.username}</p>
                {currentUser.email && <p><strong>Email:</strong> {currentUser.email}</p>}
                {currentUser.phone && <p><strong>Phone:</strong> {currentUser.phone}</p>}
                <button onClick={handleLogout} className="logout-button">Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
