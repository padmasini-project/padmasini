import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ContactUs.css";
import whatsappIcon from "../assets/WhatsApp_icon.png"; // Adjust path if needed

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    enquiry: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Enquiry Details:", formData);
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    navigate("/"); // Navigate to home page
  };

  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      <div className="form-box">
        <form onSubmit={handleSubmit}>
          <input
            className="form-name"
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <textarea
            name="enquiry"
            placeholder="Enquiry"
            value={formData.enquiry}
            onChange={handleChange}
            required
          />
          <button>Submit</button>
        </form>
      </div>

      {/* WhatsApp Chat Button */}
      <a
        href="https://wa.me/YOUR_PHONE_NUMBER"
        className="whatsapp-chat-button"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
      >
        <img src={whatsappIcon} alt="WhatsApp" className="whatsapp-icon" />
        <span>Chat with us on WhatsApp</span>
      </a>

      {/* Thank You Popup */}
      {submitted && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Thank you for reaching out!</h2>
            <p>Our team will review your inquiry and get back to you soon.</p>
            <button className="popup-close-button" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactUs;
