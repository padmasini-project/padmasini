import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaSignOutAlt } from 'react-icons/fa';

import './Navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  const updateUser = () => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(storedUser);
  };

  useEffect(() => {
    // Always check server-side session to prevent showing old user
    fetch(`https://api-test.trilokinnovations.com/checkSession`, {
      method: "GET",
      credentials: 'include'
    })
      .then(resp => resp.json())
      .then(data => {
        if (data.status === 'pass') {
          const userData = {
            username: data.userName,
            phone: data.phoneNumber,
            role: data.role,
            courseType: data.coursetype,
            courseName: data.courseName,
            email: data.userGmail,
          };
          localStorage.setItem('currentUser', JSON.stringify(userData));
          setCurrentUser(userData);
        } else {
          localStorage.removeItem('currentUser');
          setCurrentUser(null);
        }
      })
      .catch(() => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
      });
  }, []);

  useEffect(() => {
    updateUser();
    window.addEventListener('userLogin', updateUser);
    window.addEventListener('userLogout', updateUser);
    window.addEventListener('storage', updateUser);

    return () => {
      window.removeEventListener('userLogin', updateUser);
      window.removeEventListener('userLogout', updateUser);
      window.removeEventListener('storage', updateUser);
    };
  }, []);

  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  const handleLogout = () => {
    fetch(`https://api-test.trilokinnovations.com/logout`, {
      method: "GET",
      credentials: 'include'
    })
      .then(resp => resp.text())
      .then(text => {
        if (text === 'pass' || text === 'failed') {
          localStorage.removeItem('currentUser');
          setCurrentUser(null);
          window.dispatchEvent(new Event('userLogout'));
          setDropdownOpen(false);
          navigate('/signin');
        }
      })
      .catch(() => {
        // Handle logout error gracefully
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        window.dispatchEvent(new Event('userLogout'));
        navigate('/signin');
      });
  };

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

      <ul className="navbar-links"></ul>

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
  <p><FaUser size={15} style={{ marginRight: '10px' }} /><strong>Name:</strong> {currentUser.username}</p>
  {currentUser.email && (
    <p><FaEnvelope size={15} style={{ marginRight: '10px' }} /><strong>Email:</strong> {currentUser.email}</p>
  )}
  {currentUser.phone && (
    <p><FaPhone size={15} style={{ marginRight: '10px' }} /><strong>Phone:</strong> {currentUser.phone}</p>
  )}
  <button onClick={handleLogout} className="logout-button">
    <FaSignOutAlt size={15} style={{ marginRight: '10px' }} /> Logout
  </button>
</div>

            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
