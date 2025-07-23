import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Physics.css";
import PadmasiniChat from "../components/PadmasiniChat";
import { physicsExplanations } from "./PhysicsExplanation";
import PhysicsExplanation from "./PhysicsExplanation";
import PhysicsQuiz from "./Physicsquiz";
import axios from "axios";

const physicsTopics = [
  {
    title: "1. UNIT AND MEASURE",
    subtopics: [
      { title: "1.1 Introduction", type: "explanation" },
      { title: "1.2 The International System of Units", type: "explanation" },
      { title: "1.3 Significant Figures", type: "explanation" },
      { title: "1.4 Dimensions of Physical Quantities", type: "explanation" },
      { title: "1.5 Dimensional Formulae and Dimensional Equations", type: "explanation" },
      { title: "1.6 Dimensional Analysis and Its Applications", type: "explanation" },
      { title: "1.7 Test", type: "explanation" },
      { title: "Assessment - UNIT AND MEASURE", type: "quiz" },
    ],
  },
  {
    title: "2. MOTION IN A STRAIGHT LINE",
    subtopics: [
      { title: "2.1 Introduction", type: "explanation" },
      { title: "2.2 Position, Path Length, and Displacement", type: "explanation" },
      { title: "2.3 Average Velocity and Average Speed", type: "explanation" },
      { title: "2.4 Instantaneous Velocity and Speed", type: "explanation" },
      { title: "2.5 Acceleration", type: "explanation" },
      { title: "2.6 Kinematic Equations for Uniformly Accelerated Motion", type: "explanation" },
      { title: "2.7 Relative Velocity", type: "explanation" },
      { title: "Assessment - MOTION IN A STRAIGHT LINE", type: "quiz" },
    ],
  },
  {
    title: "3. MOTION IN A PLANE",
    subtopics: [
      { title: "3.1 Introduction", type: "explanation" },
      { title: "3.2 Scalars and Vectors", type: "explanation" },
      { title: "3.3 Multiplication of Vectors by Real Numbers", type: "explanation" },
      { title: "3.4 Addition and Subtraction of Vectors", type: "explanation" },
      { title: "3.5 Resolution of Vectors", type: "explanation" },
      { title: "3.6 Vector Addition – Analytical Method", type: "explanation" },
      { title: "3.7 Motion in a Plane", type: "explanation" },
      { title: "3.8 Projectile Motion", type: "explanation" },
      { title: "3.9 Uniform Circular Motion", type: "explanation" },
      { title: "Assessment - MOTION IN A PLANE", type: "quiz" },
    ],
  },
  {
    title: "4. LAWS OF MOTION",
    subtopics: [
      { title: "4.1 Introduction", type: "explanation" },
      { title: "4.2 Aristotle’s Fallacy", type: "explanation" },
      { title: "4.3 The Law of Inertia", type: "explanation" },
      { title: "4.4 Newton’s First Law of Motion", type: "explanation" },
      { title: "4.5 Newton’s Second Law of Motion", type: "explanation" },
      { title: "4.6 Newton’s Third Law of Motion", type: "explanation" },
      { title: "4.7 Conservation of Momentum", type: "explanation" },
      { title: "4.8 Equilibrium of a Particle", type: "explanation" },
      { title: "4.9 Common Forces in Mechanics", type: "explanation" },
      { title: "4.10 Circular Motion", type: "explanation" },
      { title: "4.11 Solving Problems in Mechanics", type: "explanation" },
      { title: "Assessment - LAWS OF MOTION", type: "quiz" },
    ],
  },
  {
    title: "5. WORK, ENERGY AND POWER",
    subtopics: [
      { title: "5.1 Introduction", type: "explanation" },
      { title: "5.2 Notions of Work and Kinetic Energy : The Work-Energy Theorem", type: "explanation" },
      { title: "5.3 Work", type: "explanation" },
      { title: "5.4 Kinetic Energy", type: "explanation" },
      { title: "5.5 Work Done by a Variable Force", type: "explanation" },
      { title: "5.6 The Work-Energy Theorem for a Variable Force", type: "explanation" },
      { title: "5.7 The Concept of Potential Energy", type: "explanation" },
      { title: "5.8 The Conservation of Mechanical Energy", type: "explanation" },
      { title: "5.9 The Potential Energy of a Spring", type: "explanation" },
      { title: "5.10 Power", type: "explanation" },
      { title: "5.11 Collisions", type: "explanation" },
      { title: "Assessment - WORK, ENERGY AND POWER", type: "quiz" },
    ],
  },
  {
    title: "6. SYSTEMS OF PARTICLES AND ROTATIONAL MOTION",
    subtopics: [
      { title: "6.1 Introduction", type: "explanation" },
      { title: "6.2 Centre of mass", type: "explanation" },
      { title: "6.3 Motion of centre of mass", type: "explanation" },
      { title: "6.4 Linear momentum of a system of particles", type: "explanation" },
      { title: "6.5 Vector product of two vectors", type: "explanation" },
      { title: "6.6 Angular velocity and its relation with linear velocity", type: "explanation" },
      { title: "6.7 Torque and angular momentum", type: "explanation" },
      { title: "6.8 Equilibrium of a rigid body", type: "explanation" },
      { title: "6.9 Moment of inertia", type: "explanation" },
      { title: "6.10 Kinematics of rotational motion about a fixed axis", type: "explanation" },
      { title: "6.11 Dynamics of rotational motion about a fixed axis", type: "explanation" },
      { title: "6.12 Angular momentum in case of rotation about a fixed axis", type: "explanation" },
      { title: "Assessment - SYSTEMS OF PARTICLES AND ROTATIONAL MOTION", type: "quiz" },
    ],
  },
  {
    title: "7. GRAVITATION",
    subtopics: [
      { title: "7.1 Introduction", type: "explanation" },
      { title: "7.2 Kepler’s laws", type: "explanation" },
      { title: "7.3 Universal law of gravitation", type: "explanation" },
      { title: "7.4 The gravitational constant", type: "explanation" },
      { title: "7.5 Acceleration due to gravity of the earth", type: "explanation" },
      { title: "7.6 Acceleration due to gravity below and above the surface of earth", type: "explanation" },
      { title: "7.7 Gravitational potential energy", type: "explanation" },
      { title: "7.8 Escape speed", type: "explanation" },
      { title: "7.9 Earth satellites", type: "explanation" },
      { title: "7.10 Energy of an orbiting satellite", type: "explanation" },
      { title: "Assessment - GRAVITATION", type: "quiz" },
    ],

  }
];

