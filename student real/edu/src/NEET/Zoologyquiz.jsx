import React, { useState, useEffect } from "react";
import "./Zoologyquiz.css";  // Add appropriate CSS
import { FaCheckCircle } from "react-icons/fa";

const ZoologyQuiz = ({ topicTitle, subtopicTitle, onBack, onMarkComplete }) => {

const quizData = {
    "Assessment - THE LIVING WORLD": [
      {
        question: "What is the basic unit of life?",
        options: ["Atom", "Cell", "Tissue", "Organ"],
        answer: "Cell",
      },
      {
        question: "What is the science of classifying organisms called?",
        options: ["Zoology", "Botany", "Taxonomy", "Ecology"],
        answer: "Taxonomy",
      },
      {
        question: "Which of the following is a feature of living organisms?",
        options: ["Respiration", "Growth", "Reproduction", "All of the above"],
        answer: "All of the above",
      },
      {
        question: "Which scientist proposed the theory of evolution by natural selection?",
        options: ["Gregor Mendel", "Charles Darwin", "Louis Pasteur", "Albert Einstein"],
        answer: "Charles Darwin",
      },
    ],
  
    "Assessment - KINGDOM ANIMALIA": [
      {
        question: "Which of the following is a characteristic feature of Kingdom Animalia?",
        options: ["Autotrophic", "Heterotrophic", "Multicellular", "Both B and C"],
        answer: "Both B and C",
      },
      {
        question: "Which is the largest phylum in the animal kingdom?",
        options: ["Arthropoda", "Mollusca", "Chordata", "Annelida"],
        answer: "Arthropoda",
      },
      {
        question: "Which of the following animals is an example of an amphibian?",
        options: ["Frog", "Snake", "Lizard", "Tortoise"],
        answer: "Frog",
      },
      {
        question: "What is the name of the group of animals that are characterized by a notochord, dorsal nerve cord, and pharyngeal slits?",
        options: ["Chordates", "Arthropods", "Mollusks", "Annelids"],
        answer: "Chordates",
      },
    ],
  
    "Assessment - TISSUE LEVEL OF ORGANISATION": [
      {
        question: "Which type of tissue is responsible for the movement of limbs?",
        options: ["Epithelial", "Connective", "Muscle", "Nervous"],
        answer: "Muscle",
      },
      {
        question: "What is the main function of epithelial tissue?",
        options: ["Movement", "Conduction", "Protection", "Support"],
        answer: "Protection",
      },
      {
        question: "Which type of connective tissue stores fat?",
        options: ["Bone", "Blood", "Adipose tissue", "Cartilage"],
        answer: "Adipose tissue",
      },
      {
        question: "Which type of muscle tissue is involuntary and found in the walls of the heart?",
        options: ["Skeletal muscle", "Cardiac muscle", "Smooth muscle", "All of the above"],
        answer: "Cardiac muscle",
      },
    ],
  
    "Assessment - ORGAN AND ORGAN SYSTEMS IN ANIMALS": [
      {
        question: "What is the primary function of the respiratory system in animals?",
        options: ["Gas exchange", "Digestion", "Nutrient absorption", "Excretion"],
        answer: "Gas exchange",
      },
      {
        question: "Which organ system is responsible for producing hormones?",
        options: ["Endocrine system", "Circulatory system", "Nervous system", "Respiratory system"],
        answer: "Endocrine system",
      },
      {
        question: "What is the main function of the digestive system?",
        options: ["Break down food", "Remove waste", "Circulate blood", "Produce hormones"],
        answer: "Break down food",
      },
      {
        question: "What organ is primarily responsible for detoxification in the body?",
        options: ["Heart", "Liver", "Lungs", "Kidneys"],
        answer: "Liver",
      },
    ],
  
    "Assessment - DIGESTION AND ABSORPTION": [
      {
        question: "Where does digestion begin in the human body?",
        options: ["Mouth", "Stomach", "Small intestine", "Large intestine"],
        answer: "Mouth",
      },
      {
        question: "What enzyme is responsible for breaking down starches in the mouth?",
        options: ["Pepsin", "Amylase", "Lipase", "Trypsin"],
        answer: "Amylase",
      },
      {
        question: "What is absorbed in the small intestine?",
        options: ["Water", "Vitamins", "Minerals", "All of the above"],
        answer: "All of the above",
      },
      {
        question: "Which part of the digestive system absorbs most of the nutrients from food?",
        options: ["Esophagus", "Stomach", "Small intestine", "Large intestine"],
        answer: "Small intestine",
      },
    ],
  
    "Assessment - RESPIRATION": [
      {
        question: "Which of the following is the primary organ of respiration in humans?",
        options: ["Heart", "Lungs", "Stomach", "Kidneys"],
        answer: "Lungs",
      },
      {
        question: "Which gas is primarily exchanged in the lungs?",
        options: ["Oxygen", "Carbon dioxide", "Nitrogen", "All of the above"],
        answer: "Oxygen",
      },
      {
        question: "What process allows oxygen to enter the bloodstream?",
        options: ["Diffusion", "Osmosis", "Active transport", "Endocytosis"],
        answer: "Diffusion",
      },
      {
        question: "Which of the following processes takes place during respiration?",
        options: ["Glycolysis", "Fermentation", "Citric acid cycle", "All of the above"],
        answer: "All of the above",
      },
    ],
  
    "Assessment - BODY FLUIDS AND CIRCULATION": [
      {
        question: "What is the main function of the circulatory system?",
        options: ["Transport of oxygen", "Excretion of waste", "Digestion of food", "Transport of nutrients"],
        answer: "Transport of oxygen",
      },
      {
        question: "Which part of the blood is responsible for clotting?",
        options: ["Red blood cells", "White blood cells", "Platelets", "Plasma"],
        answer: "Platelets",
      },
      {
        question: "What is the name of the fluid that circulates in the body and contains red blood cells, white blood cells, and platelets?",
        options: ["Lymph", "Plasma", "Blood", "Interstitial fluid"],
        answer: "Blood",
      },
      {
        question: "What is the primary function of the lymphatic system?",
        options: ["Circulation of blood", "Immune defense", "Oxygen transport", "Nutrient absorption"],
        answer: "Immune defense",
      },
    ],
  
    "Assessment - EXCRETION": [
      {
        question: "Which organ is responsible for filtering waste from the blood in humans?",
        options: ["Liver", "Lungs", "Kidneys", "Stomach"],
        answer: "Kidneys",
      },
      {
        question: "What is the name of the functional unit of the kidney?",
        options: ["Nephron", "Alveolus", "Hepatocyte", "Ovary"],
        answer: "Nephron",
      },
      {
        question: "What is the waste product excreted by the kidneys?",
        options: ["Urea", "Uric acid", "Ammonia", "All of the above"],
        answer: "Urea",
      },
      {
        question: "Which part of the nephron filters blood to form urine?",
        options: ["Glomerulus", "Loop of Henle", "Collecting duct", "Proximal convoluted tubule"],
        answer: "Glomerulus",
      },
    ],
  
    "Assessment - LOCOMOTION AND MOVEMENT": [
      {
        question: "What type of muscle is responsible for voluntary movement?",
        options: ["Cardiac muscle", "Smooth muscle", "Skeletal muscle", "All of the above"],
        answer: "Skeletal muscle",
      },
      {
        question: "Which of the following is a joint that allows circular movement?",
        options: ["Hinge joint", "Ball and socket joint", "Pivot joint", "Saddle joint"],
        answer: "Ball and socket joint",
      },
      {
        question: "What is the functional unit of skeletal muscle?",
        options: ["Sarcomere", "Nephron", "Alveolus", "Neuron"],
        answer: "Sarcomere",
      },
      {
        question: "What is the primary function of tendons?",
        options: ["Connect bone to bone", "Connect muscle to muscle", "Connect muscle to bone", "Connect skin to muscle"],
        answer: "Connect muscle to bone",
      },
    ],
  
    "Assessment - NEURAL CONTROL AND COORDINATION": [
      {
        question: "Which part of the nervous system controls voluntary movements?",
        options: ["Autonomic nervous system", "Central nervous system", "Peripheral nervous system", "Somatic nervous system"],
        answer: "Somatic nervous system",
      },
      {
        question: "What is the function of neurons?",
        options: ["Transmit electrical impulses", "Store information", "Secrete hormones", "Produce energy"],
        answer: "Transmit electrical impulses",
      },
      {
        question: "What part of the brain controls basic life functions like heart rate and breathing?",
        options: ["Cerebellum", "Cerebrum", "Medulla oblongata", "Thalamus"],
        answer: "Medulla oblongata",
      },
      {
        question: "What type of nerve carries impulses towards the central nervous system?",
        options: ["Sensory nerves", "Motor nerves", "Interneurons", "None of the above"],
        answer: "Sensory nerves",
      },
    ],
  
    "Assessment - CHEMICAL COORDINATION AND INTEGRATION": [
      {
        question: "Which gland produces insulin in the body?",
        options: ["Thyroid gland", "Adrenal gland", "Pancreas", "Pituitary gland"],
        answer: "Pancreas",
      },
      {
        question: "What hormone regulates the metabolism of carbohydrates, proteins, and fats?",
        options: ["Insulin", "Thyroxine", "Adrenaline", "Cortisol"],
        answer: "Thyroxine",
      },
      {
        question: "Which part of the brain controls hormone release from the pituitary gland?",
        options: ["Cerebrum", "Hypothalamus", "Pons", "Cerebellum"],
        answer: "Hypothalamus",
      },
      {
        question: "What is the main function of adrenaline?",
        options: ["Stimulate metabolism", "Fight-or-flight response", "Regulate blood sugar", "Growth regulation"],
        answer: "Fight-or-flight response",
      },
    ],
  
    "Assessment - TRENDS IN ECONOMIC ZOOLOGY": [
      {
        question: "Which of the following is an example of an economic product from animals?",
        options: ["Silk", "Honey", "Leather", "All of the above"],
        answer: "All of the above",
      },
      {
        question: "Which animal is used in the production of pearls?",
        options: ["Oyster", "Fish", "Snail", "Octopus"],
        answer: "Oyster",
      },
      {
        question: "What is the name of the study of the economic importance of animals?",
        options: ["Economic zoology", "Ecology", "Zoology", "Ethology"],
        answer: "Economic zoology",
      },
      {
        question: "Which of the following animals is used for the production of wool?",
        options: ["Goat", "Sheep", "Cow", "Rabbit"],
        answer: "Sheep",
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
    <button onClick={confirmSubmit} className="submit-btn" disabled={submitted}>
      Submit
    </button>
  ) : null}
</div>

{/* Score Display Section */}
{submitted && (
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



export default ZoologyQuiz;
