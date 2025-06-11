import React, { useState, useEffect } from "react";
import "./MathsQuiz.css";
import { FaCheckCircle } from "react-icons/fa";

const MathsQuiz = ({ topicTitle, subtopicTitle, onBack, onMarkComplete }) => {

const quizData = {
    "Assessment - NUMBER SYSTEM": [
      {
        question: "Which of the following is an irrational number?",
        options: ["√2", "4", "1/3", "7"],
        answer: "√2",
      },
      {
        question: "What is the decimal expansion of 1/3?",
        options: ["0.333...", "0.25", "0.1", "0.5"],
        answer: "0.333...",
      },
      {
        question: "Which of the following is a rational number?",
        options: ["π", "√3", "4/7", "√5"],
        answer: "4/7",
      },
      {
        question: "What is the least common multiple (LCM) of 4 and 6?",
        options: ["12", "24", "18", "36"],
        answer: "12",
      },
    ],
  
    "Assessment - ALGEBRA": [
      {
        question: "What is the value of x in the equation 2x + 3 = 7?",
        options: ["1", "2", "3", "4"],
        answer: "2",
      },
      {
        question: "Simplify: 5x - 3x + 4",
        options: ["2x + 4", "2x - 4", "3x + 4", "3x - 4"],
        answer: "2x + 4",
      },
      {
        question: "Solve for y: 3y - 5 = 10",
        options: ["y = 5", "y = 15", "y = 10", "y = 20"],
        answer: "y = 5",
      },
      {
        question: "What is the factorization of x² - 5x + 6?",
        options: ["(x - 2)(x - 3)", "(x - 1)(x - 6)", "(x + 2)(x - 3)", "(x - 1)(x + 6)"],
        answer: "(x - 2)(x - 3)",
      },
    ],
  
    "Assessment - GEOMETRY": [
      {
        question: "What is the area of a rectangle with length 5 and width 3?",
        options: ["15", "8", "20", "25"],
        answer: "15",
      },
      {
        question: "What is the circumference of a circle with radius 7?",
        options: ["44", "14", "21.99", "49"],
        answer: "44",
      },
      {
        question: "In a right-angled triangle, if the base is 3 and the height is 4, what is the hypotenuse?",
        options: ["5", "6", "4", "7"],
        answer: "5",
      },
      {
        question: "What is the sum of the interior angles of a triangle?",
        options: ["180°", "360°", "90°", "270°"],
        answer: "180°",
      },
    ],
  
    "Assessment - MENSURATION": [
      {
        question: "What is the area of a circle with radius 5?",
        options: ["78.5", "25π", "50", "12.57"],
        answer: "78.5",
      },
      {
        question: "What is the surface area of a cube with side length 3?",
        options: ["54", "36", "18", "27"],
        answer: "54",
      },
      {
        question: "What is the volume of a sphere with radius 6?",
        options: ["904.32", "500", "113.04", "72.57"],
        answer: "904.32",
      },
      {
        question: "What is the perimeter of a rectangle with length 8 and width 3?",
        options: ["22", "24", "16", "18"],
        answer: "22",
      },
    ],
  
    "Assessment - COORDINATE GEOMETRY": [
      {
        question: "What is the distance between the points (3, 4) and (6, 8)?",
        options: ["5", "6", "4", "7"],
        answer: "5",
      },
      {
        question: "What is the midpoint of the points (2, 3) and (4, 5)?",
        options: ["(3, 4)", "(1, 1)", "(2, 2)", "(5, 6)"],
        answer: "(3, 4)",
      },
      {
        question: "What is the slope of the line passing through points (1, 2) and (3, 4)?",
        options: ["1", "2", "0.5", "4"],
        answer: "1",
      },
      {
        question: "What is the equation of the line passing through the origin with slope 2?",
        options: ["y = 2x", "y = x + 2", "y = x", "y = 3x"],
        answer: "y = 2x",
      },
    ],
  
    "Assessment - STATISTICS AND PROBABILITY": [
      {
        question: "What is the mean of the data set [2, 4, 6, 8, 10]?",
        options: ["6", "5", "7", "8"],
        answer: "6",
      },
      {
        question: "What is the probability of rolling a 3 on a fair 6-sided die?",
        options: ["1/6", "1/3", "1/2", "1/4"],
        answer: "1/6",
      },
      {
        question: "Which of the following is the median of the data set [5, 3, 8, 7, 2]?",
        options: ["5", "3", "8", "7"],
        answer: "5",
      },
      {
        question: "What is the mode of the data set [4, 5, 5, 6, 7]?",
        options: ["5", "4", "6", "7"],
        answer: "5",
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


export default MathsQuiz;
