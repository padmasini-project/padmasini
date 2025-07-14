import React, { useState, useEffect, useRef } from 'react';
import './JeeExplanation.css'; // ✅ Reuse same CSS
import { FaPlay, FaPause, FaCheckCircle } from 'react-icons/fa';

const JeeExplanation = ({
  explanation = '',
  subtopicTitle = '',
  subject = '',
  onBack,
  onMarkComplete
}) => {
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
    synth.cancel();
    setIsSpeaking(false);
    setHighlightedRange({ start: 0, end: 0 });
    utteranceRef.current = null;
  }, [subtopicTitle]);

  const handleTogglePlayPause = () => {
    const text = explanation || subtopicTitle;
    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      setHighlightedRange({ start: 0, end: 0 });
    } else if (text.trim()) {
      const utterance = new SpeechSynthesisUtterance(text);
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
          let end = start;
          while (end < text.length && /\S/.test(text[end])) {
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
    const stored = localStorage.getItem(`jee-completed-${subtopicTitle}`);
    setIsComplete(stored === "true");
  }, [subtopicTitle]);

  const handleMarkComplete = () => {
    setIsComplete(true);
    localStorage.setItem(`jee-completed-${subtopicTitle}`, "true");
    if (onMarkComplete) onMarkComplete("explanation");
  };

  const textToDisplay = explanation || subtopicTitle;
  const { start, end } = highlightedRange;
  const before = textToDisplay.slice(0, start);
  const highlight = textToDisplay.slice(start, end);
  const after = textToDisplay.slice(end);

  const isIntroIframe =
    subject.toLowerCase() === "physics" &&
    subtopicTitle.trim().toLowerCase() === "1.1 introduction";

  return (
    <div className="explanation-container">
      <div className="explanation-content">
        <h2>{subtopicTitle}</h2>

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

          {isIntroIframe ? (
            <div className="iframe-wrapper">
              <iframe
                src="https://scintillating-bienenstitch-4a86e8.netlify.app/"
                title="JEE Physics Intro"
                className="embedded-iframe"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <p>
              {before}
              <mark className="highlight">{highlight}</mark>
              {after}
            </p>
          )}
        </div>

        {!isIntroIframe && (
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
          </div>
        )}

        <button onClick={handleBack} className="back-btn">
          Back to Topics
        </button>
      </div>
    </div>
  );
};

export default JeeExplanation;
