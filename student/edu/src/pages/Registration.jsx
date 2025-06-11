import React, { useState, useEffect } from "react";
import "./Registration.css";
import { Link, useNavigate } from "react-router-dom";
import registerIllustration from "../assets/registerillustration.jpg";
import whatsappIcon from "../assets/WhatsApp_icon.png"; // Adjust path if needed

const Registration = () => {
  const [firstname, setUsername] = useState("");
  const [lastname, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mobile, setMobile] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on load
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  const handleRegistration = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    } else {
      setEmailError("");
    }

    if (!validateMobile(mobile)) {
      setMobileError("Please enter a valid 10-digit mobile number.");
      return;
    } else {
      setMobileError("");
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const userData = { firstname, lastname, email, mobile, password };
    localStorage.setItem("registeredUser", JSON.stringify(userData));

    alert("Registered successfully!");
    navigate("/studentdetails");
  };

  return (
    <div className="registration-container">
      {/* Left Section */}
      <div className="registration-illustration">
        <img src={registerIllustration} alt="Register Illustration" />
        <h1>Welcome to Our Platform</h1>
        <p>Join us to explore amazing features and opportunities!</p>
      </div>

      {/* Right Section */}
      <div className="registration">
        <h2>Register Now</h2>
        <div className="form-box">
          <form onSubmit={handleRegistration}>
            <div className="name-container">
              <input
                type="text"
                placeholder="Student First Name"
                value={firstname}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="half-width"
              />
              <input
                type="text"
                placeholder="Student Last Name"
                value={lastname}
                onChange={(e) => setStudentName(e.target.value)}
                required
                className="half-width"
              />
            </div>

            <input
              type="email"
              placeholder="Email Id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {emailError && <span className="error-message">{emailError}</span>}

            <input
              type="tel"
              placeholder="Mobile No."
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
            {mobileError && <span className="error-message">{mobileError}</span>}

            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="password-input"
              />
              <span
                className="icon inside"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁" : "🙈"}
              </span>
            </div>

            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="password-input"
              />
              <span
                className="icon inside"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁" : "🙈"}
              </span>
            </div>

            <div className="form-actions">
              <div className="checkbox-container">
                <input type="checkbox" id="agree" name="agree" required />
                <label htmlFor="agree">
                  I have agreed to then  <Link to="/terms" className="footer-link">
                    Terms and Conditions
        </Link>
                </label>
              </div>

              <button type="submit">Register</button>

              <p className="login-text">
                Already have an account?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>
                  Login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* WhatsApp Chat */}
     <a
       href="https://wa.me/YOUR_PHONE_NUMBER"
       className="whatsapp-chat-button"
       target="_blank"
       rel="noopener noreferrer"
       aria-label="Chat with us on WhatsApp"
     >
       <img
         src={whatsappIcon}
         alt="WhatsApp"
         className="whatsapp-icon"
       />
       <span>Chat with us on whatsapp</span>
     </a>
    </div>
  );
};

export default Registration;
