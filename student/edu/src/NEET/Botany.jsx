import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Botany.css";  // Ensure that the CSS file is renamed as well
import { botanyExplanations } from './BotanyExplanation';
import BotanyExplanation from "./BotanyExplanation";  // Adjusted for BotanyExplanation1
import BotanyQuiz from "./Botanyquiz"; // ✅ Import your quiz component

const botanyTopics = [
  {
    title: "1. DIVERSITY OF THE LIVING WORLD",
    subtopics: [
      { title: "1.1 Characteristics of Plants", type: "explanation" },
      { title: "1.2 Classification Systems", type: "explanation" },
      { title: "1.3 Binomial Nomenclature", type: "explanation" },
      { title: "1.4 Herbarium and Botanical Gardens", type: "explanation" },
      { title: "Assessment - DIVERSITY OF THE LIVING WORLD", type: "quiz" },
    ],
  },
  {
    title: "2. PLANT KINGDOM",
    subtopics: [
      { title: "2.1 Algae", type: "explanation" },
      { title: "2.2 Bryophytes", type: "explanation" },
      { title: "2.3 Pteridophytes", type: "explanation" },
      { title: "2.4 Gymnosperms", type: "explanation" },
      { title: "2.5 Angiosperms", type: "explanation" },
      { title: "Assessment - PLANT KINGDOM", type: "quiz" },
    ],
  },
  {
    title: "3. MORPHOLOGY OF FLOWERING PLANTS",
    subtopics: [
      { title: "3.1 Root, Stem and Leaf", type: "explanation" },
      { title: "3.2 Inflorescence and Flower", type: "explanation" },
      { title: "3.3 Fruit and Seed", type: "explanation" },
      { title: "3.4 Modifications and Adaptations", type: "explanation" },
      { title: "Assessment - MORPHOLOGY OF FLOWERING PLANTS", type: "quiz" },
    ],
  },
  {
    title: "4. ANATOMY OF FLOWERING PLANTS",
    subtopics: [
      { title: "4.1 Tissues and Tissue Systems", type: "explanation" },
      { title: "4.2 Anatomy of Dicot and Monocot Plants", type: "explanation" },
      { title: "4.3 Secondary Growth", type: "explanation" },
      { title: "Assessment - ANATOMY OF FLOWERING PLANTS", type: "quiz" },
    ],
  },
  {
    title: "5. CELL – THE UNIT OF LIFE",
    subtopics: [
      { title: "5.1 Cell Theory", type: "explanation" },
      { title: "5.2 Structure of Prokaryotic and Eukaryotic Cells", type: "explanation" },
      { title: "5.3 Cell Organelles and Functions", type: "explanation" },
      { title: "Assessment - CELL – THE UNIT OF LIFE", type: "quiz" },
    ],
  },
  {
    title: "6. BIOMOLECULES",
    subtopics: [
      { title: "6.1 Types of Biomolecules", type: "explanation" },
      { title: "6.2 Structure and Function of Proteins, Carbohydrates, Lipids, Nucleic Acids", type: "explanation" },
      { title: "6.3 Enzymes and Their Activity", type: "explanation" },
      { title: "Assessment - BIOMOLECULES", type: "quiz" },
    ],
  },
  {
    title: "7. CELL CYCLE AND CELL DIVISION",
    subtopics: [
      { title: "7.1 Cell Cycle Phases", type: "explanation" },
      { title: "7.2 Mitosis and Meiosis", type: "explanation" },
      { title: "7.3 Significance of Cell Division", type: "explanation" },
      { title: "Assessment - CELL CYCLE AND CELL DIVISION", type: "quiz" },
    ],
  },
  {
    title: "8. TRANSPORT IN PLANTS",
    subtopics: [
      { title: "8.1 Transport of Water and Minerals", type: "explanation" },
      { title: "8.2 Transport of Food", type: "explanation" },
      { title: "8.3 Transpiration", type: "explanation" },
      { title: "8.4 Mechanisms of Transport", type: "explanation" },
      { title: "Assessment - TRANSPORT IN PLANTS", type: "quiz" },
    ],
  },
  {
    title: "9. MINERAL NUTRITION",
    subtopics: [
      { title: "9.1 Essential Elements and Their Functions", type: "explanation" },
      { title: "9.2 Deficiency Symptoms", type: "explanation" },
      { title: "9.3 Nitrogen Cycle and Nitrogen Fixation", type: "explanation" },
      { title: "Assessment - MINERAL NUTRITION", type: "quiz" },
    ],
  },
  {
    title: "10. PHOTOSYNTHESIS IN HIGHER PLANTS",
    subtopics: [
      { title: "10.1 Photosynthetic Pigments and Light Reaction", type: "explanation" },
      { title: "10.2 Cyclic and Non-Cyclic Photophosphorylation", type: "explanation" },
      { title: "10.3 Calvin Cycle and C4 Pathway", type: "explanation" },
      { title: "10.4 Factors Affecting Photosynthesis", type: "explanation" },
      { title: "Assessment - PHOTOSYNTHESIS IN HIGHER PLANTS", type: "quiz" },
    ],
  },
  {
    title: "11. RESPIRATION IN PLANTS",
    subtopics: [
      { title: "11.1 Glycolysis and Fermentation", type: "explanation" },
      { title: "11.2 Krebs Cycle", type: "explanation" },
      { title: "11.3 Electron Transport Chain", type: "explanation" },
      { title: "11.4 Respiratory Quotient and Energy Yield", type: "explanation" },
      { title: "Assessment - RESPIRATION IN PLANTS", type: "quiz" },
    ],
  },
  {
    title: "12. PLANT GROWTH AND DEVELOPMENT",
    subtopics: [
      { title: "12.1 Phases of Growth and Growth Curves", type: "explanation" },
      { title: "12.2 Plant Growth Regulators", type: "explanation" },
      { title: "12.3 Photoperiodism and Vernalization", type: "explanation" },
      { title: "12.4 Seed Dormancy and Germination", type: "explanation" },
      { title: "Assessment - PLANT GROWTH AND DEVELOPMENT", type: "quiz" },
    ],
  },
];