const Physics = () => {
  const currentUserDetails=JSON.parse(localStorage.getItem('currentUser'))
  useEffect(()=>{
      const courseName ='professional'
  const subjectName = 'Physics';
  const stringStandard = currentUserDetails.selectedStandard;
  const standard = stringStandard.replace(/\D/g, '');
  console.log(standard," ", courseName," ",subjectName )
    const getAllSujectDetails=()=>{
    fetch(`http://localhost:3000/getSubjectDetails?courseName=${courseName}&subjectName=${subjectName}&standard=${standard}`,{
      method:'GET',
      credentials:'include'
    }).then(resp=>resp.json())
    .then(data=>console.log('details of units: ',data))
    .catch(err=>console.log('getting units error: ',err))
  }
  getAllSujectDetails();
  },[])
    const [expandedTopic, setExpandedTopic] = useState(null);
    const [selectedSubtopic, setSelectedSubtopic] = useState(null);
    const [showTopics, setShowTopics] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const navigate = useNavigate();

    // User ID for tracking (replace with actual authentication logic)
    const userId = localStorage.getItem("currentUser") || "guest";

    const [completedSubtopics, setCompletedSubtopics] = useState(() => {
        const savedData = localStorage.getItem(`completedSubtopics_${userId}_physics`);
        return savedData ? JSON.parse(savedData) : {};
    });

    // Reset data on first login for new users
    useEffect(() => {
        const isFirstLogin = localStorage.getItem(`isFirstLogin_${userId}_physics`);
        if (isFirstLogin === null || isFirstLogin === "true") {
            // Clear user-specific progress data
            localStorage.removeItem(`completedSubtopics_${userId}_physics`);
            localStorage.setItem(`isFirstLogin_${userId}_physics`, "false");
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
const isTopicCompleted = (topic) => {
    const completed = completedSubtopics[topic.title] || {};
    return topic.subtopics.every((sub) => completed[sub.title]);
  };

  const isTopicUnlocked = (index) => {
    if (index === 0) return true;
    return isTopicCompleted(physicsTopics[index - 1]);
  };

    const toggleTopic = (index) => {
    if (!isTopicUnlocked(index)) return;
    setExpandedTopic((prev) => (prev === index ? null : index));
    setSelectedSubtopic(null);
  };


 const handleSubtopicClick = (subtopic, index) => {
    if (!isTopicUnlocked(index)) return;
    setSelectedSubtopic(subtopic);
    if (isMobile) setShowTopics(false);
  };


    const handleBackToTopics = () => {
        setSelectedSubtopic(null);
        if (isMobile) setShowTopics(true);
    };

    const handleBackToSubjects = () => {
        navigate("/neet");
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
                        {physicsTopics.map((topic, index) => {
              const unlocked = isTopicUnlocked(index);
              return (

                            <li key={index}>
                                <div
                                    className={`topic-title ${expandedTopic === index ? "active" : ""} ${unlocked ? "" : "locked"}`}
                                    onClick={() => toggleTopic(index)}
                                    title={!unlocked ? "Complete previous topic to unlock" : ""}
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
                       className={`subtopic-title ${selectedSubtopic?.title === subtopic.title ? "selected" : ""}`}
                          onClick={() => handleSubtopicClick(subtopic, index)}

                      >
                        {subtopic.title}
                      </li>
                    ))}
                  </ul>
                )}
                            </li>
                                    );
            })}

                    </ul>
                    <button className="back-subjects-btn" onClick={handleBackToSubjects}>
                        Back to Subjects
                    </button>
                </div>
            )}

            <div className="explanation-container">
                {selectedSubtopic ? (
                    selectedSubtopic.type === "quiz" ? (
                        <PhysicsQuiz
                            topicTitle={physicsTopics[expandedTopic]?.title}
                            subtopicTitle={selectedSubtopic.title}
                            onBack={handleBackToTopics}
                            onMarkComplete={markSubtopicComplete}
                        />
                    ) : (
                        <PhysicsExplanation
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
            <PadmasiniChat subjectName="Physics" />
        </div>
    );
};

export default Physics;

