import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PadmasiniChat from "../components/PadmasiniChat";
import "./Chemistry1.css";
import { chemistryExplanations } from './ChemistryExplanation1';
import ChemistryExplanation1 from "./ChemistryExplanation1";
import ChemistryQuiz1 from "./Chemistryquiz1";

const chemistryTopics = [
{
  title: "1. SOME BASIC CONCEPTS OF CHEMISTRY",
  subtopics: [
    { title: "1.1 What is Chemistry?", type: "explanation" },
    { title: "1.2 Laws of Chemical Combinations", type: "explanation" },
    { title: "1.3 Atomic and Molecular Masses", type: "explanation" },
    { title: "1.4 Mole Concept and Molar Mass", type: "explanation" },
    { title: "1.5 Stoichiometry and Limiting Reagent", type: "explanation" },
    { title: "Assessment - SOME BASIC CONCEPTS OF CHEMISTRY", type: "quiz" },
  ],
},
{
  title: "2. STRUCTURE OF ATOM",
  subtopics: [
    { title: "2.1 Discovery of Subatomic Particles", type: "explanation" },
    { title: "2.2 Bohr’s Model and its Limitations", type: "explanation" },
    { title: "2.3 Quantum Mechanical Model of the Atom", type: "explanation" },
    { title: "2.4 Quantum Numbers", type: "explanation" },
    { title: "2.5 Electronic Configuration of Elements", type: "explanation" },
    { title: "Assessment - STRUCTURE OF ATOM", type: "quiz" },
  ],
},
{
  title: "3. CLASSIFICATION OF ELEMENTS AND PERIODICITY IN PROPERTIES",
  subtopics: [
    { title: "3.1 Need for Classification", type: "explanation" },
    { title: "3.2 Mendeleev’s Periodic Table", type: "explanation" },
    { title: "3.3 Modern Periodic Table", type: "explanation" },
    { title: "3.4 Periodic Trends in Properties of Elements", type: "explanation" },
    { title: "Assessment - CLASSIFICATION OF ELEMENTS AND PERIODICITY IN PROPERTIES", type: "quiz" },
  ],
},
{
  title: "4. CHEMICAL BONDING AND MOLECULAR STRUCTURE",
  subtopics: [
    { title: "4.1 Ionic Bond", type: "explanation" },
    { title: "4.2 Covalent Bond", type: "explanation" },
    { title: "4.3 Metallic Bond", type: "explanation" },
    { title: "4.4 Valence Bond Theory", type: "explanation" },
    { title: "4.5 Molecular Orbital Theory", type: "explanation" },
    { title: "4.6 Hybridization", type: "explanation" },
    { title: "Assessment - CHEMICAL BONDING AND MOLECULAR STRUCTURE", type: "quiz" },
  ],
},
{
  title: "5. STATES OF MATTER: GASES AND LIQUIDS",
  subtopics: [
    { title: "5.1 Gaseous State: Properties and Laws", type: "explanation" },
    { title: "5.2 Ideal Gas Equation and its Applications", type: "explanation" },
    { title: "5.3 Liquids: Properties and Structure", type: "explanation" },
    { title: "5.4 Surface Tension and Viscosity", type: "explanation" },
    { title: "Assessment - STATES OF MATTER: GASES AND LIQUIDS", type: "quiz" },
  ],
},
{
  title: "6. THERMODYNAMICS",
  subtopics: [
    { title: "6.1 System and Surroundings", type: "explanation" },
    { title: "6.2 First Law of Thermodynamics", type: "explanation" },
    { title: "6.3 Enthalpy and Internal Energy", type: "explanation" },
    { title: "6.4 Second Law of Thermodynamics", type: "explanation" },
    { title: "6.5 Entropy and Gibbs Free Energy", type: "explanation" },
    { title: "Assessment - THERMODYNAMICS", type: "quiz" },
  ],
},
{
  title: "7. EQUILIBRIUM",
  subtopics: [
    { title: "7.1 Dynamic Nature of Equilibrium", type: "explanation" },
    { title: "7.2 Le Chatelier’s Principle", type: "explanation" },
    { title: "7.3 Equilibrium Constant and its Units", type: "explanation" },
    { title: "7.4 Applications of Equilibrium", type: "explanation" },
    { title: "Assessment - EQUILIBRIUM", type: "quiz" },
  ],
},
{
  title: "8. REDOX REACTIONS",
  subtopics: [
    { title: "8.1 Oxidation and Reduction", type: "explanation" },
    { title: "8.2 Redox Reactions in Terms of Electron Transfer", type: "explanation" },
    { title: "8.3 Balancing Redox Reactions", type: "explanation" },
    { title: "8.4 Oxidizing and Reducing Agents", type: "explanation" },
    { title: "Assessment - REDOX REACTIONS", type: "quiz" },
  ],
},
{
  title: "9. HYDROGEN",
  subtopics: [
    { title: "9.1 Occurrence and Isotopes of Hydrogen", type: "explanation" },
    { title: "9.2 Hydrogen Compounds: Water and Hydrogen Peroxide", type: "explanation" },
    { title: "9.3 Preparation and Properties of Hydrogen", type: "explanation" },
    { title: "9.4 Hydrogen as a Fuel", type: "explanation" },
    { title: "Assessment- HYDROGEN", type: "quiz" },
  ],
},
{
  title: "10. S P D BLOCK ELEMENTS",
  subtopics: [
    { title: "10.1 General Properties of s, p, d-block Elements", type: "explanation" },
    { title: "10.2 Properties of Transition Elements", type: "explanation" },
    { title: "10.3 Lanthanides and Actinides", type: "explanation" },
    { title: "Assessment- S P D BLOCK ELEMENTS", type: "quiz" },
  ],
},
{
  title: "11. ORGANIC CHEMISTRY – SOME BASIC PRINCIPLES AND TECHNIQUES",
  subtopics: [
    { title: "11.1 Some Basic Concepts in Organic Chemistry", type: "explanation" },
    { title: "11.2 Classification of Organic Compounds", type: "explanation" },
    { title: "11.3 Functional Groups", type: "explanation" },
    { title: "11.4 Nomenclature of Organic Compounds", type: "explanation" },
    { title: "11.5 Methods of Preparation and Reactions of Organic Compounds", type: "explanation" },
    { title: "Assessment - ORGANIC CHEMISTRY – SOME BASIC PRINCIPLES AND TECHNIQUES", type: "quiz" },
  ],
},
{
  title: "12. HYDROCARBONS",
  subtopics: [
    { title: "12.1 Alkanes, Alkenes, and Alkynes", type: "explanation" },
    { title: "12.2 Properties of Hydrocarbons", type: "explanation" },
    { title: "12.3 Aromatic Hydrocarbons", type: "explanation" },
    { title: "12.4 Methods of Preparation and Reactions of Hydrocarbons", type: "explanation" },
    { title: "Assessment - HYDROCARBONS", type: "quiz" },
  ],
},
{
  title: "13. ENVIRONMENTAL CHEMISTRY",
  subtopics: [
    { title: "13.1 Environmental Pollution", type: "explanation" },
    { title: "13.2 Greenhouse Effect and Global Warming", type: "explanation" },
    { title: "13.3 Ozone Depletion", type: "explanation" },
    { title: "13.4 Water Pollution and Treatment", type: "explanation" },
    { title: "13.5 Waste Management and Green Chemistry", type: "explanation" },
    { title: "Assessment - ENVIRONMENTAL CHEMISTRY ", type: "quiz" },
  ],
},
]; 
const Chemistry1 = () => {
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
const isTopicCompleted = (topic) => {
    const completed = completedSubtopics[topic.title] || {};
    return topic.subtopics.every((sub) => completed[sub.title]);
  };

  const isTopicUnlocked = (index) => {
    if (index === 0) return true;
    return isTopicCompleted(chemistryTopics[index - 1]);
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
        const topicTitle = chemistryTopics[expandedTopic].title;
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
            localStorage.setItem(`completedSubtopics_${userId}_chemistry1`, JSON.stringify(newCompletedSubtopics));
            return newCompletedSubtopics;
        });
    };

    return (
        <div className="chemistry1-container">
            {isMobile && (
                <button className="toggle-btn" onClick={() => setShowTopics(!showTopics)}>
                    <FaBars />
                    <h2>Chemistry Topics</h2>
                </button>
            )}

            {showTopics && (
                <div className="topics-list">
                    <ul>
                        {chemistryTopics.map((topic, index) => {
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
                        <ChemistryQuiz1
                            topicTitle={chemistryTopics[expandedTopic]?.title}
                            subtopicTitle={selectedSubtopic.title}
                            onBack={handleBackToTopics}
                            onMarkComplete={markSubtopicComplete}
                        />
                    ) : (
                        <ChemistryExplanation1
                            explanation={chemistryExplanations[selectedSubtopic.title]}
                            subtopicTitle={selectedSubtopic.title}
                            onBack={handleBackToTopics}
                            onMarkComplete={markSubtopicComplete}
                        />
                    )
                ) : (
                    <div className="no-explanation">
                        <h2>Welcome to Chemistry Topics</h2>
                        <p>Select a topic and subtopic to start learning.</p>
                    </div>
                )}
            </div>
            <PadmasiniChat subjectName="Chemistry" />
        </div>
    );
};

export default Chemistry1;
