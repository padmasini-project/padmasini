// EditUser.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/UserContext";

const EditUser = () => {
  const navigate = useNavigate();
  const { currentUser, login, logout } = useUser();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    photo: ""
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  // Load user data
  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstname: currentUser.firstname || "",
        lastname: currentUser.lastname || "",
        email: currentUser.email || "",
        mobile: currentUser.mobile || "",
        photo: currentUser.photo || ""
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save profile changes
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:3000/updateUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        login(data.updatedUser || formData);
        localStorage.setItem("currentUser", JSON.stringify(data.updatedUser || formData));
        navigate(-1);
      })
      .catch(console.error);
  };

  // Step 1: Request OTP for deactivation
  const requestDeactivation = () => {
    if (!window.confirm("Are you sure you want to deactivate your account?")) return;

    fetch("http://localhost:3000/sendDeactivationOtp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email: currentUser.email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("OTP sent to your email. Please verify.");
          setOtpSent(true);
        } else {
          alert("Failed to send OTP. Try again.");
        }
      })
      .catch(console.error);
  };

  // Step 2: Verify OTP and deactivate
  const verifyOtpAndDeactivate = () => {
    fetch("http://localhost:3000/verifyDeactivationOtp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email: currentUser.email, otp }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Account deactivated successfully.");
          logout(); // clear context + localStorage
          localStorage.removeItem("currentUser");
          navigate("/login");
        } else {
          alert("Invalid OTP. Try again.");
        }
      })
      .catch(console.error);
  };

  return (
    <div className="edit-user-container">
      <h2>Edit User</h2>

      <form onSubmit={handleSubmit} className="edit-user-form">
        {/* Existing profile fields */}
        <div className="form-group">
          <label>First Name</label>
          <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Mobile</label>
          <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Profile Photo URL</label>
          <input type="text" name="photo" value={formData.photo} onChange={handleChange} />
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">Save Changes</button>
          <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>

      {/* 🔴 Deactivate Section */}
      <div className="deactivate-section">
        <hr />
        <h3 style={{ color: "red" }}>Danger Zone</h3>
        {!otpSent ? (
          <button className="deactivate-btn" onClick={requestDeactivation}>
            Deactivate Account
          </button>
        ) : (
          <div className="otp-verify">
            <label>Enter OTP:</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
            <button className="verify-btn" onClick={verifyOtpAndDeactivate}>
              Verify & Deactivate
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditUser;
