import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header";
import SignIn from "./SignIn"; // You should create this component
import HomePage from "./HomePage";
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        {/* Add other routes here */}
        <Route path="/home" element={<HomePage />} /> {/* ✅ Route after login */}
        
      </Routes>
      
    </Router>

  );
}

export default App;
