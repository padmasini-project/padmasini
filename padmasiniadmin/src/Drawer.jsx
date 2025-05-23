import React, { useState, useRef, useEffect } from 'react';
import './Drawer.css';

const Drawer = ({ isOpen, onClose, onConfirm }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [playTime, setPlayTime] = useState(0);
  const [duration, setDuration] = useState(0);
   const [micDenied, setMicDenied] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlayerRef = useRef(null);
  const recordIntervalRef = useRef(null);

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicDenied(false);
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(audioBlob);
        setRecordTime(0);
        stream.getTracks().forEach(track => track.stop());
        clearInterval(recordIntervalRef.current);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordTime(0);

      // Start recording timer
      recordIntervalRef.current = setInterval(() => {
        setRecordTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
       setMicDenied(true);
      if (err.name === 'NotAllowedError') {
        alert('Microphone access is blocked. Please allow it from the browser settings.');
      } else if (err.name === 'NotFoundError') {
        alert('No microphone found. Please connect a microphone and try again.');
      } else {
        alert('An unexpected error occurred: ' + err.message);
      }
      alert('Microphone access denied.');
      console.error(err);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Play recording
  const playRecording = () => {
  if (recordedBlob) {
    const url = URL.createObjectURL(recordedBlob);
    const audio = audioPlayerRef.current;
    audio.src = url;

    // Wait for metadata before playing
    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
      audio.play();
      setIsPlaying(true);
    };

    audio.ontimeupdate = () => {
      setPlayTime(audio.currentTime);
    };

    audio.onended = () => {
      setIsPlaying(false);
    };
  }
};


  // Stop playback
  const stopPlayback = () => {
    audioPlayerRef.current.pause();
    audioPlayerRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  // Update play time
  useEffect(() => {
    const audio = audioPlayerRef.current;

    if (audio) {
      const update = () => setPlayTime(audio.currentTime);

      audio.ontimeupdate = update;
      audio.onloadedmetadata = () => setDuration(audio.duration);
      audio.onended = () => setIsPlaying(false);
    }
  }, [recordedBlob]);

  // Format time (e.g., 61 → 1:01)
  const formatTime = (t) => {
    const min = Math.floor(t / 60);
    const sec = Math.floor(t % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };
const handleOk = () => {
    if (recordedBlob) {
      const audioFile = new File([recordedBlob], 'recording.webm', { type: 'audio/webm' });
      onConfirm(audioFile); // send blob to parent
      onClose();            // close the drawer
    }
  };
  return (
    <>
      {isOpen && <div className="overlay" onClick={onClose}></div>}

      <div className={`drawer ${isOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={onClose}>✖</button>

        <h2>Audio Recorder</h2>
         {!isRecording && !recordedBlob && !micDenied && (
          <p className="mic-tip">
            🔒 Please click "Allow" in the browser popup to enable microphone access.
          </p>
        )}
        {micDenied && (
          <div className="mic-warning">
            <p>⚠️ Microphone access is blocked.</p>
            <p>
              To enable it:
              <ul>
                <li>Click the 🔒 icon in the address bar</li>
                <li>Find “Microphone” and set it to “Allow”</li>
                <li>Reload this page</li>
              </ul>
            </p>
          </div>
        )}
        {!isRecording && (
          <button className='my-buttonInUnit' onClick={startRecording} disabled={isPlaying}>
            Start Recording
          </button>
        )}

        {isRecording && (
          <>
            <button className='my-buttonInUnit' onClick={stopRecording}>Stop Recording</button>
            <p>Recording... ⏱ {formatTime(recordTime)}</p>
          </>
        )}

        {!isRecording && recordedBlob && (
          <div style={{ marginTop: '20px' }}>
            {!isPlaying ? (
              <button className='my-buttonInUnit' onClick={playRecording}>▶️ Play</button>
            ) : (
              <button className='my-buttonInUnit' onClick={stopPlayback}>⏹ Stop</button>
            )}

            <div className="player-ui">
              <input
                type="range"
                min="0"
                max={duration}
                value={playTime}
                step="0.1"
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  audioPlayerRef.current.currentTime = val;
                  setPlayTime(val);
                }}
              />
              <div className="time-display">
                {formatTime(playTime)} / {formatTime(duration)}
              </div>
            </div>
             <button className='my-buttonInUnit' onClick={handleOk} style={{ marginTop: '10px' }}>
              ✅ OK
            </button>
          </div>
        )}

        <audio ref={audioPlayerRef} hidden />
      </div>
    </>
  );
};

export default Drawer;
