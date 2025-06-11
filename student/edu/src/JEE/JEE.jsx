import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./JEE.css";

import physicsImg from "../assets/physics.jpg";
import chemistryImg from "../assets/chemistry.jpg";
import mathsImg from "../assets/maths.png"; 

const subjectList = [
  { name: "Physics", route: "/physics1", image: physicsImg, certified: false },
  { name: "Chemistry", route: "/chemistry1", image: chemistryImg, certified: false },
  { name: "Maths", route: "/maths", image: mathsImg, certified: false },
];

const Subjects = () => {
  const navigate = useNavigate();

  // State for start and end dates
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [subjectCompletion, setSubjectCompletion] = useState(subjectList);

  // UseRef for scrolling to learning path section
  const learningPathRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const today = new Date();
    const oneYearLater = new Date();
    oneYearLater.setFullYear(today.getFullYear() + 1);

    const formatDate = (date) => {
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    setStartDate(formatDate(today));
    setEndDate(formatDate(oneYearLater));

    // Load saved subject completion from localStorage
    const savedCompletion = JSON.parse(localStorage.getItem("subjectCompletion"));
    if (savedCompletion) {
      setSubjectCompletion(savedCompletion);
    }
  }, []);

  // Handle scroll to learning path section
  const handleScrollToLearningPath = () => {
    if (learningPathRef.current) {
      learningPathRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const calculateProgress = () => {
    const completedSubjects = subjectCompletion.filter((subject) => subject.certified).length;
    const totalSubjects = subjectCompletion.length;
    return (completedSubjects / totalSubjects) * 100;
  };

  const progressPercentage = calculateProgress();

  // Mark a subject as completed
  const handleSubjectCompletion = (subjectName) => {
    const updatedSubjects = subjectCompletion.map((subject) =>
      subject.name === subjectName ? { ...subject, certified: true } : subject
    );
    setSubjectCompletion(updatedSubjects);
    localStorage.setItem("subjectCompletion", JSON.stringify(updatedSubjects));
  };

  return (
    <div className="subjects-page">
      <aside className="sidebar">
        <h2>JEE</h2>
        <span className="badge certified">Certified</span>
        <span className="badge limited">Limited Access Only</span>
        <div className="cohort-details">
          <h4>Your Batch</h4>
          <p><strong>Start Date:</strong> {startDate}</p>
          <p><strong>End Date:</strong> {endDate}</p>
        </div>
      </aside>

      <main className="content">
        <section className="progress-section">
          <h3>My Completion Progress</h3>
          <div className="progress-header">
            <div className="progress-info">
              <p>{subjectCompletion.filter((subject) => subject.certified).length} of {subjectCompletion.length} subjects completed</p>
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{
                    width: `${progressPercentage}%`,
                    backgroundColor: progressPercentage === 100 ? '#4CAF50' : progressPercentage > 50 ? '#FFEB3B' : '#B0BEC5',
                  }}
                  title={`Completed: ${Math.round(progressPercentage)}%`}
                >
                  <div className="progress-filled"></div>
                </div>
              </div>
              <p className="subtext">
                {progressPercentage === 100 ? "You've completed all subjects!" : "Complete all mandatory subjects to earn your certificate"}
              </p>
            </div>

            <div className="certificate-box">
              <button
                className={`certificate-btn ${progressPercentage === 100 ? 'btn-completed' : 'btn-continue'}`}
                onClick={handleScrollToLearningPath}
              >
                {progressPercentage === 100 ? "Download Certificate" : "Continue Learning"}
              </button>
            </div>
          </div>
        </section>

        <section className="learning-path" ref={learningPathRef}>
          <h3>Learning Path</h3>
          <div className="timeline">
            {subjectList.map((subject, index) => (
              <div key={subject.name} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className={`subject-card subject-card-${index}`}>
                    <img src={subject.image} alt={subject.name} className="subject-thumbnail" />
                    <div className="subject-info">
                      <span className="course-number">Course {index + 1}</span>
                      <h4 className="subject-title">{subject.name}</h4>
                      {subject.certified && <span className="certified-badge">Certified</span>}
                    </div>
                    <button className="continue-btn" onClick={() => navigate(subject.route)}>
                      {subject.certified ? "Review" : "Learn More"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Subjects;
