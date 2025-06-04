import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import logo from '../assets/logo.png';
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50); // threshold for background change
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <li className="dropdown">
          <div className="dropdown-toggle" onClick={() => setCoursesOpen(!coursesOpen)}>
            Courses {coursesOpen ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {coursesOpen && (
            <ul className="dropdown-menu">
              <li>
                <Link to="/NEET" onClick={() => { setMenuOpen(false); setCoursesOpen(false); }}>
                  NEET
                </Link>
              </li>
              <li>
                <Link to="/JEE" onClick={() => { setMenuOpen(false); setCoursesOpen(false); }}>
                  JEE
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <Link to="/login" onClick={() => setMenuOpen(false)}>Sign in</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
