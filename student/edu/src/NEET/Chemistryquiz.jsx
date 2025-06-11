import React, { useState, useEffect } from "react";
import "./Chemistryquiz.css";
import { FaCheckCircle } from "react-icons/fa";

const ChemistryQuiz = ({ topicTitle, subtopicTitle, onBack, onMarkComplete }) => {
  const quizData = {
    "Assessment - SOME BASIC CONCEPTS OF CHEMISTRY": [
      {
        question: "Which law explains the conservation of mass during a chemical reaction?",
        options: ["Law of Definite Proportions", "Law of Conservation of Mass", "Law of Multiple Proportions", "Avogadro’s Law"],
        answer: "Law of Conservation of Mass",
      },
      {
        question: "What is the SI unit of amount of substance?",
        options: ["Gram", "Kilogram", "Mole", "Liter"],
        answer: "Mole",
      },
      {
        question: "What is the molar mass of water (H₂O)?",
        options: ["16 g/mol", "18 g/mol", "20 g/mol", "22 g/mol"],
        answer: "18 g/mol",
      },
      {
        question: "Which of the following is NOT a fundamental law of chemical combination?",
        options: ["Law of Reciprocal Proportions", "Law of Conservation of Energy", "Law of Definite Proportions", "Law of Multiple Proportions"],
        answer: "Law of Conservation of Energy",
      },
    ],
  
    "Assessment - STRUCTURE OF ATOM": [
      {
        question: "Who discovered the electron?",
        options: ["Rutherford", "Bohr", "Thomson", "Chadwick"],
        answer: "Thomson",
      },
      {
        question: "Which subatomic particle has no charge?",
        options: ["Electron", "Proton", "Neutron", "Positron"],
        answer: "Neutron",
      },
      {
        question: "Which model introduced quantized energy levels?",
        options: ["Bohr Model", "Rutherford Model", "Quantum Mechanical Model", "Thomson Model"],
        answer: "Bohr Model",
      },
      {
        question: "Which quantum number describes the shape of an orbital?",
        options: ["Principal quantum number", "Azimuthal quantum number", "Magnetic quantum number", "Spin quantum number"],
        answer: "Azimuthal quantum number",
      },
    ],
  
    "Assessment - CLASSIFICATION OF ELEMENTS AND PERIODICITY IN PROPERTIES": [
      {
        question: "Who developed the Modern Periodic Table?",
        options: ["Mendeleev", "Newlands", "Bohr", "Mosley"],
        answer: "Mosley",
      },
      {
        question: "What is the periodicity in the periodic table based on?",
        options: ["Atomic mass", "Atomic number", "Number of neutrons", "Mass number"],
        answer: "Atomic number",
      },
      {
        question: "What happens to atomic radius across a period?",
        options: ["Increases", "Decreases", "Remains the same", "Doubles"],
        answer: "Decreases",
      },
      {
        question: "Which of the following is an alkaline earth metal?",
        options: ["Na", "Mg", "Cl", "K"],
        answer: "Mg",
      },
    ],
  
    "Assessment - CHEMICAL BONDING AND MOLECULAR STRUCTURE": [
      {
        question: "Which bond involves sharing of electrons?",
        options: ["Ionic bond", "Covalent bond", "Hydrogen bond", "Metallic bond"],
        answer: "Covalent bond",
      },
      {
        question: "The octet rule is violated in which of the following?",
        options: ["CH₄", "BeCl₂", "H₂O", "CO₂"],
        answer: "BeCl₂",
      },
      {
        question: "What is the shape of a molecule with 4 bonding pairs and no lone pairs?",
        options: ["Trigonal planar", "Linear", "Tetrahedral", "Bent"],
        answer: "Tetrahedral",
      },
      {
        question: "Which theory explains the formation of sigma and pi bonds?",
        options: ["Valence Bond Theory", "Molecular Orbital Theory", "Hybridization Theory", "None of the above"],
        answer: "Valence Bond Theory",
      },
    ],
  
    "Assessment - STATES OF MATTER: GASES AND LIQUIDS": [
        {
          question: "Which gas law states that volume is inversely proportional to pressure?",
          options: ["Boyle's Law", "Charles's Law", "Avogadro's Law", "Ideal Gas Law"],
          answer: "Boyle's Law",
        },
        {
          question: "Which variable remains constant in Charles's Law?",
          options: ["Pressure", "Volume", "Temperature", "Moles"],
          answer: "Pressure",
        },
        {
          question: "What is the SI unit of pressure?",
          options: ["Pascal", "Bar", "Atmosphere", "Torr"],
          answer: "Pascal",
        },
        {
          question: "Which of the following is a property of liquids but not of gases?",
          options: ["Definite volume", "High compressibility", "Low density", "Fills entire container"],
          answer: "Definite volume",
        },
      ],
      "Assessment - THERMODYNAMICS": [
        {
          question: "Which of the following is a state function?",
          options: ["Heat", "Work", "Enthalpy", "Path"],
          answer: "Enthalpy",
        },
        {
          question: "The first law of thermodynamics is also known as the law of:",
          options: ["Entropy", "Conservation of Mass", "Conservation of Energy", "Free Energy"],
          answer: "Conservation of Energy",
        },
        {
          question: "Which symbol represents entropy?",
          options: ["H", "U", "G", "S"],
          answer: "S",
        },
        {
          question: "Which of the following indicates a spontaneous process?",
          options: ["ΔG > 0", "ΔG = 0", "ΔG < 0", "ΔH > 0"],
          answer: "ΔG < 0",
        },
      ],
      "Assessment - EQUILIBRIUM": [
        {
          question: "Which principle explains the effect of concentration on equilibrium?",
          options: ["Avogadro's Law", "Boyle's Law", "Le Chatelier's Principle", "Dalton's Law"],
          answer: "Le Chatelier's Principle",
        },
        {
          question: "At equilibrium, the rate of forward and reverse reactions are:",
          options: ["Equal", "Zero", "Increasing", "Decreasing"],
          answer: "Equal",
        },
        {
          question: "What is the equilibrium constant (Kc) for a reaction dependent on?",
          options: ["Pressure", "Temperature", "Catalyst", "Volume"],
          answer: "Temperature",
        },
        {
          question: "Which of the following does NOT affect the position of equilibrium?",
          options: ["Concentration", "Pressure", "Catalyst", "Temperature"],
          answer: "Catalyst",
        },
      ],
  "Assessment - REDOX REACTIONS": [
{
question: "What happens to the oxidation number of an element that is reduced?",
options: ["It increases", "It decreases", "It remains the same", "It becomes zero"],
answer: "It decreases",
},
{
question: "Which of the following is a redox reaction?",
options: ["HCl + NaOH → NaCl + H₂O", "Zn + CuSO₄ → ZnSO₄ + Cu", "AgNO₃ + NaCl → AgCl + NaNO₃", "BaCl₂ + H₂SO₄ → BaSO₄ + 2HCl"],
answer: "Zn + CuSO₄ → ZnSO₄ + Cu",
},
{
question: "In the reaction: 2Mg + O₂ → 2MgO, which species is oxidized?",
options: ["O₂", "MgO", "Mg", "None"],
answer: "Mg",
},
{
question: "Which of the following is the oxidizing agent in the reaction: 2H₂ + O₂ → 2H₂O?",
options: ["H₂", "O₂", "H₂O", "None"],
answer: "O₂",
},
],

"Assessment- HYDROGEN": [
{
question: "Which isotope of hydrogen has one proton and one neutron?",
options: ["Protium", "Deuterium", "Tritium", "Hydron"],
answer: "Deuterium",
},
{
question: "Hydrogen can act as a:",
options: ["Oxidizing agent only", "Reducing agent only", "Both oxidizing and reducing agent", "Neither"],
answer: "Both oxidizing and reducing agent",
},
{
question: "Which compound is a strong oxidizing agent?",
options: ["H₂O", "HCl", "H₂O₂", "CH₄"],
answer: "H₂O₂",
},
{
question: "Which of the following is a method for industrial hydrogen production?",
options: ["Electrolysis of water", "Decomposition of ammonia", "Reaction of zinc with sulfuric acid", "Combustion of hydrocarbons"],
answer: "Electrolysis of water",
},
],

"Assessment- S P D BLOCK ELEMENTS": [
{
question: "Which block contains transition elements?",
options: ["s-block", "p-block", "d-block", "f-block"],
answer: "d-block",
},
{
question: "Which element is a lanthanide?",
options: ["Fe", "Ce", "Zn", "Ag"],
answer: "Ce",
},
{
question: "Transition metals often form:",
options: ["Colorless compounds", "Inert gases", "Colored compounds", "Non-metallic compounds"],
answer: "Colored compounds",
},
{
question: "Which of the following has variable oxidation states?",
options: ["Na", "Mg", "Cu", "Ne"],
answer: "Cu",
},
],

"Assessment - ORGANIC CHEMISTRY – SOME BASIC PRINCIPLES AND TECHNIQUES": [
{
question: "What is the IUPAC name of CH₃CH₂OH?",
options: ["Ethanol", "Methanol", "Ethene", "Acetone"],
answer: "Ethanol",
},
{
question: "Which of the following is a functional group?",
options: ["Alkane", "Ester", "Isomer", "Alkyl"],
answer: "Ester",
},
{
question: "Which type of isomerism involves different connectivity of atoms?",
options: ["Conformational", "Geometrical", "Structural", "Optical"],
answer: "Structural",
},
{
question: "Which method is used to purify a solid organic compound?",
options: ["Filtration", "Distillation", "Recrystallization", "Evaporation"],
answer: "Recrystallization",
},
],

"Assessment - HYDROCARBONS": [
{
question: "Which hydrocarbon has only single bonds?",
options: ["Alkene", "Alkyne", "Alkane", "Aromatic hydrocarbon"],
answer: "Alkane",
},
{
question: "Which compound is aromatic?",
options: ["Cyclohexane", "Benzene", "Butyne", "Ethene"],
answer: "Benzene",
},
{
question: "The general formula for alkenes is:",
options: ["CnH2n+2", "CnH2n-2", "CnH2n", "CnHn"],
answer: "CnH2n",
},
{
question: "What is the main product of complete combustion of hydrocarbons?",
options: ["Carbon monoxide and water", "Carbon dioxide and water", "Methane", "Soot"],
answer: "Carbon dioxide and water",
},
],

"Assessment - ENVIRONMENTAL CHEMISTRY": [
{
question: "Which gas is primarily responsible for global warming?",
options: ["Nitrogen", "Carbon dioxide", "Oxygen", "Hydrogen"],
answer: "Carbon dioxide",
},
{
question: "Which pollutant causes acid rain?",
options: ["O₃", "SO₂", "CH₄", "N₂"],
answer: "SO₂",
},
{
question: "Ozone layer depletion is mainly caused by:",
options: ["CO₂", "CFCs", "NO₂", "SO₂"],
answer: "CFCs",
},
{
question: "Green chemistry focuses on:",
options: ["More plastic production", "Pollution increase", "Waste minimization", "Cost reduction only"],
answer: "Waste minimization",
},
],
};

  const questions = quizData[subtopicTitle] || [];
  const [userAnswers, setUserAnswers] = useState(Array(questions.length).fill(""));
  const [submitted, setSubmitted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes
  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setUserAnswers(Array(questions.length).fill(""));
    setSubmitted(false);
    setCurrentQIndex(0);
    setTimeRemaining(120);
    setHasStarted(false);
    setShowConfirmation(false);
    setIsComplete(false);
  }, [subtopicTitle]);

  useEffect(() => {
    if (timeRemaining > 0 && !submitted && hasStarted) {
      const timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining, submitted, hasStarted]);

  useEffect(() => {
    if (timeRemaining === 0 && hasStarted && !submitted) {
      setSubmitted(true);
      onMarkComplete("quiz");
    }
  }, [timeRemaining, hasStarted, submitted, onMarkComplete]);

  const handleOptionChange = (selected) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQIndex] = selected;
    setUserAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(currentQIndex - 1);
    }
  };

  const confirmSubmit = () => setShowConfirmation(true);

  const handleSubmit = () => {
    setSubmitted(true);
    setShowConfirmation(false);
    localStorage.setItem(`answers-${subtopicTitle}`, JSON.stringify(userAnswers));
    localStorage.setItem(`quizData-${subtopicTitle}`, JSON.stringify(questions));
    onMarkComplete("quiz");
  };

  useEffect(() => {
    const storedCompletion = localStorage.getItem(`completed-${subtopicTitle}`);
    if (storedCompletion === "true") {
      setIsComplete(true);
    }
  }, [subtopicTitle]);

  const handleMarkComplete = () => {
    setIsComplete(true);
    localStorage.setItem(`completed-${subtopicTitle}`, "true");
    if (onMarkComplete) onMarkComplete("explanation");
  };

  const score = questions.reduce((acc, q, i) => (q.answer === userAnswers[i] ? acc + 1 : acc), 0);
  const currentQuestion = questions[currentQIndex];

  return (
    <div className="quiz-wrapper">
      <div className="quiz-container">
        <h2>{subtopicTitle}</h2>
        <button
          onClick={handleMarkComplete}
          className={`complete-btn ${isComplete ? "completed" : ""}`}
          disabled={isComplete}
        >
          {isComplete ? (
            <>
              Completed <FaCheckCircle className="check-icon" />
            </>
          ) : (
            "Mark as Complete"
          )}
        </button>

        {!hasStarted ? (
          <div className="start-screen">
            <p>
              <strong>Total Questions:</strong> {questions.length}
            </p>
            <p>
              <strong>Time Limit:</strong> 2 minutes
            </p>
            <p>
              <strong>Minimum Marks to Pass:</strong> 50%
            </p>
            <button className="start-btn" onClick={() => setHasStarted(true)}>
              Start Assessment
            </button>
            <button className="back-btn" onClick={onBack}>
              Back to Topics
            </button>
          </div>
        ) : (
          <>
            <div className="timer">
              <p>
                Time Remaining: {Math.floor(timeRemaining / 60)}:
                {String(timeRemaining % 60).padStart(2, "0")}
              </p>
            </div>

            <div className="quiz-question">
              <p className="question-text">
                {currentQIndex + 1}. {currentQuestion.question}
              </p>
              <div className="options-group">
                {currentQuestion.options.map((opt, j) => {
                  const isSelected = userAnswers[currentQIndex] === opt;
                  const isCorrect = submitted && opt === currentQuestion.answer;
                  const isIncorrect = submitted && isSelected && opt !== currentQuestion.answer;

                  return (
                    <label
                      key={j}
                      className={`option-label ${isCorrect ? "correct" : ""} ${
                        isIncorrect ? "incorrect" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQIndex}`}
                        value={opt}
                        checked={isSelected}
                        onChange={() => handleOptionChange(opt)}
                        disabled={submitted}
                      />
                      {opt}
                    </label>
                  );
                })}
              </div>

              {submitted && userAnswers[currentQIndex] !== "" && (
                <p className="answer-feedback">
                  {userAnswers[currentQIndex] === currentQuestion.answer
                    ? "Correct!"
                    : `Incorrect. Correct answer: ${currentQuestion.answer}`}
                </p>
              )}

              <div className="navigation-buttons">
                <button
                  onClick={handlePrevious}
                  disabled={currentQIndex === 0}
                  className="nav-btn"
                >
                  Previous
                </button>
                {currentQIndex < questions.length - 1 ? (
                  <button onClick={handleNext} className="nav-btn">
                    Next
                  </button>
                ) : !submitted ? (
                  <button onClick={confirmSubmit} className="submit-btn">
                    Submit
                  </button>
                ) : (
                  <div className="score-display">
                    <p>
                      You scored {score} out of {questions.length} (
                      {((score / questions.length) * 100).toFixed(2)}%)
                    </p>
                    <button onClick={onBack} className="back-btn">
                      Back to Topics
                    </button>
                  </div>
                )}
              </div>
            </div>

            {showConfirmation && (
              <div className="confirmation-popup">
                <p>Are you sure you want to submit your answers?</p>
                <button onClick={handleSubmit} className="confirm-btn">
                  Yes
                </button>
                <button onClick={() => setShowConfirmation(false)} className="cancel-btn">
                  No
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChemistryQuiz;
