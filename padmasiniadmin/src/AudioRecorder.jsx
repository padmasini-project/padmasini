// AudioRecorder.js
import React, { useState, useRef } from 'react';
import "./HomeRight"
const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(audioBlob));
        audioChunksRef.current = [];
      };
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error("Failed to access microphone", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const playRecording = () => {
    if (audioUrl) {
      new Audio(audioUrl).play();
    }
  };

  return (
    <div>
      <h2>Audio Recorder</h2>
      <button className='my-buttonInUnit' onClick={startRecording} disabled={recording}>Start Recording</button>
      <button className='my-buttonInUnit' onClick={stopRecording} disabled={!recording}>Stop Recording</button>
      <button className='my-buttonInUnit' onClick={playRecording} disabled={!audioUrl}>Play Recording</button>
    </div>
  );
};

export default AudioRecorder;
