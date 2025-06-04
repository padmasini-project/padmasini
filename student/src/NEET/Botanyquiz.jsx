import React, { useState, useEffect } from "react";
import "./BotanyQuiz.css";
import { FaCheckCircle } from "react-icons/fa";

const BotanyQuiz = ({ topicTitle, subtopicTitle, onBack, onMarkComplete }) => {

const quizData = {
    "Assessment - DIVERSITY OF THE LIVING WORLD": [
      {
        question: "What is the main characteristic of organisms in the Kingdom Plantae?",
        options: ["They are unicellular", "They are autotrophic", "They are heterotrophic", "They lack a nucleus"],
        answer: "They are autotrophic",
      },
      {
        question: "Which of the following is a characteristic feature of fungi?",
        options: ["Chlorophyll", "Cell wall made of cellulose", "Cell wall made of chitin", "Photosynthesis"],
        answer: "Cell wall made of chitin",
      },
      {
        question: "What is the primary difference between plants and animals?",
        options: ["Plants are autotrophic, animals are heterotrophic", "Plants lack cells, animals have cells", "Plants reproduce sexually, animals do not", "Plants have nervous systems, animals do not"],
        answer: "Plants are autotrophic, animals are heterotrophic",
      },
      {
        question: "Which of these organisms belong to the Kingdom Protista?",
        options: ["Moss", "Amoeba", "Fungi", "Human"],
        answer: "Amoeba",
      },
    ],
  
    "Assessment - PLANT KINGDOM": [
      {
        question: "Which group of plants is known for producing seeds?",
        options: ["Algae", "Bryophytes", "Gymnosperms", "Fungi"],
        answer: "Gymnosperms",
      },
      {
        question: "Which of the following is a feature of bryophytes?",
        options: ["Vascular tissue", "Seeds", "No true roots", "Flowers"],
        answer: "No true roots",
      },
      {
        question: "Which plants are considered the earliest land plants?",
        options: ["Ferns", "Mosses", "Angiosperms", "Gymnosperms"],
        answer: "Mosses",
      },
      {
        question: "In which plant group are flowers found?",
        options: ["Ferns", "Mosses", "Angiosperms", "Gymnosperms"],
        answer: "Angiosperms",
      },
    ],
  
    "Assessment - MORPHOLOGY OF FLOWERING PLANTS": [
      {
        question: "What is the function of the root cap in plants?",
        options: ["Absorption of water", "Protection of root tip", "Anchoring the plant", "Transportation of nutrients"],
        answer: "Protection of root tip",
      },
      {
        question: "Which of these is an example of a modified stem?",
        options: ["Potato", "Onion", "Ginger", "All of the above"],
        answer: "All of the above",
      },
      {
        question: "What is the primary function of leaves in plants?",
        options: ["Absorption of water", "Photosynthesis", "Anchoring the plant", "Reproduction"],
        answer: "Photosynthesis",
      },
      {
        question: "What type of venation is seen in monocot leaves?",
        options: ["Reticulate", "Parallel", "Pinnate", "None of the above"],
        answer: "Parallel",
      },
    ],
  
    "Assessment - ANATOMY OF FLOWERING PLANTS": [
      {
        question: "Which tissue in plants is responsible for transporting water and minerals?",
        options: ["Phloem", "Xylem", "Cortex", "Pith"],
        answer: "Xylem",
      },
      {
        question: "What is the function of phloem in plants?",
        options: ["Transport of water", "Transport of food", "Support", "Storage of starch"],
        answer: "Transport of food",
      },
      {
        question: "Where is the vascular tissue found in dicot roots?",
        options: ["In the center", "In the periphery", "In the cortex", "In the pith"],
        answer: "In the center",
      },
      {
        question: "What are the main components of the ground tissue in plants?",
        options: ["Parenchyma, Collenchyma, Sclerenchyma", "Xylem, Phloem", "Root cap, Endodermis", "None of the above"],
        answer: "Parenchyma, Collenchyma, Sclerenchyma",
      },
    ],
  
    "Assessment - CELL – THE UNIT OF LIFE": [
      {
        question: "Which organelle is known as the powerhouse of the cell?",
        options: ["Nucleus", "Mitochondria", "Endoplasmic Reticulum", "Golgi Apparatus"],
        answer: "Mitochondria",
      },
      {
        question: "What is the function of ribosomes?",
        options: ["Protein synthesis", "DNA replication", "Energy production", "Cell division"],
        answer: "Protein synthesis",
      },
      {
        question: "Where is the genetic material located in a plant cell?",
        options: ["Nucleus", "Cytoplasm", "Chloroplast", "Mitochondria"],
        answer: "Nucleus",
      },
      {
        question: "What is the structure that separates the cell’s interior from its surroundings?",
        options: ["Nucleus", "Plasma membrane", "Cytoplasm", "Cell wall"],
        answer: "Plasma membrane",
      },
    ],
  
    "Assessment - BIOMOLECULES": [
      {
        question: "Which of the following is a polysaccharide?",
        options: ["Glucose", "Fructose", "Cellulose", "Sucrose"],
        answer: "Cellulose",
      },
      {
        question: "What is the building block of proteins?",
        options: ["Nucleotides", "Amino acids", "Fatty acids", "Monosaccharides"],
        answer: "Amino acids",
      },
      {
        question: "What is the role of enzymes in plant cells?",
        options: ["Provide energy", "Catalyze biochemical reactions", "Store genetic information", "Transport nutrients"],
        answer: "Catalyze biochemical reactions",
      },
      {
        question: "Which macromolecule is the main source of energy in plants?",
        options: ["Lipids", "Proteins", "Carbohydrates", "Nucleic acids"],
        answer: "Carbohydrates",
      },
    ],
  
    "Assessment - CELL CYCLE AND CELL DIVISION": [
      {
        question: "Which phase is the longest phase of the cell cycle?",
        options: ["G1 phase", "S phase", "G2 phase", "M phase"],
        answer: "G1 phase",
      },
      {
        question: "What is the process of cell division in plant cells called?",
        options: ["Meiosis", "Mitosis", "Binary fission", "Fragmentation"],
        answer: "Mitosis",
      },
      {
        question: "In which phase of mitosis do the chromosomes align at the cell’s equator?",
        options: ["Anaphase", "Metaphase", "Telophase", "Prophase"],
        answer: "Metaphase",
      },
      {
        question: "What happens during the S phase of the cell cycle?",
        options: ["DNA replication", "Cell growth", "Chromosome separation", "Cytoplasm division"],
        answer: "DNA replication",
      },
    ],
  
    "Assessment - TRANSPORT IN PLANTS": [
      {
        question: "Which of these is responsible for the transport of water in plants?",
        options: ["Phloem", "Xylem", "Cortex", "Endodermis"],
        answer: "Xylem",
      },
      {
        question: "What is the primary driving force behind transpiration in plants?",
        options: ["Root pressure", "Capillary action", "Evaporation from leaf surfaces", "Wind"],
        answer: "Evaporation from leaf surfaces",
      },
      {
        question: "What is the movement of sugars and other nutrients in plants known as?",
        options: ["Phloem transport", "Xylem transport", "Osmosis", "Transpiration"],
        answer: "Phloem transport",
      },
      {
        question: "Which process allows water to enter plant roots?",
        options: ["Active transport", "Osmosis", "Transpiration", "Diffusion"],
        answer: "Osmosis",
      },
    ],
  
    "Assessment - MINERAL NUTRITION": [
      {
        question: "Which mineral element is essential for chlorophyll synthesis?",
        options: ["Iron", "Magnesium", "Potassium", "Calcium"],
        answer: "Magnesium",
      },
      {
        question: "Which of the following minerals is important for plant cell wall formation?",
        options: ["Nitrogen", "Phosphorus", "Calcium", "Magnesium"],
        answer: "Calcium",
      },
      {
        question: "What is nitrogen fixation?",
        options: ["The process of absorbing nitrogen from soil", "The conversion of nitrogen gas into ammonia by bacteria", "The process of releasing nitrogen from the plant", "The synthesis of amino acids"],
        answer: "The conversion of nitrogen gas into ammonia by bacteria",
      },
      {
        question: "What is the primary function of potassium in plants?",
        options: ["Water regulation", "Protein synthesis", "Photosynthesis", "Cell division"],
        answer: "Water regulation",
      },
    ],
  
    "Assessment - PHOTOSYNTHESIS IN HIGHER PLANTS": [
      {
        question: "What is the main pigment responsible for photosynthesis in plants?",
        options: ["Chlorophyll", "Carotenoid", "Xanthophyll", "Melanin"],
        answer: "Chlorophyll",
      },
      {
        question: "In which organelle does photosynthesis take place?",
        options: ["Mitochondria", "Chloroplast", "Nucleus", "Endoplasmic Reticulum"],
        answer: "Chloroplast",
      },
      {
        question: "Which of the following is a product of photosynthesis?",
        options: ["Oxygen", "Carbon dioxide", "Glucose", "All of the above"],
        answer: "Oxygen and Glucose",
      },
      {
        question: "What is the role of light in photosynthesis?",
        options: ["Activates enzymes", "Provides energy for the reaction", "Releases oxygen", "Produces glucose"],
        answer: "Provides energy for the reaction",
      },
    ],
  
    "Assessment - RESPIRATION IN PLANTS": [
      {
        question: "What is the primary purpose of respiration in plants?",
        options: ["To produce oxygen", "To release energy", "To form glucose", "To store carbon dioxide"],
        answer: "To release energy",
      },
      {
        question: "Where does the process of aerobic respiration occur in plant cells?",
        options: ["Cytoplasm", "Nucleus", "Mitochondria", "Chloroplast"],
        answer: "Mitochondria",
      },
      {
        question: "Which gas is primarily released during plant respiration?",
        options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Methane"],
        answer: "Carbon dioxide",
      },
      {
        question: "What is the initial step of aerobic respiration?",
        options: ["Krebs cycle", "Electron transport chain", "Glycolysis", "Fermentation"],
        answer: "Glycolysis",
      },
    ],
  
    "Assessment - PLANT GROWTH AND DEVELOPMENT": [
      {
        question: "Which of the following is a plant hormone responsible for cell elongation?",
        options: ["Auxin", "Gibberellin", "Cytokinin", "Abscisic acid"],
        answer: "Auxin",
      },
      {
        question: "Which process is involved in the formation of flowers and fruits?",
        options: ["Germination", "Pollination", "Fertilization", "Photosynthesis"],
        answer: "Fertilization",
      },
      {
        question: "What is the role of gibberellins in plants?",
        options: ["Promote seed dormancy", "Inhibit flowering", "Stimulate cell growth", "Regulate water balance"],
        answer: "Stimulate cell growth",
      },
      {
        question: "Which phase of plant growth involves cell division and differentiation?",
        options: ["Maturation phase", "Vegetative phase", "Germination phase", "Development phase"],
        answer: "Vegetative phase",
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


export default BotanyQuiz;
