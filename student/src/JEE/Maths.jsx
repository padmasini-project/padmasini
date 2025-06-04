import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Maths.css";
import { mathsExplanations } from "./MathsExplanation";
import MathsExplanation from "./MathsExplanation";
import MathsQuiz from "./Mathsquiz";

const mathsTopics = [
  {
    title: "1. NUMBER SYSTEM",
    subtopics: [
      { title: "1.1 Rational and Irrational Numbers", type: "explanation" },
      { title: "1.2 Real Numbers", type: "explanation" },
      { title: "1.3 Laws of Exponents", type: "explanation" },
      { title: "Assessment - NUMBER SYSTEM", type: "quiz" },
    ],
  },
  {
    title: "2. ALGEBRA",
    subtopics: [
      { title: "2.1 Polynomials", type: "explanation" },
      { title: "2.2 Linear Equations in Two Variables", type: "explanation" },
      { title: "2.3 Factorization", type: "explanation" },
      { title: "Assessment - ALGEBRA", type: "quiz" },
    ],
  },
  {
    title: "3. GEOMETRY",
    subtopics: [
      { title: "3.1 Lines and Angles", type: "explanation" },
      { title: "3.2 Triangles", type: "explanation" },
      { title: "3.3 Quadrilaterals", type: "explanation" },
      { title: "Assessment - GEOMETRY", type: "quiz" },
    ],
  },
  {
    title: "4. MENSURATION",
    subtopics: [
      { title: "4.1 Areas of Parallelograms and Triangles", type: "explanation" },
      { title: "4.2 Surface Areas and Volumes", type: "explanation" },
      { title: "Assessment - MENSURATION", type: "quiz" },
    ],
  },
  {
    title: "5. COORDINATE GEOMETRY",
    subtopics: [
      { title: "5.1 Cartesian Plane", type: "explanation" },
      { title: "5.2 Plotting Points", type: "explanation" },
      { title: "Assessment - COORDINATE GEOMETRY", type: "quiz" },
    ],
  },
  {
    title: "6. STATISTICS AND PROBABILITY",
    subtopics: [
      { title: "6.1 Data Collection and Presentation", type: "explanation" },
      { title: "6.2 Measures of Central Tendency", type: "explanation" },
      { title: "6.3 Probability Basics", type: "explanation" },
      { title: "Assessment - STATISTICS AND PROBABILITY", type: "quiz" },
    ],
  },
];

const Maths = () => {
    const [expandedTopic, setExpandedTopic] = useState(null);
    const [selectedSubtopic, setSelectedSubtopic] = useState(null);
    const [showTopics, setShowTopics] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const navigate = useNavigate();

    // User ID for tracking (replace with actual authentication logic)
    const userId = localStorage.getItem("currentUser") || "guest";

    const [completedSubtopics, setCompletedSubtopics] = useState(() => {
        const savedData = localStorage.getItem(`completedSubtopics_${userId}_maths`);
        return savedData ? JSON.parse(savedData) : {};
    });

    // Reset data on first login for new users
    useEffect(() => {
        const isFirstLogin = localStorage.getItem(`isFirstLogin_${userId}_maths`);
        if (isFirstLogin === null || isFirstLogin === "true") {
            // Clear user-specific progress data
            localStorage.removeItem(`completedSubtopics_${userId}_maths`);
            localStorage.setItem(`isFirstLogin_${userId}_maths`, "false");
            setCompletedSubtopics({});
        }
    }, [userId]);

    useEffect(() => window.scrollTo(0, 0), []);

    useEffect(() => {
        const handleResize = () => {
            const isNowMobile = window.innerWidth <= 768;
            setIsMobile(isNowMobile);
            if (!isNowMobile) setShowTopics(true);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleTopic = (index) => {
        setExpandedTopic((prev) => (prev === index ? null : index));
        setSelectedSubtopic(null);
    };

    const handleSubtopicClick = (subtopic) => {
        setSelectedSubtopic(subtopic);
        if (isMobile) setShowTopics(false);
    };

    const handleBackToTopics = () => {
        setSelectedSubtopic(null);
        if (isMobile) setShowTopics(true);
    };

    const handleBackToSubjects = () => {
        navigate("/jee");
    };

    const calculateProgress = (topic) => {
        const completedCount = completedSubtopics[topic.title]
            ? Object.keys(completedSubtopics[topic.title]).length
            : 0;
        const totalCount = topic.subtopics.length;
        return totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
    };

    const markSubtopicComplete = () => {
        if (selectedSubtopic === null || expandedTopic === null) return;
        const topicTitle = mathsTopics[expandedTopic].title;
        const subtopicTitle = selectedSubtopic.title;
        setCompletedSubtopics((prev) => {
            const topicProgress = prev[topicTitle] || {};
            if (topicProgress[subtopicTitle]) return prev;
            const newCompletedSubtopics = {
                ...prev,
                [topicTitle]: {
                    ...topicProgress,
                    [subtopicTitle]: true,
                },
            };
            // Save to user-specific localStorage
            localStorage.setItem(`completedSubtopics_${userId}_maths`, JSON.stringify(newCompletedSubtopics));
            return newCompletedSubtopics;
        });
    };

    return (
        <div className="maths-container">
            {isMobile && (
                <button className="toggle-btn" onClick={() => setShowTopics(!showTopics)}>
                    <FaBars />
                    <h2>Maths Topics</h2>
                </button>
            )}

            {showTopics && (
                <div className="topics-list">
                    <ul>
                        {mathsTopics.map((topic, index) => (
                            <li key={index}>
                                <div
                                    className={`topic-title ${expandedTopic === index ? "active" : ""}`}
                                    onClick={() => toggleTopic(index)}
                                >
                                    {topic.title}
                                    <div className="progress-bar-wrapper">
                                        <div className="progress-info">
                                            <span>{calculateProgress(topic)}%</span>
                                            <span className="expand-icon">{expandedTopic === index ? "-" : "+"}</span>
                                        </div>
                                        <div className="progress-bar-bg">
                                            <div
                                                className="progress-bar-fill"
                                                style={{ width: `${calculateProgress(topic)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                                {expandedTopic === index && (
                  <ul className="subtopics-list">
                    {topic.subtopics.map((subtopic, idx) => (
                      <li
                        key={idx}
                        className={`subtopic-title ${
                          selectedSubtopic?.title === subtopic.title ? "selected" : ""
                        }`}
                        onClick={() => handleSubtopicClick(subtopic)}
                      >
                        {subtopic.title}
                      </li>
                    ))}
                  </ul>
                )}
                            </li>
                        ))}
                    </ul>
                    <button className="back-subjects-btn" onClick={handleBackToSubjects}>
                        Back to Subjects
                    </button>
                </div>
            )}

            <div className="explanation-container">
                {selectedSubtopic ? (
                    selectedSubtopic.type === "quiz" ? (
                        <MathsQuiz
                            topicTitle={mathsTopics[expandedTopic]?.title}
                            subtopicTitle={selectedSubtopic.title}
                            onBack={handleBackToTopics}
                            onMarkComplete={markSubtopicComplete}
                        />
                    ) : (
                        <MathsExplanation
                            explanation={mathsExplanations[selectedSubtopic.title]}
                            subtopicTitle={selectedSubtopic.title}
                            onBack={handleBackToTopics}
                            onMarkComplete={markSubtopicComplete}
                        />
                    )
                ) : (
                    <div className="no-explanation">
                        <h2>Welcome to Maths Topics</h2>
                        <p>Select a topic and subtopic to start learning.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Maths;