const Botany = () => {
  const [expandedTopic, setExpandedTopic] = useState(null);
     const [selectedSubtopic, setSelectedSubtopic] = useState(null);
     const [showTopics, setShowTopics] = useState(true);
     const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
     const navigate = useNavigate();
 
     // User ID for tracking (replace with actual authentication logic)
     const userId = localStorage.getItem("currentUser") || "guest";
 
     const [completedSubtopics, setCompletedSubtopics] = useState(() => {
         const savedData = localStorage.getItem(`completedSubtopics_${userId}_botany`);
         return savedData ? JSON.parse(savedData) : {};
     });
 // Reset data on first login for new users
    useEffect(() => {
        const isFirstLogin = localStorage.getItem(`isFirstLogin_${userId}_botany`);
        if (isFirstLogin === null || isFirstLogin === "true") {
            localStorage.removeItem(`completedSubtopics_${userId}_botany`);
            localStorage.setItem(`isFirstLogin_${userId}_botany`, "false");
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
    return isTopicCompleted(botanyTopics[index - 1]);
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
    const topicTitle = botanyTopics[expandedTopic].title;
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
      // Save to localStorage to persist progress
      localStorage.setItem(`completedSubtopics_${userId}_botany`, JSON.stringify(newCompletedSubtopics));
            return newCompletedSubtopics;
    });
  };

  return (
    <div className="botany-container">
      {isMobile && (
        <button className="toggle-btn" onClick={() => setShowTopics(!showTopics)}>
          <FaBars />
          <h2>Botany Topics</h2>
        </button>
      )}

      {showTopics && (
        <div className="topics-list">
          <ul>
            {botanyTopics.map((topic, index) => {
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
            <BotanyQuiz
              topicTitle={botanyTopics[expandedTopic]?.title}
              subtopicTitle={selectedSubtopic.title}
              onBack={handleBackToTopics}
              onMarkComplete={markSubtopicComplete}
            />
          ) : (
            <BotanyExplanation
              explanation={botanyExplanations[selectedSubtopic.title]}
              subtopicTitle={selectedSubtopic.title}
              onBack={handleBackToTopics}
              onMarkComplete={markSubtopicComplete}
            />
          )
        ) : (
           <div className="no-explanation">
            <h2>Welcome to Botany Topics</h2>
            <p>Select a topic and subtopic to start learning.</p>
          </div>     
           )}
      </div>
    </div>
  );
};
export default Botany;
