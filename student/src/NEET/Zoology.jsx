import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Zoology.css";
import { zoologyExplanations } from "./ZoologyExplanation";
import ZoologyExplanation from "./ZoologyExplanation";
import ZoologyQuiz from "./Zoologyquiz"; // Assuming you have a ZoologyQuiz component.

const zoologyTopics = [
  {
    title: "1. THE LIVING WORLD",
    subtopics: [
      { title: "1.1 Characteristics of Living Organisms", type: "explanation" },
      { title: "1.2 Diversity in the Living World", type: "explanation" },
      { title: "1.3 Taxonomic Categories", type: "explanation" },
      { title: "1.4 Taxonomical Aids", type: "explanation" },
      { title: "Assessment - THE LIVING WORLD", type: "quiz" },
    ],
  },
  {
    title: "2. KINGDOM ANIMALIA",
    subtopics: [
      { title: "2.1 Basis of Classification", type: "explanation" },
      { title: "2.2 Classification of Animals", type: "explanation" },
      { title: "2.3 Non-Chordates up to Phylum Level", type: "explanation" },
      { title: "2.4 Chordates up to Class Level", type: "explanation" },
      { title: "Assessment - KINGDOM ANIMALIA", type: "quiz" },
    ],
  },
  {
    title: "3. TISSUE LEVEL OF ORGANISATION",
    subtopics: [
      { title: "3.1 Animal Tissues", type: "explanation" },
      { title: "3.2 Epithelial Tissue", type: "explanation" },
      { title: "3.3 Connective Tissue", type: "explanation" },
      { title: "3.4 Muscular Tissue", type: "explanation" },
      { title: "3.5 Nervous Tissue", type: "explanation" },
      { title: "Assessment - TISSUE LEVEL OF ORGANISATION", type: "quiz" },
    ],
  },
  {
    title: "4. ORGAN AND ORGAN SYSTEMS IN ANIMALS",
    subtopics: [
      { title: "4.1 Morphology and Anatomy of Earthworm", type: "explanation" },
      { title: "4.2 Morphology and Anatomy of Cockroach", type: "explanation" },
      { title: "4.3 Morphology and Anatomy of Frog", type: "explanation" },
      { title: "Assessment - ORGAN AND ORGAN SYSTEMS IN ANIMALS", type: "quiz" },
    ],
  },
  {
    title: "5. DIGESTION AND ABSORPTION",
    subtopics: [
      { title: "5.1 Human Digestive System", type: "explanation" },
      { title: "5.2 Digestive Glands", type: "explanation" },
      { title: "5.3 Mechanism of Digestion", type: "explanation" },
      { title: "5.4 Absorption and Assimilation", type: "explanation" },
      { title: "5.5 Disorders of Digestive System", type: "explanation" },
      { title: "Assessment - DIGESTION AND ABSORPTION", type: "quiz" },
    ],
  },
  {
    title: "6. RESPIRATION",
    subtopics: [
      { title: "6.1 Respiratory Organs", type: "explanation" },
      { title: "6.2 Mechanism of Breathing", type: "explanation" },
      { title: "6.3 Exchange of Gases", type: "explanation" },
      { title: "6.4 Transport of Gases", type: "explanation" },
      { title: "6.5 Regulation of Respiration", type: "explanation" },
      { title: "6.6 Respiratory Disorders", type: "explanation" },
      { title: "Assessment - RESPIRATION", type: "quiz" },
    ],
  },
  {
    title: "7. BODY FLUIDS AND CIRCULATION",
    subtopics: [
      { title: "7.1 Composition of Blood", type: "explanation" },
      { title: "7.2 Blood Groups", type: "explanation" },
      { title: "7.3 Coagulation of Blood", type: "explanation" },
      { title: "7.4 Human Circulatory System", type: "explanation" },
      { title: "7.5 Cardiac Cycle", type: "explanation" },
      { title: "7.6 ECG", type: "explanation" },
      { title: "7.7 Lymphatic System", type: "explanation" },
      { title: "7.8 Disorders of Circulatory System", type: "explanation" },
      { title: "Assessment - BODY FLUIDS AND CIRCULATION", type: "quiz" },
    ],
  },
  {
    title: "8. EXCRETION",
    subtopics: [
      { title: "8.1 Human Excretory System", type: "explanation" },
      { title: "8.2 Mechanism of Urine Formation", type: "explanation" },
      { title: "8.3 Regulation of Kidney Function", type: "explanation" },
      { title: "8.4 Micturition", type: "explanation" },
      { title: "8.5 Role of Other Organs in Excretion", type: "explanation" },
      { title: "8.6 Disorders of Excretory System", type: "explanation" },
      { title: "Assessment - EXCRETION", type: "quiz" },
    ],
  },
  {
    title: "9. LOCOMOTION AND MOVEMENT",
    subtopics: [
      { title: "9.1 Types of Movement", type: "explanation" },
      { title: "9.2 Muscles", type: "explanation" },
      { title: "9.3 Skeletal System", type: "explanation" },
      { title: "9.4 Joints", type: "explanation" },
      { title: "9.5 Disorders of Muscular and Skeletal System", type: "explanation" },
      { title: "Assessment - LOCOMOTION AND MOVEMENT", type: "quiz" },
    ],
  },
  {
    title: "10. NEURAL CONTROL AND COORDINATION",
    subtopics: [
      { title: "10.1 Human Neural System", type: "explanation" },
      { title: "10.2 Neuron and Nerve Impulse", type: "explanation" },
      { title: "10.3 Central Nervous System", type: "explanation" },
      { title: "10.4 Peripheral Nervous System", type: "explanation" },
      { title: "10.5 Reflex Action", type: "explanation" },
      { title: "10.6 Sense Organs", type: "explanation" },
      { title: "Assessment - NEURAL CONTROL AND COORDINATION", type: "quiz" },
    ],
  },
  {
    title: "11. CHEMICAL COORDINATION AND INTEGRATION",
    subtopics: [
      { title: "11.1 Endocrine Glands and Hormones", type: "explanation" },
      { title: "11.2 Mechanism of Hormone Action", type: "explanation" },
      { title: "11.3 Disorders of Endocrine System", type: "explanation" },
      { title: "Assessment - CHEMICAL COORDINATION AND INTEGRATION", type: "quiz" },
    ],
  },
  {
    title: "12. TRENDS IN ECONOMIC ZOOLOGY",
    subtopics: [
      { title: "12.1 Sericulture", type: "explanation" },
      { title: "12.2 Apiculture", type: "explanation" },
      { title: "12.3 Aquaculture", type: "explanation" },
      { title: "12.4 Poultry", type: "explanation" },
      { title: "12.5 Dairy Farming", type: "explanation" },
      { title: "Assessment - TRENDS IN ECONOMIC ZOOLOGY", type: "quiz" },
    ],
  },
];

