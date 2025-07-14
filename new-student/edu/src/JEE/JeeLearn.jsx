import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "./JeeLearn.css";
import PadmasiniChat from "../components/PadmasiniChat";
import JeeExplanation from "./JeeExplanation";
import JeeQuiz from "./JeeQuiz";

const SubtopicTree = ({ subtopics, onClick, selectedTitle, parentIndex, level = 1 }) => {
  const [expandedSub, setExpandedSub] = useState(null);

  const handleSubClick = (sub, idx) => {
    if (sub.units && sub.units.length > 0) {
      setExpandedSub(expandedSub === idx ? null : idx);
    }
    onClick(sub, parentIndex);
  };

  return (
    <ul className="subtopics-list">
      {subtopics.map((sub, idx) => (
        <li key={idx}>
          <div
            className={`subtopic-title ${selectedTitle === sub.unitName ? "selected" : ""}`}
            style={{ marginLeft: `${level * 20}px` }}
            onClick={() => handleSubClick(sub, idx)}
          >
            {sub.unitName}
          </div>
          {expandedSub === idx && sub.units && sub.units.length > 0 && (
            <SubtopicTree
              subtopics={sub.units}
              onClick={onClick}
              selectedTitle={selectedTitle}
              parentIndex={parentIndex}
              level={level + 1}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

// 🧠 JEE-specific topics
const allJeeTopics = {
  Physics: {
    standard: 12,
    units: [
      {
        unitName: "1. UNIT AND MEASURE",
        units: [
          { unitName: "1.1 Introduction", type: "explanation" },
          {
            unitName: "1.2 SI Units",
            type: "explanation",
            units: [
              {
                unitName: "1.2.1 Base Units",
                type: "explanation",
                units: [
                  { unitName: "1.2.1.1 Meter", type: "explanation" },
                  { unitName: "1.2.1.2 Kilogram", type: "explanation" },
                ],
              },
              { unitName: "1.2.2 Derived Units", type: "explanation" },
            ],
          },
          { unitName: "Assessment - UNIT AND MEASURE", type: "quiz" },
        ],
      },
      {
        unitName: "2. KINEMATICS",
        units: [
          {
            unitName: "2.1 Motion in One Dimension",
            type: "explanation",
            units: [
              { unitName: "2.1.1 Speed and Velocity", type: "explanation" },
              { unitName: "2.1.2 Acceleration", type: "explanation" },
            ],
          },
          {
            unitName: "2.2 Motion in Two Dimensions",
            type: "explanation",
            units: [
              { unitName: "2.2.1 Projectile Motion", type: "explanation" },
              { unitName: "2.2.2 Relative Velocity", type: "explanation" },
            ],
          },
          { unitName: "Assessment - KINEMATICS", type: "quiz" },
        ],
      },
    ],
  },

  Chemistry: {
    standard: 12,
    units: [
      {
        unitName: "1. ATOMIC STRUCTURE",
        units: [
          { unitName: "1.1 Introduction", type: "explanation" },
          {
            unitName: "1.2 Bohr Model",
            type: "explanation",
            units: [
              { unitName: "1.2.1 Postulates", type: "explanation" },
              { unitName: "1.2.2 Limitations", type: "explanation" },
            ],
          },
          { unitName: "Assessment - ATOMIC STRUCTURE", type: "quiz" },
        ],
      },
      {
        unitName: "2. CHEMICAL BONDING",
        units: [
          { unitName: "2.1 Ionic Bond", type: "explanation" },
          { unitName: "2.2 Covalent Bond", type: "explanation" },
          {
            unitName: "2.3 Hybridization",
            type: "explanation",
            units: [
              { unitName: "2.3.1 sp Hybridization", type: "explanation" },
              { unitName: "2.3.2 sp2 and sp3", type: "explanation" },
            ],
          },
          { unitName: "Assessment - CHEMICAL BONDING", type: "quiz" },
        ],
      },
    ],
  },

  Maths: {
    standard: 11,
    units: [
      {
        unitName: "1. SETS AND RELATIONS",
        units: [
          { unitName: "1.1 Introduction to Sets", type: "explanation" },
          {
            unitName: "1.2 Types of Sets",
            type: "explanation",
            units: [
              { unitName: "1.2.1 Finite and Infinite Sets", type: "explanation" },
              { unitName: "1.2.2 Subsets", type: "explanation" },
            ],
          },
          { unitName: "Assessment - SETS AND RELATIONS", type: "quiz" },
        ],
      },
      {
        unitName: "2. FUNCTIONS",
        units: [
          { unitName: "2.1 Introduction to Functions", type: "explanation" },
          {
            unitName: "2.2 Types of Functions",
            type: "explanation",
            units: [
              { unitName: "2.2.1 One-One and Onto", type: "explanation" },
              { unitName: "2.2.2 Composite Functions", type: "explanation" },
            ],
          },
          { unitName: "Assessment - FUNCTIONS", type: "quiz" },
        ],
      },
    ],
  },
};


const JeeLearn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const subject = location.state?.subject || "Physics";

  const currentUser = JSON.parse(localStorage.getItem("registeredUser") || "{}");
  const userId = localStorage.getItem("currentUser") || "guest";
  const userStandard = currentUser.standard?.includes("11") ? 11 : currentUser.standard?.includes("12") ? 12 : null;

  const subjectData = allJeeTopics[subject];
  const topics = subjectData?.standard === userStandard ? subjectData.units : [];

  const [expandedTopic, setExpandedTopic] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [showTopics, setShowTopics] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [completedSubtopics, setCompletedSubtopics] = useState({});

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

  useEffect(() => {
    const loadProgress = () => {
      const updated = {};

      const traverse = (subs, topicName) => {
        for (const sub of subs) {
          if (sub.units) traverse(sub.units, topicName);
          const key = `jee-completed-${sub.unitName}`;
          if (localStorage.getItem(key) === "true") {
            if (!updated[topicName]) updated[topicName] = {};
            updated[topicName][sub.unitName] = true;
          }
        }
      };

      topics.forEach((topic) => traverse(topic.units, topic.unitName));
      setCompletedSubtopics(updated);
    };

    loadProgress();
  }, [subject]);

  const collectAllSubtopics = (subs = []) =>
    subs.flatMap((s) => [s, ...(s.units ? collectAllSubtopics(s.units) : [])]);

  const isTopicCompleted = (topic) => {
    const completed = completedSubtopics[topic.unitName] || {};
    const allSubs = collectAllSubtopics(topic.units);
    return allSubs.every((sub) => completed[sub.unitName]);
  };

  const isTopicUnlocked = (index) => index === 0 || isTopicCompleted(topics[index - 1]);

  const toggleTopic = (index) => {
    if (!isTopicUnlocked(index)) return;
    setExpandedTopic((prev) => (prev === index ? null : index));
    setSelectedSubtopic(null);
  };

  const handleSubtopicClick = (sub, index) => {
    setSelectedSubtopic(sub);
    if (isMobile) setShowTopics(false);
    setExpandedTopic(index);
  };

  const handleBackToTopics = () => {
    setSelectedSubtopic(null);
    if (isMobile) setShowTopics(true);
  };

  const handleBackToSubjects = () => navigate("/Jee");

  const calculateProgress = (topic) => {
    const allSubs = collectAllSubtopics(topic.units);
    const completedCount = allSubs.filter(
      (sub) => completedSubtopics[topic.unitName]?.[sub.unitName]
    ).length;
    const totalCount = allSubs.length;
    return totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  };

  const markSubtopicComplete = () => {
    if (!selectedSubtopic || expandedTopic === null) return;
    const topicTitle = topics[expandedTopic].unitName;
    const subtopicTitle = selectedSubtopic.unitName;

    localStorage.setItem(`jee-completed-${subtopicTitle}`, "true");

    setCompletedSubtopics((prev) => {
      const topicProgress = prev[topicTitle] || {};
      if (topicProgress[subtopicTitle]) return prev;

      const updated = {
        ...prev,
        [topicTitle]: { ...topicProgress, [subtopicTitle]: true },
      };

      localStorage.setItem(`completedSubtopics_${userId}_jee`, JSON.stringify(updated));
      return updated;
    });
  };

  const resetProgress = () => {
    const confirmReset = window.confirm("Reset all your JEE progress?");
    if (!confirmReset) return;

    localStorage.removeItem(`completedSubtopics_${userId}_jee`);
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("jee-completed-")) {
        localStorage.removeItem(key);
      }
    });

    setCompletedSubtopics({});
    setExpandedTopic(null);
    setSelectedSubtopic(null);
  };

  return (
    <div className="Jee-container">
      {isMobile && (
        <button className="toggle-btn" onClick={() => setShowTopics(!showTopics)}>
          <FaBars />
          <h2>{subject} Topics</h2>
        </button>
      )}

      {showTopics && (
        <div className="topics-list">
          <ul>
            {topics.map((topic, index) => (
              <li key={index}>
                <div
                  className={`topic-title ${expandedTopic === index ? "active" : ""} ${
                    !isTopicUnlocked(index) ? "locked" : ""
                  }`}
                  onClick={() => toggleTopic(index)}
                >
                  {topic.unitName}
                  <div className="progress-bar-wrapper">
                    <div className="progress-info">
                      <span className="progress-inside">{calculateProgress(topic)}%</span>
                      <span className="expand-icon">{expandedTopic === index ? "-" : "+"}</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${calculateProgress(topic)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                {expandedTopic === index && (
                  <SubtopicTree
                    subtopics={topic.units}
                    onClick={handleSubtopicClick}
                    selectedTitle={selectedSubtopic?.unitName}
                    parentIndex={index}
                  />
                )}
              </li>
            ))}
          </ul>

          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button className="back-subjects-btn" onClick={handleBackToSubjects}>
              Back to Subjects
            </button>
            <button className="back-subjects-btn" onClick={resetProgress}>
              Reset Progress
            </button>
          </div>
        </div>
      )}

      <div className="explanation-container">
        {selectedSubtopic ? (
          selectedSubtopic.unitName.includes("Assessment") ? (
            <JeeQuiz
              topicTitle={topics[expandedTopic]?.unitName}
              subtopicTitle={selectedSubtopic.unitName}
              onBack={handleBackToTopics}
              onMarkComplete={markSubtopicComplete}
            />
          ) : (
            <JeeExplanation
              topicTitle={topics[expandedTopic]?.unitName}
              subtopicTitle={selectedSubtopic.unitName}
              subject={subject}
              onBack={handleBackToTopics}
              onMarkComplete={markSubtopicComplete}
            />
          )
        ) : (
          <div className="no-explanation">
            <h2>Welcome to {subject} - Std {subjectData.standard}</h2>
            <p>Select a topic and subtopic to begin your learning journey.</p>
          </div>
        )}
      </div>

      <PadmasiniChat subjectName={subject} />
    </div>
  );
};

export default JeeLearn;
