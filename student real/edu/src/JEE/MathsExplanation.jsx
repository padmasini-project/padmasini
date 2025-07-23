import React, { useState, useEffect, useRef } from 'react';
import './MathsExplanation.css'; // Rename CSS for Math
import { FaPlay, FaPause } from 'react-icons/fa';
import { FaCheckCircle } from 'react-icons/fa';

const MathExplanation = ({ explanation = '', subtopicTitle = '', onBack, onMarkComplete }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [highlightedRange, setHighlightedRange] = useState({ start: 0, end: 0 });
  const [isComplete, setIsComplete] = useState(false);

  const synth = window.speechSynthesis;
  const utteranceRef = useRef(null);
  const voicesLoadedRef = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadVoices = () => {
      const voices = synth.getVoices();
      if (voices.length === 0) return;

      // Find Indian female voice or fallback
      const indianFemale = voices.find(
        (v) =>
          (v.lang.includes('en-IN') || v.name.toLowerCase().includes('india')) &&
          v.name.toLowerCase().includes('female')
      );
      const indianVoice = voices.find(
        (v) => v.lang.includes('en-IN') || v.name.toLowerCase().includes('india')
      );
      setVoice(indianFemale || indianVoice || voices[0]);
      voicesLoadedRef.current = true;
    };

    if (!voicesLoadedRef.current) {
      if (synth.onvoiceschanged !== undefined) {
        synth.addEventListener('voiceschanged', loadVoices);
      }
      loadVoices();
    }

    return () => {
      if (synth.onvoiceschanged !== undefined) {
        synth.removeEventListener('voiceschanged', loadVoices);
      }
      synth.cancel();
    };
  }, [synth]);

  useEffect(() => {
    // Reset when explanation changes
    synth.cancel();
    setIsSpeaking(false);
    setHighlightedRange({ start: 0, end: 0 });
    utteranceRef.current = null;
  }, [explanation, synth]);

  const handleTogglePlayPause = () => {
    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      setHighlightedRange({ start: 0, end: 0 });
    } else if (explanation.trim()) {
      const utterance = new SpeechSynthesisUtterance(explanation);
      utterance.voice = voice;
      utterance.rate = rate;
      utteranceRef.current = utterance;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        setHighlightedRange({ start: 0, end: 0 });
      };

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const start = event.charIndex;
          // Find the end of the word by searching for the next space or punctuation
          let end = start;
          while (end < explanation.length && /\S/.test(explanation[end])) {
            end++;
          }
          setHighlightedRange({ start, end });
        }
      };

      synth.speak(utterance);
    }
  };

  const handleBack = () => {
    synth.cancel();
    setIsSpeaking(false);
    setHighlightedRange({ start: 0, end: 0 });
    utteranceRef.current = null;
    if (onBack) onBack();
  };

  useEffect(() => {
    const storedCompletion = localStorage.getItem(`completed-${subtopicTitle}`);
    setIsComplete(storedCompletion === "true");
  }, [subtopicTitle]);  
  
  const handleMarkComplete = () => {
    setIsComplete(true);
    localStorage.setItem(`completed-${subtopicTitle}`, "true");
    if (onMarkComplete) onMarkComplete("explanation");
  };
  

  const { start, end } = highlightedRange;
  const before = explanation.slice(0, start);
  const highlight = explanation.slice(start, end);
  const after = explanation.slice(end);

  return (
    <div className="explanation-container">
      <div className="explanation-content">
        <h2>{subtopicTitle}</h2>
          {/* Centered Buttons */}
      <div className="centered-buttons">
        <button
          onClick={handleMarkComplete}
          className={`complete-btn ${isComplete ? 'completed' : ''}`}
          disabled={isComplete}
        >
          {isComplete ? (
            <>
              Completed <FaCheckCircle className="check-icon" />
            </>
          ) : (
            'Mark as Complete'
          )}
        </button>
        <p>
          {before} <mark className="highlight">{highlight}</mark> {after}
        </p>
      </div>

      <div className="voice-controls-wrapper">
        <button className="voice-play-button" onClick={handleTogglePlayPause}>
          {isSpeaking ? <FaPause /> : <FaPlay />}
        </button>

        <div className="rate-control">
          <label htmlFor="rate">Speech Speed: {rate.toFixed(2)}x</label>
          <input
            type="range"
            id="rate"
            min="0.25"
            max="2"
            step="0.05"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
          />
        </div>

        {subtopicTitle.trim().toLowerCase() === '1.1 introduction' && (
          <>
            <div className="audio-container">
              <h4>Original Audio</h4>
              <audio controls>
                <source src={trailAudio} type="audio/mp3" />
                Your browser does not support the audio tag.
              </audio>
            </div>

            <div className="video-container">
              <video width="100%" controls>
                <source src={trailVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </>
        )}
      </div>
        <button onClick={handleBack} className="back-btn">
          Back to Topics
        </button>
      </div>
    </div>
  );
};


export default MathExplanation;

export const mathsExplanations = {
  "1.1 Rational and Irrational Numbers": "Rational numbers can be expressed as fractions, whereas irrational numbers cannot be written as simple fractions.",
  "1.2 Real Numbers": "Real numbers include both rational and irrational numbers. Rational numbers can be expressed as fractions, while irrational numbers cannot be written as simple fractions.",
  "1.3 Laws of Exponents": "The laws of exponents provide rules for simplifying expressions involving powers of numbers or variables.",
  "2.1 Polynomials": "A polynomial is an algebraic expression made up of terms consisting of variables raised to whole-number powers and their coefficients.",
  "2.2 Linear Equations in Two Variables": "A linear equation in two variables represents a straight line on a graph. The general form is ax + by + c = 0.",
  "3.1 Lines and Angles": "Angles formed by two intersecting lines can be classified based on their measures.",
  "3.2 Triangles": "A triangle is a polygon with three edges and three vertices, the sum of whose angles is always 180°.",
  "3.3 Quadrilaterals": "A quadrilateral is a polygon with four edges and four vertices.",
  "4.1 Areas of Parallelograms and Triangles": "The area of a parallelogram is given by the formula base × height, while the area of a triangle is 1/2 × base × height.",
  "4.2 Surface Areas and Volumes": "The surface area of a 3D shape is the total area of all its faces, while volume is the space it occupies.",
  "5.1 Cartesian Plane": "The Cartesian plane is a two-dimensional number line formed by the intersection of two perpendicular axes.",
  "5.2 Plotting Points": "To plot points on the Cartesian plane, use ordered pairs (x, y) where x represents the horizontal axis and y represents the vertical axis.",
  "6.1 Data Collection and Presentation": "Data collection refers to the process of gathering data, while presentation involves organizing and displaying the data effectively.",
  "6.2 Measures of Central Tendency": "The measures of central tendency (mean, median, mode) help describe the central point of a data set.",
  "6.3 Probability Basics": "Probability is a measure of the likelihood of an event occurring, typically expressed as a number between 0 and 1.",
};
