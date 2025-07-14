import "./NeetQuiz.css";
import { FaCheckCircle } from "react-icons/fa";
import React, { useState, useEffect } from "react";

const NeetQuiz = ({ topicTitle, subtopicTitle, onBack, onMarkComplete }) => {
  const quizData = {
  // Botany
  "Assessment - CELL STRUCTURE": [
    {
      question: "Which organelle is known as the powerhouse of the cell?",
      options: ["Nucleus", "Golgi body", "Mitochondria", "Chloroplast"],
      answer: "Mitochondria",
    },
    {
      question: "What structure is found in plant cells but not animal cells?",
      options: ["Mitochondria", "Chloroplast", "Ribosome", "Nucleus"],
      answer: "Chloroplast",
    },
  ],
  "Assessment - PLANT PHYSIOLOGY": [
    {
      question: "Where does photosynthesis primarily occur?",
      options: ["Roots", "Chloroplast", "Mitochondria", "Nucleus"],
      answer: "Chloroplast",
    },
    {
      question: "Which gas is released during photosynthesis?",
      options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
      answer: "Oxygen",
    },
  ],

  // Zoology
  "Assessment - HUMAN PHYSIOLOGY": [
    {
      question: "Which enzyme is present in saliva?",
      options: ["Pepsin", "Amylase", "Trypsin", "Lipase"],
      answer: "Amylase",
    },
    {
      question: "Which organ is responsible for oxygen exchange?",
      options: ["Heart", "Kidney", "Lungs", "Liver"],
      answer: "Lungs",
    },
  ],
  "Assessment - ANIMAL BEHAVIOR": [
    {
      question: "What type of behavior is innate?",
      options: ["Learned", "Instinct", "Social", "Conditioned"],
      answer: "Instinct",
    },
    {
      question: "Which is an example of learned behavior?",
      options: ["Migration", "Reflex", "Training a dog", "Yawning"],
      answer: "Training a dog",
    },
  ],

  // Chemistry
  "Assessment - ATOMIC STRUCTURE": [
    {
      question: "Who proposed the planetary model of the atom?",
      options: ["Dalton", "Bohr", "Rutherford", "Thomson"],
      answer: "Bohr",
    },
    {
      question: "Which subatomic particle has a negative charge?",
      options: ["Proton", "Electron", "Neutron", "Nucleus"],
      answer: "Electron",
    },
  ],
  "Assessment - ORGANIC CHEMISTRY": [
    {
      question: "What is the general formula of alkanes?",
      options: ["CnH2n", "CnH2n+2", "CnH2n-2", "CnHn"],
      answer: "CnH2n+2",
    },
    {
      question: "Which hydrocarbon contains a triple bond?",
      options: ["Alkane", "Alkene", "Alkyne", "Cycloalkane"],
      answer: "Alkyne",
    },
  ],

  // Physics
  "Assessment - UNIT AND MEASURE": [
    {
      question: "What is the SI unit of force?",
      options: ["Newton", "Joule", "Watt", "Pascal"],
      answer: "Newton",
    },
    {
      question: "Which of the following is a base unit?",
      options: ["Newton", "Joule", "Meter", "Hertz"],
      answer: "Meter",
    },
  ],
  "Assessment - KINEMATICS": [
    {
      question: "What does the slope of a velocity-time graph represent?",
      options: ["Velocity", "Displacement", "Acceleration", "Distance"],
      answer: "Acceleration",
    },
    {
      question: "Which physical quantity is a vector?",
      options: ["Speed", "Distance", "Displacement", "Mass"],
      answer: "Displacement",
    },
  ],
  "Assessment - THERMODYNAMICS": [
    {
      question: "Which law of thermodynamics is about conservation of energy?",
      options: ["First", "Second", "Third", "Zeroth"],
      answer: "First",
    },
    {
      question: "Which device converts heat into work?",
      options: ["Battery", "Generator", "Heat engine", "Transformer"],
      answer: "Heat engine",
    },
  ],
  "Assessment - WAVES AND OSCILLATIONS": [
    {
      question: "What is the unit of frequency?",
      options: ["Hertz", "Joule", "Newton", "Watt"],
      answer: "Hertz",
    },
    {
      question: "Which motion is periodic in nature?",
      options: ["Linear", "Circular", "Simple Harmonic", "Random"],
      answer: "Simple Harmonic",
    },
  ],
};


  const questions = quizData[subtopicTitle] || [];
  const [userAnswers, setUserAnswers] = useState(Array(questions.length).fill(""));
  const [submitted, setSubmitted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(120);
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

  const score = questions.reduce((acc, q, i) => (q.answer === userAnswers[i] ? acc + 1 : acc), 0);
  const percentage = ((score / questions.length) * 100).toFixed(2);

  const handleSubmit = () => {
    setSubmitted(true);
    setShowConfirmation(false);
    localStorage.setItem(`answers-${subtopicTitle}`, JSON.stringify(userAnswers));
    localStorage.setItem(`quizData-${subtopicTitle}`, JSON.stringify(questions));

    if (percentage === "100.00") {
      localStorage.setItem(`completed-${subtopicTitle}`, "true");
      localStorage.setItem(`neet-completed-${subtopicTitle}`, "true"); // ✅ Required for NeetLearn progress
      setIsComplete(true);
      if (onMarkComplete) onMarkComplete("quiz");
    }
  };

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

  useEffect(() => {
    const completedKey = `completed-${subtopicTitle}`;
    const neetCompletedKey = `neet-completed-${subtopicTitle}`;
    const isDone =
      localStorage.getItem(completedKey) === "true" ||
      localStorage.getItem(neetCompletedKey) === "true";
    if (isDone) {
      setIsComplete(true);
    }
  }, [subtopicTitle]);

  const currentQuestion = questions[currentQIndex];
  if (!currentQuestion) {
    return (
      <div className="quiz-wrapper">
        <div className="quiz-container">
          <h2>{subtopicTitle}</h2>
          <p>No questions available for this topic.</p>
          <button className="back-btn" onClick={onBack}>Back to Topics</button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-wrapper">
      <div className="quiz-container">
        <h2>{subtopicTitle}</h2>

        <button
          onClick={handleSubmit}
          className={`complete-btn ${isComplete ? "completed" : ""}`}
          disabled={isComplete || !submitted}
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
            <p><strong>Total Questions:</strong> {questions.length}</p>
            <p><strong>Time Limit:</strong> 2 minutes</p>
            <p><strong>Minimum Marks to Pass:</strong> 100%</p>
            <button className="start-btn" onClick={() => setHasStarted(true)}>Start Assessment</button>
            <button className="back-btn" onClick={onBack}>Back to Topics</button>
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
                      className={`option-label ${isCorrect ? "correct" : ""} ${isIncorrect ? "incorrect" : ""}`}
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
                <button onClick={handlePrevious} disabled={currentQIndex === 0} className="nav-btn">Previous</button>
                {currentQIndex < questions.length - 1 ? (
                  <button onClick={handleNext} className="nav-btn">Next</button>
                ) : !submitted ? (
                  <button onClick={() => setShowConfirmation(true)} className="submit-btn">Submit</button>
                ) : null}
              </div>

              {showConfirmation && (
                <div className="confirmation-popup">
                  <p>Are you sure you want to submit your answers?</p>
                  <button onClick={handleSubmit} className="confirm-btn">Yes</button>
                  <button onClick={() => setShowConfirmation(false)} className="cancel-btn">No</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {submitted && (
        <div className="result-popup">
          <div className="result-popup-content">
            <h3>Quiz Result</h3>
            <p>You scored {score} out of {questions.length} ({percentage}%)</p>
            {percentage !== "100.00" && (
              <p className="not-eligible-msg">
                You must score 100% to mark this quiz as completed. Try again!
              </p>
            )}
            <button onClick={onBack} className="back-btn">Back to Topics</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NeetQuiz;
