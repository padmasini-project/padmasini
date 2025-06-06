import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';

import './AdminRight.css';

const AdminRight = () => {
  const location = useLocation();
const { cardId, subject, standard, examTitle } = location.state || {};

  let standards = [];
  if (cardId === 'class1-5') {
    standards = ['1', '2', '3', '4', '5'];
  } else if (cardId === 'class6-12') {
    standards = ['6', '7', '8', '9', '10', '11', '12'];
  }

  const [selectedStandard, setSelectedStandard] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [unitsMap, setUnitsMap] = useState({});
  const [selectedUnit, setSelectedUnit] = useState('');
  const [editingLessonIndex, setEditingLessonIndex] = useState(null);
  const [lessonSubtopicsMap, setLessonSubtopicsMap] = useState({}); // new
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [editingSubtopicIndex, setEditingSubtopicIndex] = useState(null);

  const [showExplanationForm, setShowExplanationForm] = useState(false);
  const [showTestForm, setShowTestForm] = useState(false);

  const [subTitle, setSubTitle] = useState('');
  const [subDesc, setSubDesc] = useState('');
  const [animFiles, setAnimFiles] = useState([]);

  const [recordedVoiceFiles, setRecordedVoiceFiles] = useState([]);
  const [uploadedVoiceFiles, setUploadedVoiceFiles] = useState([]);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const recordingIntervalRef = useRef(null);

const [lessonTestsMap, setLessonTestsMap] = useState({});
const [selectedTest, setSelectedTest] = useState(null);
const [testName, setTestName] = useState('');
const [editingTestIndex, setEditingTestIndex] = useState(null);
const [testTimeLimit, setTestTimeLimit] = useState('');
const [questions, setQuestions] = useState([]);
const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
const [passPercentage, setPassPercentage] = useState(70); // default 70%

  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correctIndex: null,
    explanation: '',
  });

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        setRecordedVoiceFiles((prev) => [...prev, audioBlob]);
        audioChunks.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Microphone access denied or not supported.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingIntervalRef.current);
    }
  };

  const handleAddUnit = () => {
    const key = standards.length > 0 ? selectedStandard : 'default';
    if (!key || !newUnit.trim()) return;

    setUnitsMap((prev) => {
      const updated = { ...prev };
      const existingUnits = updated[key] || [];

      const trimmed = newUnit.trim();
      if (editingLessonIndex !== null) {
        existingUnits[editingLessonIndex] = trimmed;
      } else {
        if (existingUnits.includes(trimmed)) return updated;
        existingUnits.push(trimmed);
      }

      updated[key] = existingUnits;
      return updated;
    });

    setNewUnit('');
    setEditingLessonIndex(null);
  };

  const handleEditLesson = (index) => {
    const key = standards.length > 0 ? selectedStandard : 'default';
    const unitToEdit = unitsMap[key]?.[index] || '';
    setNewUnit(unitToEdit);
    setEditingLessonIndex(index);
  };

  const handleDeleteLesson = (index) => {
    const key = standards.length > 0 ? selectedStandard : 'default';

    setUnitsMap((prev) => {
      const updated = { ...prev };
      updated[key] = [...(updated[key] || [])];
      const deletedUnit = updated[key][index];
      updated[key].splice(index, 1);

      // Remove associated subtopics
      setLessonSubtopicsMap((prevSubtopics) => {
        const copy = { ...prevSubtopics };
        delete copy[deletedUnit];
        return copy;
      });

      return updated;
    });

    if (editingLessonIndex === index) {
      setNewUnit('');
      setEditingLessonIndex(null);
    }
  };

const handleAddSubtopic = () => {
  if (!selectedUnit || !subTitle.trim()) {
    alert("Select a lesson and enter a title.");
    return;
  }

  const newSub = {
    title: subTitle,
    description: subDesc,
    voices: [...recordedVoiceFiles, ...uploadedVoiceFiles],
    animation: animFiles
  };

  setLessonSubtopicsMap((prev) => {
    const currentSubs = prev[selectedUnit] || [];
    if (editingSubtopicIndex !== null) {
      const updated = [...currentSubs];
      updated[editingSubtopicIndex] = newSub;
      return { ...prev, [selectedUnit]: updated };
    } else {
      return { ...prev, [selectedUnit]: [...currentSubs, newSub] };
    }
  });

  resetExplanationForm();
};

