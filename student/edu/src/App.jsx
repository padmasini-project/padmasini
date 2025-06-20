import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import LoginPage from "./pages/LoginPage";
import ResetPassword from "./pages/ResetPassword";
import ContactUs from "./pages/ContactUs"; 
import Terms from "./pages/terms";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NEET from "./NEET/NEET";
import Physics from "./NEET/Physics";
import Chemistry from "./NEET/Chemistry";
import Zoology from "./NEET/Zoology";
import Botany from "./NEET/Botany";
import JEE from "./JEE/JEE";
import Physics1 from "./JEE/Physics1";
import Chemistry1 from "./JEE/Chemistry1";
import Maths from "./JEE/Maths";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/terms-and-conditions" element={<Terms />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPassword />} /> 
          <Route path="/home" element={<Home />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/neet" element={<NEET />} />
          <Route path="/physics" element={<Physics />} />
          <Route path="/chemistry" element={<Chemistry />} />
          <Route path="/zoology" element={<Zoology />} />
          <Route path="/botany" element={<Botany />} />
          <Route path="/jee" element={<JEE />} />
          <Route path="/physics1" element={<Physics1 />} />
          <Route path="/chemistry1" element={<Chemistry1 />} />
          <Route path="/maths" element={<Maths />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 