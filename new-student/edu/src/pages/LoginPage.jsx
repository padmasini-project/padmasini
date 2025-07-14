// LoginPage.jsx
import React, { useState, useEffect } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/UserContext";
import loginIllustration from "../assets/loginIllustration.jpg";
import whatsappIcon from "../assets/WhatsApp_icon.png";

const LoginPage = () => {
  const [email, setEmail] = useState("demo@student.com");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

const handleLogin = (e) => {
  e.preventDefault();

  const demoUser = {
  firstname: "Demo",
  lastname: "Student",
  email: "demo@student.com",
  password: "demo1234",
  mobile: "1234567890",
  role: "jee_neet",               // 👈 supports both JEE + NEET
  courseType: "BOTH",             // 👈 for filters (if needed)
  courseName: "both",             // 👈 important for access control
  standard: "12th",
  plan: "monthly",
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
};
  const storedUser = JSON.parse(localStorage.getItem("registeredUser") || "{}");
  if (email === demoUser.email && password === demoUser.password) {
    login(demoUser);
    alert("✅ Demo login successful!");
    navigate("/home"); // 👈 navigates to /neet
  } else if (email === storedUser.email && password === storedUser.password) {
    login(storedUser);
    alert(`✅ Login successful! Welcome ${storedUser.firstname}`);
    if (storedUser.role === "neet") {
      navigate("/neet");
    } else if (storedUser.role === "jee") {
      navigate("/jee");
    } else if (storedUser.role === "jee_neet") {
    navigate("/home"); }
  } else {
    alert("❌ Invalid email or password");
  }
};

  const handleForgotPassword = () => {
    if (email) {
      alert(`🔗 Password reset link sent to ${email}`);
      navigate("/reset-password");
    } else {
      alert("Please enter your email first");
    }
  };

  return (
    <div className="login-container">
      <div className="login-illustration">
        <img src={loginIllustration} alt="Login Illustration" />
        <h1>Welcome Back</h1>
        <p>Log in to continue learning and exploring!</p>
      </div>

      <div className="login">
        <h2>Student Login</h2>
        <div className="login-form-box">
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="icon inside"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁" : "🙈"}
              </span>
            </div>
            <div className="form-actions">
              <button type="submit">Login</button>
              <p className="forgot-password" onClick={handleForgotPassword}>
                Forgot Password?
              </p>
              <p className="login-text">
                Don't have an account?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/register");
                  }}
                >
                  Register
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
      <a
        href="https://wa.me/8248791389"
        className="whatsapp-chat-button"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={whatsappIcon} alt="WhatsApp" className="whatsapp-icon" />
        <span>Chat with us on WhatsApp</span>
      </a>
    </div>
  );
};

export default LoginPage;