const handleEditSubtopic = (unit, index) => {
  const sub = lessonSubtopicsMap[unit][index];
  setSubTitle(sub.title);
  setSubDesc(sub.description);
  setRecordedVoiceFiles(sub.voices || []);
  setUploadedVoiceFiles([]); // Optional: Only use recorded if you want
  setAnimFiles(sub.animation || []);
  setEditingSubtopicIndex(index);
  setShowExplanationForm(true);
  setShowTestForm(false);
};

const handleDeleteSubtopic = (unit, index) => {
  const updatedSubs = [...lessonSubtopicsMap[unit]];
  updatedSubs.splice(index, 1);
  setLessonSubtopicsMap(prev => ({
    ...prev,
    [unit]: updatedSubs
  }));
  setSelectedSubtopic(null);
};


  const handleAddQuestion = () => {
  if (!currentQuestion.text || currentQuestion.options.some(opt => !opt) || currentQuestion.correctIndex === null) {
    alert("Please complete the question and all options, and select a correct answer.");
    return;
  }

  if (editingQuestionIndex !== null) {
    const updatedQuestions = [...questions];
    updatedQuestions[editingQuestionIndex] = currentQuestion;
    setQuestions(updatedQuestions);
    setEditingQuestionIndex(null);
  } else {
    setQuestions([...questions, currentQuestion]);
  }

  // Reset question form
  setCurrentQuestion({
    text: '',
    options: ['', '', '', ''],
    correctIndex: null,
    explanation: '',
  });
};

  const resetExplanationForm = () => {
  setSubTitle('');
  setSubDesc('');
  setRecordedVoiceFiles([]);
  setUploadedVoiceFiles([]);
  setAnimFiles([]);
  setEditingSubtopicIndex(null);
};

const handleSaveTest = () => {
  if (!selectedUnit) {
    alert('Please select a lesson before saving the test.');
    return;
  }

  const testData = {
    name: testName,
    timeLimit: testTimeLimit,
    passPercentage: Number(passPercentage),
    questions: [...questions],
  };

  setLessonTestsMap((prevMap) => {
    const updatedTests = [...(prevMap[selectedUnit] || [])];
    if (editingTestIndex !== null) {
      // Update existing
      updatedTests[editingTestIndex] = testData;
    } else {
      // Prevent duplicate add
      const isDuplicate = updatedTests.some(t => t.name === testName);
      if (!isDuplicate) {
        updatedTests.push(testData);
      } else {
        alert("Test name already exists.");
        return prevMap;
      }
    }

    return {
      ...prevMap,
      [selectedUnit]: updatedTests,
    };
  });

  // Clear form and reset state
  resetTestForm();
};


