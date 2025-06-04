import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Studentdetails.css";

const StudentDetails = ({ student }) => {
  const [photo, setPhoto] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStandard, setSelectedStandard] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const navigate = useNavigate();

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!photo) {
      alert("Please upload a profile picture.");
      return;
    }

    if (!dob || !gender || !selectedCourse) {
      alert("Please fill in all the required fields.");
      return;
    }

    if ((selectedCourse === "JEE" || selectedCourse === "NEET") && !selectedStandard) {
      alert("Please select your standard (11th or 12th).");
      return;
    }

    console.log("Photo:", photo);
    console.log("DOB:", dob);
    console.log("Gender:", gender);
    console.log("Course:", selectedCourse);
    if (selectedStandard) console.log("Standard:", selectedStandard);

    if (selectedCourse === "JEE") {
      navigate("/jee");
    } else if (selectedCourse === "NEET") {
      navigate("/neet");
    } else {
      navigate("/subjects");
    }
  };

  return (
    <div className="page-container">
      <h1>Student Details</h1>

      <div className="student-details-container">
        <div className="student-details-wrapper">
          {/* Left Section - Profile Picture */}
          <div className="left-section">
            <p className="upload-text">Upload Profile Picture *</p>
            <label htmlFor="file-input" className="custom-upload">
              {photo ? (
                <img src={photo} alt="Profile" className="profile-preview" />
              ) : (
                <span className="upload-placeholder">+</span>
              )}
            </label>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden-input"
            />
          </div>

          {/* Right Section - Form */}
          <div className="right-section">
            <form onSubmit={handleSubmit}>
              <input
                type="date"
                placeholder="Date of birth"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />

              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                required
              >
                <option value="">Course</option>
                <option value="kid">Kindergarten</option>
                <option value="first">Class 1-5</option>
                <option value="six">Class 6-12</option>
                <option value="JEE">JEE</option>
                <option value="NEET">NEET</option>
                <option value="Other">Other</option>
              </select>
              {(selectedCourse === "first") && (
                <select
                value={selectedStandard}
                onChange={(e) => setSelectedStandard(e.target.value)}
                required
              >
                <option value="">Select Standard</option>
                <option value="1">1st</option>
                <option value="2">2nd</option>
                <option value="3">3nd</option>
                <option value="4">4nd</option>
                <option value="5">5th</option>

              </select>
              )}
              {(selectedCourse === "six") && (
                <select
                value={selectedStandard}
                onChange={(e) => setSelectedStandard(e.target.value)}
                required
              >
                <option value="">Select Standard</option>
                <option value="1">6th</option>
                <option value="2">7th</option>
                <option value="3">8th</option>
                <option value="4">9th</option>
                <option value="5">10th</option>
                <option value="6">11th</option>
                <option value="7">12th</option>
              </select>
              )}
              {(selectedCourse === "JEE" || selectedCourse === "NEET") && (
                <select
                  value={selectedStandard}
                  onChange={(e) => setSelectedStandard(e.target.value)}
                  required
                >
                  <option value="">Select Standard</option>
                  <option value="11th">11th</option>
                  <option value="12th">12th</option>
                </select>
              )}

              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>

      {/* WhatsApp Chat Button */}
      <a
        href="https://wa.me/YOUR_PHONE_NUMBER"
        className="whatsapp-chat"
        target="_blank"
        rel="noopener noreferrer"
      >
        Chat with us on WhatsApp
      </a>
    </div>
  );
};

export default StudentDetails;