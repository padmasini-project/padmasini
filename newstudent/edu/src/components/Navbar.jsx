import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaSignOutAlt,
} from "react-icons/fa";
import logo from "../assets/logo.png";
import { useUser } from "./UserContext"; // ✅ Make sure this path is correct
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const { user, logout } = useUser(); // ✅ Use user from context

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout(); // ✅ calls context logout
    setUserDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="logo">
        <Link to="/home" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="NEET APP Logo" />
        </Link>
      </div>

      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <ul className={menuOpen ? "nav-links active" : "nav-links"}>
        {user && (
          <li className="dropdown">
            <div
              className="dropdown-toggle"
  onClick={() => {
    setCoursesOpen((prev) => !prev);
    setUserDropdownOpen(false); // close other dropdown
  }}
            >
              Courses {coursesOpen ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {coursesOpen && (
  <ul className="dropdown-menu">
    {user.courseName?.toUpperCase() === "NEET" && (
      <li>
        <Link
          to="/NEET"
          onClick={() => {
            setMenuOpen(false);
            setCoursesOpen(false);
          }}
        >
          NEET
        </Link>
      </li>
    )}
    {user.courseName?.toUpperCase() === "JEE" && (
      <li>
        <Link
          to="/JEE"
          onClick={() => {
            setMenuOpen(false);
            setCoursesOpen(false);
          }}
        >
          JEE
        </Link>
      </li>
    )}
  </ul>
)}

          </li>
        )}

        <li className="dropdown">
          {user ? (
            <div
              className="dropdown-toggle"
onClick={() => {
    setUserDropdownOpen((prev) => !prev);
    setCoursesOpen(false); // close other dropdown
  }}
            >
              Hi, {user.firstname}{" "}
              {userDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
            </div>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Sign in
            </Link>
          )}

         {userDropdownOpen && user && (
  <ul className="dropdown-menu user-details-dropdown">
    <div className="user-details-header">
      <li><strong>Name:</strong> {user.firstname} {user.lastname}</li>
      <li><strong>Email:</strong> {user.email}</li>
      <li><strong>Mobile:</strong> {user.mobile}</li>
      <li><strong>Role:</strong> {user.role?.toUpperCase()}</li>
      <li><strong>Standard:</strong> {user.standard}</li>
   

    {/* Upgrade Plan Button */}
    <li>
      <button
        className="upgrade-btn"
        onClick={() => {
          setUserDropdownOpen(false); // close dropdown
          navigate("/register?step=3");
        }}
      >
        🪙 Upgrade Plan
      </button>
    </li>
 </div>
    {/* Logout Button */}
    <li>
      <button className="logout-btn" onClick={handleLogout}>
        <FaSignOutAlt style={{ marginRight: "8px" }} />
        Logout
      </button>
    </li>
  </ul>
)}

        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
