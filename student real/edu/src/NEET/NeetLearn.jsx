import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "./NeetLearn.css";
import PadmasiniChat from "../components/PadmasiniChat";
import NeetExplanation from "./NeetExplanation";
import NeetQuiz from "./NeetQuiz";

// SubtopicTree remains unchanged
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
          {expandedSub === idx && sub.units && (
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

// allNeetTopics definition remains unchanged
const allNeetTopics = {
  Botany: {
    standard: 11,
    units: [
      {
        unitName: "1. CELL STRUCTURE",
        units: [
          {
            unitName: "1.1 Introduction",
            type: "explanation",
            units: [
              {
                unitName: "1.1.1 Overview of Cell",
                type: "explanation",
                units: [
                  {
                    unitName: "1.1.1.1 Historical Background",
                    type: "explanation",
                  },
                ],
              },
            ],
          },
          {
            unitName: "1.2 Cell Theory",
            type: "explanation",
            units: [
              {
                unitName: "1.2.1 Contributors",
                type: "explanation",
              },
              {
                unitName: "1.2.2 Modern Cell Theory",
                type: "explanation",
              },
            ],
          },
          {
            unitName: "Assessment - CELL STRUCTURE",
            type: "quiz",
          },
        ],
      },
      {
        unitName: "2. PLANT PHYSIOLOGY",
        units: [
          {
            unitName: "2.1 Photosynthesis",
            type: "explanation",
            units: [
              {
                unitName: "2.1.1 Light Reactions",
                type: "explanation",
              },
              {
                unitName: "2.1.2 Dark Reactions",
                type: "explanation",
              },
            ],
          },
          {
            unitName: "Assessment - PLANT PHYSIOLOGY",
            type: "quiz",
          },
        ],
      },
    ],
  },

  Zoology: {
    standard: 11,
    units: [
      {
        unitName: "1. HUMAN PHYSIOLOGY",
        units: [
          {
            unitName: "1.1 Digestive System",
            type: "explanation",
            units: [
              {
                unitName: "1.1.1 Organs of Digestion",
                type: "explanation",
              },
            ],
          },
          {
            unitName: "1.2 Respiratory System",
            type: "explanation",
          },
          {
            unitName: "Assessment - HUMAN PHYSIOLOGY",
            type: "quiz",
          },
        ],
      },
      {
        unitName: "2. ANIMAL BEHAVIOR",
        units: [
          {
            unitName: "2.1 Instincts and Learning",
            type: "explanation",
          },
          {
            unitName: "2.2 Social Behavior",
            type: "explanation",
          },
          {
            unitName: "Assessment - ANIMAL BEHAVIOR",
            type: "quiz",
          },
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
          {
            unitName: "1.1 Introduction",
            type: "explanation",
          },
          {
            unitName: "1.2 Bohr Model",
            type: "explanation",
            units: [
              {
                unitName: "1.2.1 Postulates",
                type: "explanation",
              },
              {
                unitName: "1.2.2 Limitations",
                type: "explanation",
              },
            ],
          },
          {
            unitName: "Assessment - ATOMIC STRUCTURE",
            type: "quiz",
          },
        ],
      },
      {
        unitName: "2. ORGANIC CHEMISTRY",
        units: [
          {
            unitName: "2.1 Hydrocarbons",
            type: "explanation",
            units: [
              {
                unitName: "2.1.1 Alkanes",
                type: "explanation",
              },
              {
                unitName: "2.1.2 Alkenes and Alkynes",
                type: "explanation",
              },
            ],
          },
          {
            unitName: "Assessment - ORGANIC CHEMISTRY",
            type: "quiz",
          },
        ],
      },
    ],
  },

  Physics: {
    standard: 12,
    units: [
      {
        unitName: "1. UNIT AND MEASURE",
        units: [
          {
            unitName: "1.1 Introduction",
            type: "explanation",
          },
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
          {
            unitName: "Assessment - UNIT AND MEASURE",
            type: "quiz",
          },
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
          },
          {
            unitName: "Assessment - KINEMATICS",
            type: "quiz",
          },
        ],
      },
      {
        unitName: "3. THERMODYNAMICS",
        units: [
          {
            unitName: "3.1 Laws of Thermodynamics",
            type: "explanation",
            units: [
              { unitName: "3.1.1 First Law", type: "explanation" },
              { unitName: "3.1.2 Second Law", type: "explanation" },
            ],
          },
          {
            unitName: "Assessment - THERMODYNAMICS",
            type: "quiz",
          },
        ],
      },
      {
        unitName: "4. WAVES AND OSCILLATIONS",
        units: [
          {
            unitName: "4.1 Simple Harmonic Motion",
            type: "explanation",
          },
          {
            unitName: "4.2 Wave Motion",
            type: "explanation",
          },
          {
            unitName: "Assessment - WAVES AND OSCILLATIONS",
            type: "quiz",
          },
        ],
      },
    ],
  },
  
};

const NeetLearn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const subject = location.state?.subject || "Physics";
  const selectedClass = location.state?.selectedClass || null;
  const currentUser = JSON.parse(sessionStorage.getItem("registeredUser") || "{}");
  const userId = sessionStorage.getItem("currentUser") || "guest";

  const subjectData = allNeetTopics[subject];
  const selectedStandard = selectedClass === "11th" ? 11 : selectedClass === "12th" ? 12 : null;
  const topics = subjectData?.standard === selectedStandard ? subjectData.units : [];

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

  // Load progress from sessionStorage
  useEffect(() => {
    const loadProgressFromSessionStorage = () => {
      const updated = {};
      const traverseTopics = (subs, topicName) => {
        for (const sub of subs) {
          if (sub.units && sub.units.length > 0) {
            traverseTopics(sub.units, topicName);
          }
          const key = `neet-completed-${sub.unitName}`;
          if (sessionStorage.getItem(key) === "true") {
            if (!updated[topicName]) updated[topicName] = {};
            updated[topicName][sub.unitName] = true;
          }
        }
      };
      topics.forEach((topic) => traverseTopics(topic.units, topic.unitName));
      setCompletedSubtopics(updated);
    };
    loadProgressFromSessionStorage();
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

  const handleBackToSubjects = () => navigate("/Neet");

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

    sessionStorage.setItem(`neet-completed-${subtopicTitle}`, "true");

    setCompletedSubtopics((prev) => {
      const topicProgress = prev[topicTitle] || {};
      if (topicProgress[subtopicTitle]) return prev;

      const updated = {
        ...prev,
        [topicTitle]: { ...topicProgress, [subtopicTitle]: true },
      };

      sessionStorage.setItem(`completedSubtopics_${userId}_neet`, JSON.stringify(updated));
      return updated;
    });
  };

  const resetProgress = () => {
    const confirmReset = window.confirm("Are you sure you want to reset all your NEET progress?");
    if (!confirmReset) return;

    sessionStorage.removeItem(`completedSubtopics_${userId}_neet`);
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith("neet-completed-")) {
        sessionStorage.removeItem(key);
      }
    });

    setCompletedSubtopics({});
    setExpandedTopic(null);
    setSelectedSubtopic(null);
  };

  return (
    <div className="Neet-container">
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
            <NeetQuiz
              topicTitle={topics[expandedTopic]?.unitName}
              subtopicTitle={selectedSubtopic.unitName}
              onBack={handleBackToTopics}
              onMarkComplete={markSubtopicComplete}
            />
          ) : (
            <NeetExplanation
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

export default NeetLearn;
