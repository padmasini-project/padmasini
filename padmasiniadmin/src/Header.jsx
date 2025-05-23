import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  window.addEventListener("scroll", function () {
    const header = document.getElementById("myHeader");
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
  
  return (
    <header className="new-header" id="myHeader">
      <div className="logo">
      <Link to="/"><img src="1 - Copy.png" alt="Padmasini" /></Link>
        
      </div>

      <button 
        className="menu-toggle" 
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      <nav className={menuOpen ? "nav-menu show" : "nav-menu"}>
        <ul>
          <li>
            <Link to="/signIn">Sign-in</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
