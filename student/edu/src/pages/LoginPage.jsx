import React, { useState, useEffect } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";

// ✅ Use placeholder if image import fails (use fallback URLs in case Render fails to resolve local paths)
import loginIllustration from "../assets/loginIllustration.jpg";
import whatsappIcon from "../assets/WhatsApp_icon.png";

const LoginPage = () => {
  const [email, setEmail] = useState("demo@student.com");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const demoUser = {
      firstname: "Demo",
      lastname: "Student",
      email: "demo@student.com",
      password: "demo1234",
      mobile: "1234567890",
      role: "neet"
    };

    const storedUser = localStorage.getItem("registeredUser");
    if (!storedUser) {
      localStorage.setItem("registeredUser", JSON.stringify(demoUser));
      console.log("✅ Demo user created:", demoUser);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    const demoEmail = "demo@student.com";
    const demoPassword = "demo1234";
    const storedUser = JSON.parse(localStorage.getItem("registeredUser"));

    if (email === demoEmail && password === demoPassword) {
      alert("✅ Demo login successful!");
      navigate("/neet");
      return;
    }

    if (!storedUser) {
      alert("No registered user found. Please register first.");
      return;
    }

    if (storedUser.email === email && storedUser.password === password) {
      alert("✅ Login successful!");
      if (storedUser.role === "jee") navigate("/jee");
      else if (storedUser.role === "neet") navigate("/neet");
      else navigate("/subjects");
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
      {/* Left Section */}
      <div className="login-illustration">
        <img
          src={loginIllustration || "https://via.placeholder.com/400x300"}
          alt="Login Illustration"
        />
        <h1>Welcome Back</h1>
        <p>Log in to continue learning and exploring!</p>
      </div>

      {/* Right Section */}
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

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/8248791389"
        className="whatsapp-chat-button"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
      >
        <img
          src={whatsappIcon || "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"}
          alt="WhatsApp"
          className="whatsapp-icon"
        />
        <span>Chat with us on WhatsApp</span>
      </a>
    </div>
  );
};

export default LoginPage;