const handleDeleteTest = () => {
  if (editingTestIndex === null) return;
  setLessonTestsMap(prev => {
    const updated = [...(prev[selectedUnit] || [])];
    updated.splice(editingTestIndex, 1);
    return { ...prev, [selectedUnit]: updated };
  });
  resetTestForm();
};


  const resetTestForm = () => {
    setTestTimeLimit('');
    setQuestions([]);
    setCurrentQuestion({
      text: '',
      options: ['', '', '', ''],
      correctIndex: null,
      explanation: '',
    });
    setShowTestForm(false);
  };

  const currentUnits = standards.length > 0 ? unitsMap[selectedStandard] || [] : unitsMap.default || [];

  return (
    <div className="adminright-container">
<h2 className="title">
  You are in: {examTitle ? `${examTitle} - ` : ''}
  {subject}
  {standard ? ` (Standard ${standard})` : ''}
</h2>
      <div className="adminright-grid">
        <div className="left-panel">
          {standards.length > 0 && (
            <>
              <h3>Standard</h3>
              <select
                value={selectedStandard}
                onChange={(e) => {
                  setSelectedStandard(e.target.value);
                  setSelectedUnit('');
                  setNewUnit('');
                  setEditingLessonIndex(null);
                }}
              >
                <option value="">Select a Standard</option>
                {standards.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </>
          )}

          <h3>{editingLessonIndex !== null ? 'Edit Lesson' : 'Add New Lesson'}</h3>
          <input
            type="text"
            placeholder="Enter lesson name"
            value={newUnit}
            onChange={(e) => setNewUnit(e.target.value)}
          />
          <button onClick={handleAddUnit}>
            {editingLessonIndex !== null ? 'Update Lesson' : 'Add Lesson'}
          </button>

          <div className="bottom-box">
            <h3>All Lessons</h3>
            <h4>Select Lesson</h4>
            {currentUnits.map((unit, index) => (
  <React.Fragment key={index}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0' }}>
      <button
        className="lesson-btn"
        onClick={() => {
          setSelectedUnit(unit);
          setSelectedSubtopic(null); // Clear previous subtopic
        }}
      >
        {unit}
      </button>
      <button className="icon-btn" onClick={() => handleEditLesson(index)} title="Edit">
        <Pencil size={18} />
      </button>
      <button className="icon-btn" onClick={() => handleDeleteLesson(index)} title="Delete">
        <Trash2 size={18} />
      </button>
    </div>

    {/* Show subtopics only if this unit is selected */}
    {selectedUnit === unit && lessonSubtopicsMap[unit]?.length > 0 && (
      <ul style={{ marginLeft: '20px', marginTop: '5px' ,color: 'blue'}}>
        {lessonSubtopicsMap[unit].map((sub, subIdx) => (
  <li key={subIdx}>
    <span onClick={() => setSelectedSubtopic(sub)}style={{ cursor: 'pointer' }}>{sub.title}</span>
  </li>
))

}
      </ul>
    )}
    {lessonTestsMap[unit]?.length > 0 && (
  <ul style={{ marginLeft: '20px', color: 'blue' }}>
    {lessonTestsMap[unit].map((test, idx) => (
      <li key={idx} onClick={() => {
        setSelectedTest(test);
        setShowTestForm(false);
        setShowExplanationForm(false);
      }}style={{ cursor: 'pointer' }}
      >
         {test.name}
      </li>
    ))}
  </ul>
)}

  </React.Fragment>
))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          <div className="explanation-box">
            <h4>Description / Test</h4>
             {selectedUnit && (
      <h3 style={{ color: '#333', margin: '10px 0' }}>
        Selected Lesson: {selectedUnit}
      </h3>
    )}
            <div className="explanation-buttons">
              <button onClick={() => {
                setShowExplanationForm(true);
                setShowTestForm(false);
              }}>Add Content</button>
              <button
  onClick={() => {
    if (!selectedUnit) {
      alert('Please select a lesson before adding a test.');
      return;
    }
    setShowTestForm(true);
    setShowExplanationForm(false);
    setSelectedTest(null);
    setTestName('');
    setCurrentQuestion({
      text: '',
      options: ['', '', '', ''],
      correctIndex: null,
      explanation: '',
    });
    setQuestions([]);
    setEditingTestIndex(null);
  }}
>
  Add Test
</button>

              
            </div>
            {selectedSubtopic && (
  <div className="subtopic-detail-box" style={{ marginTop: '20px' }}>
    <h4>Subtopic Preview</h4>
    <p><strong>Title:</strong> {selectedSubtopic.title}</p>
    <p><strong>Description:</strong> {selectedSubtopic.description}</p>

    <div>
      <h5>Audio:</h5>
      {selectedSubtopic.voices.map((audioFile, idx) => (
        <audio
          key={idx}
          controls
          src={URL.createObjectURL(audioFile)}
          style={{ marginBottom: '10px' }}
        />
      ))}
    </div>

    <div>
      <h5>Videos:</h5>
      {selectedSubtopic.animation.map((videoFile, idx) => (
        <video
          key={idx}
          width="200"
          controls
          src={URL.createObjectURL(videoFile)}
          style={{ marginBottom: '10px' }}
        />
      ))}
{/* NEW: Edit/Delete Buttons */}
    <div className="subtopic-actions" style={{ marginTop: '15px' }}>
      <button
        className="icon-btn"
        onClick={() => {
          const subIdx = lessonSubtopicsMap[selectedUnit].findIndex(s => s.title === selectedSubtopic.title);
          if (subIdx !== -1) handleEditSubtopic(selectedUnit, subIdx);
        }}
        title="Edit Subtopic"
      >
        <Pencil size={10} /> Edit
      </button>
      <button
        className="icon-btn"
        onClick={() => {
          const subIdx = lessonSubtopicsMap[selectedUnit].findIndex(s => s.title === selectedSubtopic.title);
          if (subIdx !== -1) handleDeleteSubtopic(selectedUnit, subIdx);
        }}
        title="Delete Subtopic"
        style={{ marginLeft: '10px' }}
      >
        <Trash2 size={10} /> Delete
      </button>
    </div>
      {selectedTest && (
  <div className="test-detail-box" style={{ marginTop: '20px' }}>
    <h4>Test Preview</h4>
    <p><strong>Name:</strong> {selectedTest.name}</p>
    <p><strong>Time Limit:</strong> {selectedTest.timeLimit} mins</p>
    <p><strong>Pass Percentage:</strong> {selectedTest.passPercentage}%</p>
    <h5><strong>Questions:</strong></h5>
    <ol>
  {selectedTest.questions.map((q, idx) => (
    <li key={idx} style={{ marginBottom: '10px' }}>
      <strong>{q.text}</strong>
      <ul>
        {q.options.map((opt, i) => (
          <li key={i}>
            {i === q.correctIndex ? '✅ ' : ''}
            {opt}
          </li>
        ))}
      </ul>
      <p><strong>Explanation: </strong><em>{q.explanation}</em></p>
      
     
    </li>
  ))}
</ol>

    <div style={{ marginTop: '10px' }}>
      <button onClick={() => {
        setShowTestForm(true);
        setTestName(selectedTest.name);
        setQuestions(selectedTest.questions);
        setTestTimeLimit(selectedTest.timeLimit);
        const index = lessonTestsMap[selectedUnit].findIndex(t => t.name === selectedTest.name);
        setEditingTestIndex(index);
      }}>        <Pencil size={10} /> All Edit
</button>
      <button onClick={handleDeleteTest} style={{ marginLeft: '10px' }}>        <Trash2 size={10} /> All Delete
</button>
    </div>
  </div>
)}

    </div>
  </div>
)}


            {showExplanationForm && (
              <div className="explanation-form">
                <h4>Add Subtopic</h4>
                <input
                  type="text"
                  placeholder="Subtopic title"
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                />
                <textarea
                  placeholder="Subtopic description"
                  rows={3}
                  value={subDesc}
                  onChange={(e) => setSubDesc(e.target.value)}
                />

                {/* Record Audio */}
                <div>
                  <h5>Record Audio</h5>
                  {isRecording ? (
                    <>
                      <button onClick={handleStopRecording}>Stop Recording</button>
                      <span style={{ fontWeight: 'bold' }}>
                        Recording: {String(Math.floor(recordingTime / 60)).padStart(2, '0')}:
                        {String(recordingTime % 60).padStart(2, '0')}
                      </span>
                    </>
                  ) : (
                    <button onClick={handleStartRecording}>Record Audio</button>
                  )}

                  {recordedVoiceFiles.length > 0 && (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {recordedVoiceFiles.map((file, index) => (
                        <li key={index} style={{ marginTop: '10px' }}>
                          <audio controls src={URL.createObjectURL(file)} />
                          <button className="remove-button" onClick={() =>
                            setRecordedVoiceFiles((prev) => prev.filter((_, i) => i !== index))
                          }>Remove</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Upload Audio */}
                <div style={{ marginTop: '20px' }}>
                  <h5>Upload Audio</h5>
                  <input
                    type="file"
                    accept=".mp3,.wav,.flac,.aac,.m4a"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      const validTypes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/x-m4a', 'audio/mp4'];
                      const validFiles = files.filter(file => validTypes.includes(file.type));
                      if (validFiles.length < files.length) {
                        alert('Some files were skipped. Only supported formats are allowed.');
                      }
                      setUploadedVoiceFiles((prev) => [...prev, ...validFiles]);
                      e.target.value = '';
                    }}
                  />
                  {uploadedVoiceFiles.length > 0 && (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {uploadedVoiceFiles.map((file, index) => (
                        <li key={index} style={{ marginTop: '10px' }}>
                          <audio controls src={URL.createObjectURL(file)} />
                          <button className="remove-button" onClick={() =>
                            setUploadedVoiceFiles((prev) => prev.filter((_, i) => i !== index))
                          }>Remove</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Upload Video */}
                <div style={{ marginTop: '20px' }}>
  <label>Upload Videos (optional)</label>
  <input
    type="file"
    accept=".mp4,.webm,.ogg,.mov,.mkv"
    multiple
    onChange={(e) => {
      const files = Array.from(e.target.files);
      const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-matroska'];
      const validFiles = files.filter(file => validTypes.includes(file.type));

      if (validFiles.length < files.length) {
        alert('Some files were skipped. Only supported video formats are allowed.');
      }

      setAnimFiles(prev => [...prev, ...validFiles]);
      e.target.value = ''; // Reset input
    }}
  />

  {animFiles.length > 0 && (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {animFiles.map((file, index) => (
        <li key={index} style={{ marginTop: '10px' }}>
          <video
            width="200"
            controls
            onClick={() => {
              const url = URL.createObjectURL(file);
              window.open(url, '_blank');
            }}
            style={{ cursor: 'pointer' }}
            src={URL.createObjectURL(file)}
          />
          <br />
          <button className="remove-button" onClick={() =>
            setAnimFiles(prev => prev.filter((_, i) => i !== index))
          }>Remove</button>
        </li>
      ))}
    </ul>
  )}
</div>




               {lessonSubtopicsMap[selectedUnit]?.length > 0 && (
  <div>
    <h5>Subtopics Added:</h5>
    <ul>{lessonSubtopicsMap[selectedUnit].map((s, idx) => (
      <li key={idx}>{s.title}</li>
    ))}</ul>
  </div>
)}


                <div className="action-buttons">
                  <button onClick={handleAddSubtopic}>
  {editingSubtopicIndex !== null ? 'Update Subtopic' : 'Add Subtopic'}
</button>
                  <button onClick={resetExplanationForm}>Cancel</button>
                </div>
              </div>
            )}

            {/* TEST FORM */}
            {showTestForm && (
              <div className="test-form">
                <h4>Test Settings</h4>
                <input
                   type="text"
  placeholder="Test Name"
  value={testName}
  onChange={(e) => setTestName(e.target.value)}
  required
/>

                <input
                  type="number"
                  placeholder="Time limit (minutes)"
                  min="1"
                  value={testTimeLimit}
                  onChange={(e) => setTestTimeLimit(e.target.value)}
                />
                <input
  type="number"
  placeholder="Pass Percentage"
  min="1"
  max="100"
  value={passPercentage}
  onChange={(e) => setPassPercentage(e.target.value)}
/>


                <h4>Add Question</h4>
                <input
                  type="text"
                  placeholder="Question"
                  value={currentQuestion.text}
                  onChange={(e) => setCurrentQuestion((q) => ({ ...q, text: e.target.value }))}
                />
                <h5>Options</h5>
                {currentQuestion.options.map((opt, idx) => (
                  <div key={idx} className="option-row">
                    <input
                      type="radio"
                      name="correct"
                      checked={currentQuestion.correctIndex === idx}
                      onChange={() => setCurrentQuestion((q) => ({ ...q, correctIndex: idx }))}
                    />
                    <input
                      type="text"
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...currentQuestion.options];
                        newOpts[idx] = e.target.value;
                        setCurrentQuestion((q) => ({ ...q, options: newOpts }));
                      }}
                    />
                  </div>
                ))}
                <textarea
                  placeholder="Explain the correct answer"
                  rows={3}
                  value={currentQuestion.explanation}
                  onChange={(e) => setCurrentQuestion((q) => ({ ...q, explanation: e.target.value }))}
                />
                <button onClick={handleAddQuestion}>Add Question</button>
{editingQuestionIndex !== null && (
  <button
    onClick={() => {
      setEditingQuestionIndex(null);
      setCurrentQuestion({
        text: '',
        options: ['', '', '', ''],
        correctIndex: null,
        explanation: '',
      });
    }}
    style={{ marginLeft: '10px' }}
  >
    Cancel Edit
  </button>
)}

                {questions.length > 0 && (
                  <ol>
  {questions.map((q, idx) => (
    <li key={idx} style={{ marginBottom: '10px' }}>
      <strong>{q.text}</strong>
      <div style={{ marginTop: '5px' }}>
        <button
          onClick={() => {
            setCurrentQuestion({ ...q }); // populate form
            setEditingQuestionIndex(idx); // track index for update
          }}
        >
          Edit
        </button>
        <button
          onClick={() => {
            const updatedQuestions = questions.filter((_, i) => i !== idx);
            setQuestions(updatedQuestions);
            if (editingQuestionIndex === idx) {
              setCurrentQuestion({
                text: '',
                options: ['', '', '', ''],
                correctIndex: null,
                explanation: '',
              });
              setEditingQuestionIndex(null);
            }
          }}
          style={{ marginLeft: '10px' }}
        >
          Delete
        </button>
      </div>
    </li>
  ))}
</ol>

                )}

               <div className="action-buttons">
  <button onClick={handleSaveTest}>
    {editingTestIndex !== null ? 'Update Test' : 'Save Test'}
  </button>
  {editingTestIndex !== null && (
    <button onClick={handleDeleteTest}>Delete</button>
  )}
  <button onClick={resetTestForm}>Cancel</button>
</div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>  
  );
};

export default AdminRight;