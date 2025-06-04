import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from './components/Footer';
import Signin from './pages/Signin';
import AdminHome from './pages/AdminHome'; // Assuming you have this page
import AdminRight from './pages/AdminRight';
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/adminhome" element={<AdminHome />} />
          <Route path="/adminright" element={<AdminRight />} />
          {/* Add more routes as needed */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 