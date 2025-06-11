import React, { useState, useEffect } from "react";
import "./Physicsquiz1.css";
import { FaCheckCircle } from "react-icons/fa";

const PhysicsQuiz1 = ({ topicTitle, subtopicTitle, onBack, onMarkComplete }) => {
 
  const quizData = {
    "Assessment - UNIT AND MEASURE": [
      {
        question: "Which of the following is a fundamental unit in SI?",
        options: ["Gram", "Newton", "Meter", "Liter"],
        answer: "Meter",
      },
      {
        question: "What is the dimensional formula of force?",
        options: ["MLT^-2", "ML^2T^-1", "ML^-1T^2", "MT^-1"],
        answer: "MLT^-2",
      },
      {
        question: "Significant figures in 0.00560 are:",
        options: ["2", "3", "4", "5"],
        answer: "3",
      },
      {
        question: "Which of the following is the unit of acceleration in SI?",
        options: ["m/s", "m/s^2", "kg.m/s", "kg.m/s^2"],
        answer: "m/s^2",
      },
    ],

    "Assessment - MOTION IN A STRAIGHT LINE": [
      {
        question: "The average speed is given by:",
        options: ["Distance / Time", "Displacement / Time", "Distance / Velocity", "Displacement / Acceleration"],
        answer: "Distance / Time",
      },
      {
        question: "What is the formula for acceleration when an object starts from rest and moves uniformly?",
        options: ["v = u + at", "v^2 = u^2 + 2as", "s = ut + 1/2 at^2", "All of the above"],
        answer: "All of the above",
      },
      {
        question: "What is the difference between displacement and path length?",
        options: ["Displacement is the shortest distance between two points, path length is the total distance traveled", "Displacement and path length are the same", "Displacement is always greater than path length", "Path length is a vector, displacement is scalar"],
        answer: "Displacement is the shortest distance between two points, path length is the total distance traveled",
      },
      {
        question: "What does relative velocity refer to?",
        options: ["Velocity of an object with respect to a reference frame", "The speed of light", "The velocity difference between two objects", "Both a and c"],
        answer: "Both a and c",
      },
    ],

    "Assessment - MOTION IN A PLANE": [
      {
        question: "What is a scalar quantity?",
        options: ["Displacement", "Velocity", "Speed", "Acceleration"],
        answer: "Speed",
      },
      {
        question: "If two vectors A and B are perpendicular, what is the magnitude of their resultant vector?",
        options: ["√(A² + B²)", "A + B", "A - B", "A × B"],
        answer: "√(A² + B²)",
      },
      {
        question: "What is the path of a projectile dependent on?",
        options: ["Initial velocity and launch angle", "Air resistance and gravitational force", "Both a and b", "Only gravitational force"],
        answer: "Both a and b",
      },
      {
        question: "What is the acceleration of an object in uniform circular motion?",
        options: ["Zero", "Constant velocity", "Centripetal acceleration", "Linear acceleration"],
        answer: "Centripetal acceleration",
      },
    ],

    "Assessment - LAWS OF MOTION": [
      {
        question: "What is Newton's First Law of Motion also called?",
        options: ["Law of Inertia", "Law of Acceleration", "Law of Force", "Law of Momentum"],
        answer: "Law of Inertia",
      },
      {
        question: "What is the formula for Newton's Second Law of Motion?",
        options: ["F = ma", "F = mv²", "F = m/a", "F = d/t"],
        answer: "F = ma",
      },
      {
        question: "According to Newton's Third Law, for every action there is:",
        options: ["A reaction of the same type", "A reaction of equal magnitude", "A reaction of opposite direction", "None of the above"],
        answer: "A reaction of opposite direction",
      },
      {
        question: "In a perfectly inelastic collision, what happens to the objects?",
        options: ["They bounce off each other", "They stick together", "They explode", "They disintegrate"],
        answer: "They stick together",
      },
    ],

    "Assessment - WORK, ENERGY AND POWER": [
      {
        question: "The work-energy theorem states that:",
        options: ["Work is equal to the change in potential energy", "Work is equal to the change in kinetic energy", "Work is inversely proportional to force", "Power is the rate of doing work"],
        answer: "Work is equal to the change in kinetic energy",
      },
      {
        question: "What is the formula for kinetic energy?",
        options: ["KE = 1/2 mv²", "KE = mv", "KE = mgh", "KE = Fd"],
        answer: "KE = 1/2 mv²",
      },
      {
        question: "What is the unit of power?",
        options: ["Joule", "Watt", "Newton", "Meter"],
        answer: "Watt",
      },
      {
        question: "In an elastic collision, how is mechanical energy affected?",
        options: ["It is conserved", "It is lost", "It is converted into heat", "It is destroyed"],
        answer: "It is conserved",
      },
    ],

    "Assessment - SYSTEMS OF PARTICLES AND ROTATIONAL MOTION": [
      {
        question: "The center of mass of a system:",
        options: ["Is always at the origin", "Can lie outside the object", "Is always located within the object", "Is independent of mass distribution"],
        answer: "Can lie outside the object",
      },
      {
        question: "What does torque depend on?",
        options: ["Force", "Distance from the pivot", "Angle between force and lever arm", "All of the above"],
        answer: "All of the above",
      },
      {
        question: "The moment of inertia depends on:",
        options: ["The mass of the object", "The shape of the object", "The distribution of mass", "All of the above"],
        answer: "All of the above",
      },
      {
        question: "What is the angular momentum for a rotating object?",
        options: ["L = I × ω", "L = mv", "L = I × v", "L = F × r"],
        answer: "L = I × ω",
      },
    ],

    "Assessment - GRAVITATION": [
      {
        question: "What is Kepler's First Law?",
        options: ["Planets orbit in elliptical paths with the Sun at one focus", "The radius of orbit is constant", "Planets move with uniform speed", "None of the above"],
        answer: "Planets orbit in elliptical paths with the Sun at one focus",
      },
      {
        question: "The universal law of gravitation states that the force between two masses is:",
        options: ["Inversely proportional to the square of the distance", "Directly proportional to the product of the masses", "Both a and b", "Independent of distance"],
        answer: "Both a and b",
      },
      {
        question: "The escape speed from Earth’s surface is approximately:",
        options: ["5 km/s", "7 km/s", "11.2 km/s", "15 km/s"],
        answer: "11.2 km/s",
      },
      {
        question: "What is the energy of an orbiting satellite?",
        options: ["Kinetic energy equals potential energy", "Total energy is negative", "Both a and b", "Total energy is positive"],
        answer: "Both a and b",
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
  
  export default PhysicsQuiz1;
  