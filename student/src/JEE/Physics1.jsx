import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Physics1.css";
import { physicsExplanations } from './PhysicsExplanation1'; 
import PhysicsExplanation1 from "./PhysicsExplanation1";
import PhysicsQuiz1 from "./Physicsquiz1";

const physicsTopics = [
  // Your existing topics array...
];

const Physics1 = () => {
    const [expandedTopic, setExpandedTopic] = useState(null);
    const [selectedSubtopic, setSelectedSubtopic] = useState(null);
    const [showTopics, setShowTopics] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const navigate = useNavigate();

    // User ID for tracking (replace with actual authentication logic)
    const userId = localStorage.getItem("currentUser") || "guest";

    const [completedSubtopics, setCompletedSubtopics] = useState(() => {
        const savedData = localStorage.getItem(`completedSubtopics_${userId}`);
        return savedData ? JSON.parse(savedData) : {};
    });

    // Reset data on first login for new users
    useEffect(() => {
        const isFirstLogin = localStorage.getItem(`isFirstLogin_${userId}`);
        if (isFirstLogin === null || isFirstLogin === "true") {
            // Clear user-specific progress data
            localStorage.removeItem(`completedSubtopics_${userId}`);
            localStorage.setItem(`isFirstLogin_${userId}`, "false");
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
        const topicTitle = physicsTopics[expandedTopic].title;
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
            localStorage.setItem(`completedSubtopics_${userId}`, JSON.stringify(newCompletedSubtopics));
            return newCompletedSubtopics;
        });
    };

    return (
        <div className="physics-container">
            {isMobile && (
                <button className="toggle-btn" onClick={() => setShowTopics(!showTopics)}>
                    <FaBars />
                    <h2>Physics Topics</h2>
                </button>
            )}

            {showTopics && (
                <div className="topics-list">
                    <ul>
                        {physicsTopics.map((topic, index) => (
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
                        <PhysicsQuiz1
                            topicTitle={physicsTopics[expandedTopic]?.title}
                            subtopicTitle={selectedSubtopic.title}
                            onBack={handleBackToTopics}
                            onMarkComplete={markSubtopicComplete}
                        />
                    ) : (
                        <PhysicsExplanation1
                            explanation={physicsExplanations[selectedSubtopic.title]}
                            subtopicTitle={selectedSubtopic.title}
                            onBack={handleBackToTopics}
                            onMarkComplete={markSubtopicComplete}
                        />
                    )
                ) : (
                    <div className="no-explanation">
                        <h2>Welcome to Physics Topics</h2>
                        <p>Select a topic and subtopic to start learning.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Physics1;