const Zoology = () => {
     const [expandedTopic, setExpandedTopic] = useState(null);
     const [selectedSubtopic, setSelectedSubtopic] = useState(null);
     const [showTopics, setShowTopics] = useState(true);
     const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
     const navigate = useNavigate();
 
     // User ID for tracking (replace with actual authentication logic)
     const userId = localStorage.getItem("currentUser") || "guest";
 
     const [completedSubtopics, setCompletedSubtopics] = useState(() => {
         const savedData = localStorage.getItem(`completedSubtopics_${userId}_chemistry1`);
         return savedData ? JSON.parse(savedData) : {};
     });
// Reset data on first login for new users
    useEffect(() => {
        const isFirstLogin = localStorage.getItem(`isFirstLogin_${userId}_chemistry1`);
        if (isFirstLogin === null || isFirstLogin === "true") {
            localStorage.removeItem(`completedSubtopics_${userId}_chemistry1`);
            localStorage.setItem(`isFirstLogin_${userId}_chemistry1`, "false");
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
    const topicTitle = zoologyTopics[expandedTopic].title;
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
     localStorage.setItem(`completedSubtopics_${userId}_zoology`, JSON.stringify(newCompletedSubtopics));
            return newCompletedSubtopics;
    });
  };

  return (
    <div className="zoology-container">
      {isMobile && (
        <button className="toggle-btn" onClick={() => setShowTopics(!showTopics)}>
          <FaBars />
          <h2>Zoology Topics</h2>
        </button>
      )}

      {showTopics && (
        <div className="topics-list">
          <ul>
            {zoologyTopics.map((topic, index) => (
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
            <ZoologyQuiz
              topicTitle={zoologyTopics[expandedTopic]?.title}
              subtopicTitle={selectedSubtopic.title}
              onBack={handleBackToTopics}
              onMarkComplete={markSubtopicComplete}
            />
          ) : selectedSubtopic.type === "analysis" ? (
            <ZoologyTestAnalysis
              topicTitle={zoologyTopics[expandedTopic]?.title}
              subtopicTitle={selectedSubtopic.title}
              onBack={handleBackToTopics}
            />
          ) : (
            <ZoologyExplanation
              explanation={zoologyExplanations[selectedSubtopic.title]}
              subtopicTitle={selectedSubtopic.title}
              onBack={handleBackToTopics}
              onMarkComplete={markSubtopicComplete}
            />
          )
        ) : (
           <div className="no-explanation">
            <h2>Welcome to Zoology Topics</h2>
            <p>Select a topic and subtopic to start learning.</p>
          </div>     
           )}
      </div>
    </div>
  );
};

export default Zoology;


