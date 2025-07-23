import "./JeeQuiz.css"; // Reuse existing styles
import { FaCheckCircle } from "react-icons/fa";
import React, { useState, useEffect } from "react";

const JeeQuiz = ({ topicTitle, subtopicTitle, onBack, onMarkComplete }) => {
  const quizData = {
    "Assessment - 1.3 Significant Figures": [
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

  const score = questions.reduce(
    (acc, q, i) => (q.answer === userAnswers[i] ? acc + 1 : acc),
    0
  );
  const percentage = ((score / questions.length) * 100).toFixed(2);

  const handleSubmit = () => {
    setSubmitted(true);
    setShowConfirmation(false);
    sessionStorage.setItem(`answers-${subtopicTitle}`, JSON.stringify(userAnswers));
    sessionStorage.setItem(`quizData-${subtopicTitle}`, JSON.stringify(questions));

    if (percentage === "100.00") {
      sessionStorage.setItem(`completed-${subtopicTitle}`, "true");
      sessionStorage.setItem(`jee-completed-${subtopicTitle}`, "true");
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
    const isDone =
      sessionStorage.getItem(`completed-${subtopicTitle}`) === "true" ||
      sessionStorage.getItem(`jee-completed-${subtopicTitle}`) === "true";
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
          <button className="back-btn" onClick={onBack}>
            Back to Topics
          </button>
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
                  <button onClick={() => setShowConfirmation(true)} className="submit-btn">
                    Submit
                  </button>
                ) : null}
              </div>

              {showConfirmation && (
                <div className="confirmation-popup">
                  <p>Are you sure you want to submit your answers?</p>
                  <button onClick={handleSubmit} className="confirm-btn">
                    Yes
                  </button>
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="cancel-btn"
                  >
                    No
                  </button>
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
            <p>
              You scored {score} out of {questions.length} ({percentage}%)
            </p>
            {percentage !== "100.00" && (
              <p className="not-eligible-msg">
                You must score 100% to mark this quiz as completed. Try again!
              </p>
            )}
            <button onClick={onBack} className="back-btn">
              Back to Topics
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JeeQuiz;
