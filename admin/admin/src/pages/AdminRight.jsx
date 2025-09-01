import React, { useState, useRef, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import katex from 'katex';
import parse from 'html-react-parser';
import 'katex/dist/katex.min.css';


import './AdminRight.css';
const AdminRight = () => {
  const navigate = useNavigate();
  useEffect(() => {
    fetch(`http://localhost:80/checkSession`, {
      // fetch(`https://trilokinnovations-api-prod.trilokinnovations.com/test/checkSession`,{
      // fetch(`https://test-padmasiniAdmin-api.trilokinnovations.com/checkSession`,{
      method: "GET",
      credentials: 'include'
    }).then(resp => resp.json())
      .then(data => {
        if (data.status === 'failed') {
          navigate('/signin')
          return;
        }
        if (data.status === 'pass') {
          getAllData()
        }
        //console.log("passed homw right checksession")
      }).catch(err => console.log("Session check failed:", err));
  }, [])
  const location = useLocation();
  const standards = location.state?.standards || []; // fallback to empty array if undefined

  const { cardId, subjectName, standard, examTitle, courseName } = location.state || {};
  const keyPrefix = `${examTitle}_${subjectName}_Std${standard}`;
  // console.log(cardId,"  ",subjectName,"  ",standard," ",examTitle,"  ",courseName )

  const [newUnit, setNewUnit] = useState('');
  const [unitsMap, setUnitsMap] = useState(() => {
    const saved = localStorage.getItem(`admin_unitsMap_${keyPrefix}`);
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedUnit, setSelectedUnit] = useState('');
  const [editingLessonIndex, setEditingLessonIndex] = useState(null);
  const [lessonSubtopicsMap, setLessonSubtopicsMap] = useState(() => {
    const saved = localStorage.getItem(`admin_subtopicsMap_${keyPrefix}`);
    return saved ? JSON.parse(saved) : {};
  });
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
  const [lessonTestsMap, setLessonTestsMap] = useState(() => {
    const saved = localStorage.getItem(`admin_testsMap_${keyPrefix}`);
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedTest, setSelectedTest] = useState(null);
  const [testName, setTestName] = useState('');
  const [editingTestIndex, setEditingTestIndex] = useState(null);
  const [testTimeLimit, setTestTimeLimit] = useState('');
  const [questions, setQuestions] = useState([]);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [passPercentage, setPassPercentage] = useState('');
  useEffect(() => {
    localStorage.setItem(`admin_unitsMap_${keyPrefix}`, JSON.stringify(unitsMap));
  }, [unitsMap]);

  useEffect(() => {
    localStorage.setItem(`admin_subtopicsMap_${keyPrefix}`, JSON.stringify(lessonSubtopicsMap));
  }, [lessonSubtopicsMap]);

  useEffect(() => {
    localStorage.setItem(`admin_testsMap_${keyPrefix}`, JSON.stringify(lessonTestsMap));
  }, [lessonTestsMap]);

  localStorage.removeItem(`admin_unitsMap_${keyPrefix}`);
  localStorage.removeItem(`admin_subtopicsMap_${keyPrefix}`);
  localStorage.removeItem(`admin_testsMap_${keyPrefix}`);
  const getAllData = () => {
    const start = performance.now()
    fetch(`http://localhost:80/getAllUnits/${courseName}/${subjectName}/${standard}`, {
      // fetch(`https://trilokinnovations-api-prod.trilokinnovations.com/test/getAllUnits/${courseName}/${subjectName}/${standard}`,{
      method: "GET",
      credentials: "include"
    })
      .then(resp => resp.json())
      .then(data => {
        const end1 = performance.now(); // End time
        console.log(`Fetch for data fetch from db  ${end1 - start} ms`);
        // console.log(data)
        setUnitData(data)
      }).catch(err => console.log("Session check failed:", err));
  }
  const generateTable = (rows, cols) => {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => "")
    );
  };
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    image: null,
    showImage: false,
    showMatches: false,
    rows: 4,
    cols: 4,
    tableData: [],
    tableEditable: true,
    options: [
      { text: '', image: null },
      { text: '', image: null },
      { text: '', image: null },
      { text: '', image: null },
    ],
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

  // state
  const [savedItems, setSavedItems] = React.useState([]);

  // your save function
  const handleSaveImage = () => {
    if (!currentQuestion.image) {
      alert("Please upload an image.");
      return;
    }
    if (!subDesc.trim()) {
      alert("Please enter a subtopic description.");
      return;
    }

    // Save image name + description as text
    setSavedItems(prev => [
      ...prev,
      {
        imageName: currentQuestion.image.name || "uploaded-image",
        description: subDesc
      }
    ]);

    // reset inputs
    setCurrentQuestion(q => ({ ...q, image: null }));
    setSubDesc("");
  };


  const [oldHeadUnitName, setOldHeadUnitName] = useState('')
  const handleAddUnit = () => {
    // console.log(unitsMap)
    const key = standards.length > 0 ? selectedStandard : 'default';
    if (!key || !newUnit.trim()) return;

    if (editingLessonIndex !== null) {
      //     fetch(`http://localhost:80/updateHeadUnit/${newUnit}`,{
      //   // fetch(`https://api-test.trilokinnovations.com/addNewUnit/${subjectName}`,{
      //   //  fetch(`https://test-padmasiniAdmin-api.trilokinnovations.com/addNewUnit/${subjectName}`,{
      //   method:'PUT',
      //   credentials:'include',
      //         headers: {'Content-Type':'application/json'},
      //         body:JSON.stringify({

      //           dbname:courseName,
      //           subjectName:subjectName,
      //           unit:{
      //             unitName: oldHeadUnitName,
      //           standard: standard,

      //           }
      //         })
      // }).then(resp=>resp.json())
      // .then((resp)=>{

      //   console.log("edit new unit resp",resp)
      //    if(resp.status==='pass'){
      //     setUnitsMap((prev) => {
      //   const updated = { ...prev };
      //   const existingUnits = updated[key] || [];

      //   const trimmed = newUnit.trim();
      //   if (editingLessonIndex !== null) {
      //     existingUnits[editingLessonIndex] = trimmed;
      //   } else {
      //     if (existingUnits.includes(trimmed)) return updated;
      //     existingUnits.push(trimmed);
      //   }

      //   updated[key] = existingUnits;
      //   return updated;
      // });
      // getAllData()
      //   setNewUnit('');
      //   setOldHeadUnitName('')
      // setEditingLessonIndex(null);
      //    }
      // }).catch(err=>{
      //   console.log("new unit fetch error",err)
      // })    
    }
    else {
      fetch(`http://localhost:80/addNewHeadUnit`, {
        // fetch(`https://trilokinnovations-api-prod.trilokinnovations.com/test/addNewUnit/${subjectName}`,{
        //  fetch(`https://test-padmasiniAdmin-api.trilokinnovations.com/addNewUnit/${subjectName}`,{
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({

          dbname: courseName,
          subjectName: subjectName,
          unit: {
            unitName: newUnit,
            standard: standard,

          }
        })
      }).then(resp => resp.json())
        .then((resp) => {

          //  console.log("add new unit resp",resp)
          if (resp.status === 'pass') {
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
            getAllData()
            setNewUnit('');
            setEditingLessonIndex(null);
          }
        }).catch(err => {
          console.log("new unit fetch error", err)
        })
    }

  };

  const handleEditLesson = (index) => {
    const key = standards.length > 0 ? selectedStandard : 'default';
    const unitToEdit = unitsMap[key]?.[index] || '';
    setOldHeadUnitName(unitToEdit)
    setNewUnit(unitToEdit);
    setEditingLessonIndex(index);
  };
  const handleDeleteLesson = (index) => {
    const key = standards.length > 0 ? selectedStandard : 'default';

    const unitToEdit = unitsMap[key]?.[index] || '';
    setOldHeadUnitName(unitToEdit)
    // console.log(unitToEdit)
    fetch(`http://localhost:80/deleteHeadUnit`, {
      // fetch(`https://trilokinnovations-api-prod.trilokinnovations.com/test/addNewUnit/${subjectName}`,{
      //  fetch(`https://test-padmasiniAdmin-api.trilokinnovations.com/addNewUnit/${subjectName}`,{
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({

        dbname: courseName,
        subjectName: subjectName,
        unit: {
          unitName: unitToEdit,
          standard: standard,

        }
      })
    }).then(resp => resp.json())
      .then((resp) => {

        // console.log("add new unit resp",resp)
        if (resp.status === 'pass') {
          setUnitsMap((prev) => {
            const updated = { ...prev };
            updated[key] = [...(updated[key] || [])];
            const deletedUnit = updated[key][index];
            updated[key].splice(index, 1);
            // console.log(deletedUnit)
            // Remove associated subtopics
            setLessonSubtopicsMap((prevSubtopics) => {
              const copy = { ...prevSubtopics };
              delete copy[deletedUnit];
              return copy;
            });

            return updated;
          });
          getAllData()
          if (editingLessonIndex === index) {
            setNewUnit('');
            setEditingLessonIndex(null);
            setOldHeadUnitName('')
          }
        }
      }).catch(err => {
        console.log("new unit fetch error", err)
      })
  };
  let alertShown = useState(false)
  const handleAddSubtopic = () => {
    if (isRecording) {
      if (!alertShown) {
        alertShown = true;
        setTimeout(() => {
          alertShown = false;
        }, 1000); // prevent duplicate alerts for 1 second
        alert("Stop recording first before adding a subtopic.");
      }
      return;
    }

    if (!selectedUnit || !subTitle.trim()) {
      alert("Select a lesson and enter a title.");
      return;
    }
    const newSub = {
      title: subTitle,
      description: subDesc,
      voices: [...recordedVoiceFiles, ...uploadedVoiceFiles],
      animation: animFiles,
      children: [],
      tests: [], // <-- Add this line
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
  const handleAddChildSubtopic = (parentSubtopic) => {
    if (!subTitle.trim()) {
      alert('Please enter a title for the subtopic');
      return;
    }
    // if (isRecording) {
    //     alert("Stop recording first before adding a subtopic.");
    //     return;
    //   }

    const newChild = {
      title: subTitle.trim(),
      description: subDesc.trim(),
      voices: [...recordedVoiceFiles, ...uploadedVoiceFiles],
      animation: [...animFiles],
      children: [],
      tests: [],
    };

    const updateSubtopicTree = (subtopics) => {
      return subtopics.map(sub => {
        if (sub.title === parentSubtopic.title) {
          return {
            ...sub,
            children: [...(sub.children || []), newChild],
          };
        } else if (sub.children && sub.children.length > 0) {
          return {
            ...sub,
            children: updateSubtopicTree(sub.children),
          };
        } else {
          return sub;
        }
      });
    };

    setLessonSubtopicsMap((prev) => ({
      ...prev,
      [selectedUnit]: updateSubtopicTree(prev[selectedUnit] || []),
    }));

    resetExplanationForm();
  };
  const updateTestsInSubtopicTree = (subtopics, targetTitle, newTest, isEdit = false, indexToEdit = null) => {
    return subtopics.map(sub => {
      if (sub.title === targetTitle) {
        const updatedTests = [...(sub.tests || [])];
        if (isEdit && indexToEdit !== null) {
          updatedTests[indexToEdit] = newTest;
        } else {
          updatedTests.push(newTest);
        }
        return { ...sub, tests: updatedTests };
      } else if (sub.children && sub.children.length > 0) {
        return { ...sub, children: updateTestsInSubtopicTree(sub.children, targetTitle, newTest, isEdit, indexToEdit) };
      }
      return sub;
    });
  };


  const handleEditSubtopic = (unit, index) => {
    const sub = lessonSubtopicsMap[unit][index];
    setSubTitle(sub.title);
    setSubDesc(sub.description);
    setRecordedVoiceFiles(sub.voices || []);
    setUploadedVoiceFiles([]);
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
    const hasQuestion =
      (currentQuestion.text && currentQuestion.text.trim() !== "") ||
      currentQuestion.image !== null;
    const hasAtLeastOneOption = currentQuestion.options.some(
      (opt) =>
        (opt.text && opt.text.trim() !== "") ||
        opt.image !== null
    );
    const hasCorrectAnswer =
      currentQuestion.correctIndex !== null &&
      (
        (currentQuestion.options[currentQuestion.correctIndex]?.text &&
          currentQuestion.options[currentQuestion.correctIndex]?.text.trim() !== "") ||
        currentQuestion.options[currentQuestion.correctIndex]?.image !== null
      );

    const hasExplanation =
      currentQuestion.explanation &&
      currentQuestion.explanation.trim() !== "";

    if (!hasQuestion || !hasAtLeastOneOption || !hasCorrectAnswer || !hasExplanation) {
      alert(
        "Please add a question (text and/or image), at least one option (text and/or image), select a valid correct answer, and provide an explanation."
      );
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
    setCurrentQuestion({
      text: "",
      image: null,
      options: [
        { text: "", image: null },
        { text: "", image: null },
        { text: "", image: null },
        { text: "", image: null },
      ],
      correctIndex: null,
      explanation: "",
    });
  };

  const handleEditQuestion = (index) => {
    const q = questions[index];

    setCurrentQuestion({
      text: q.text || "",
      image: q.image || null,
      options: q.options.map(opt => {

        if (typeof opt === "string") {
          return { text: opt, image: null };
        }
        return {
          text: opt.text || "",
          image: opt.image || null
        };
      }),
      correctIndex: q.correctIndex,
      explanation: q.explanation || "",
    });

    setEditingQuestionIndex(index);
  };





  const resetExplanationForm = () => {
    setShowExplanationForm(false)
    setSubTitle('');
    setSubDesc('');
    setRecordedVoiceFiles([]);
    setUploadedVoiceFiles([]);
    setAnimFiles([]);
    setEditingSubtopicIndex(null);
    setEditSelecetedSubUnit('')
  };


  //HandleSaveTest

  const handleSaveTest = async () => {
    if (!selectedUnit) {
      alert('Please select a lesson before saving the test.');
      return;
    }
    if (!testName.trim()) {
      alert('Please enter a test name.');
      return;
    }

    const pass = parseInt(passPercentage);

    if (!pass || pass <= 0 || pass > 100) {
      alert('Pass percentage must be between 1 and 100.');
      return;
    }

    if (questions.length === 0) {
      alert('Add at least one question before saving the test.');
      return;
    }

    const testData = {
      name: testName.trim(),
      passPercentage: parseInt(passPercentage),
      questions: [...questions],

    };

    setLessonTestsMap((prevMap) => {
      const updatedTests = [...(prevMap[selectedUnit] || [])];
      if (editingTestIndex !== null) {
        updatedTests[editingTestIndex] = testData;
      } else {
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

    // ✅ Convert File objects → file names
    // const filesToUpload = [];

    const filesToUpload = [];
    questions.forEach((q, qi) => {
      if (q.image) filesToUpload.push({ file: q.image, type: "question", index: qi });
      if (q.showImage) filesToUpload.push({ file: q.showImage, type: "solution", index: qi });

      q.options?.forEach((opt, oi) => {
        if (typeof opt !== "string" && opt?.image) {
          filesToUpload.push({ file: opt.image, type: `option${oi + 1}`, index: qi });
        }
      });
    });

    // ✅ Upload files and map them back
    const uploadedUrls = {};
    for (const f of filesToUpload) {
      const url = await uploadFileToS3(f.file, "new image");
      console.log(`✅ Uploaded [Q${f.index + 1}] ${f.type}:`, url);
      uploadedUrls[`${f.index}-${f.type}`] = url;
    }

    const testDatas = {
      dbname: courseName,
      parentId: lastClicked,
      rootId: firstClicked,
      subjectName: subjectName,
      testName: testName.trim(),
      marks: pass,
      questionsList: questions.map((q, qi) => {
        return {
          question: q.text || "",
          questionImage: uploadedUrls[`${qi}-question`] || null,
          showMatches: q.showMatches || "",
          explanation: q.explanation || "",
          showImage: uploadedUrls[`${qi}-solution`] || null,
          option1: {
            text: typeof q.options?.[0] === "string" ? q.options[0] : (q.options?.[0]?.text || ""),
            image: typeof q.options?.[0] === "string" ? null : uploadedUrls[`${qi}-option1`] || null
          },
          option2: {
            text: typeof q.options?.[1] === "string" ? q.options[1] : (q.options?.[1]?.text || ""),
            image: typeof q.options?.[1] === "string" ? null : uploadedUrls[`${qi}-option2`] || null
          },
          option3: {
            text: typeof q.options?.[2] === "string" ? q.options[2] : (q.options?.[2]?.text || ""),
            image: typeof q.options?.[2] === "string" ? null : uploadedUrls[`${qi}-option3`] || null
          },
          option4: {
            text: typeof q.options?.[3] === "string" ? q.options[3] : (q.options?.[3]?.text || ""),
            image: typeof q.options?.[3] === "string" ? null : uploadedUrls[`${qi}-option4`] || null
          },
          answer: typeof q.options?.[q.correctIndex] === "string"
            ? q.options[q.correctIndex]
            : (q.options?.[q.correctIndex]?.text || ""),
          answerImage: typeof q.options?.[q.correctIndex] === "string"
            ? null
            : uploadedUrls[`${qi}-option${q.correctIndex + 1}`] || null
        };
      })
    };

    // ✅ EXTRA LOGGING WITH FILE NAMES ONLY
    testDatas.questionsList.forEach((q, qi) => {
      console.log(`Question ${qi + 1}: ${q.question}`);
      console.log(`Show Image: ${q.showImage || "No show Image"}`);
      console.log(`Question Image: ${q.questionImage || "No Question Image"}`);

      [q.option1, q.option2, q.option3, q.option4].forEach((opt, oi) => {
        console.log(`Option ${oi + 1}: ${opt.text || "(no text)"}`);
        console.log(`Option ${oi + 1} Image: ${opt.image || "No Image"}`);
      });

      console.log(`Answer: ${q.answer}`);
      console.log(`Answer Image: ${q.answerImage || "No Answer Image"}`);
    });

    // ✅ Print the cleaned object
    console.log("sending Test Data:", JSON.stringify(testDatas, null, 2));
    filesToUpload.forEach(async (f) => {
      await uploadFileToS3(f.file, "new image");
    });
    const url =
      editingTestIndex === "value"
        ? `http://localhost:80/updateQuestion/${lastClicked}/${oldQuestionForDeletion}`
        : `http://localhost:80/addQuestion/${lastClicked}`;

    const method = editingTestIndex === "value" ? "PUT" : "POST";

    try {
      const json = JSON.stringify(testDatas);
      fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: json
      })
        .then(res => res.json())
        .then(data => {
          console.log("Test submitted:", data);
          getAllData();
          setSelectedTest(null);
          resetTestForm();
        })
        .catch(err => console.error("Submission failed:", err));
    } catch (err) {
      console.error("JSON stringify failed:", err);
      getAllData();
      setSelectedTest(null);
      resetTestForm();
    }

    resetTestForm();
  };

  // Generic uploader for any file (image/audio/pdf/etc.)
  // const uploadFileToS3 = async (file, folderName = "uploads") => {
  //   if (!file) return null;

  //   // Place file inside folder
  //   const fileName = encodeURIComponent(`${folderName}/${file.name}`);
  //   const fileType = encodeURIComponent(file.type);

  //   // ✅ Use a generic endpoint, not "audio"
  //   const res = await fetch(
  //     `http://localhost:80/api/file/presigned-url?fileName=${fileName}&fileType=${fileType}`
  //   );

  //   if (!res.ok) {
  //     console.error("Failed to get presigned URL:", await res.text());
  //     return null;
  //   }

  //   const { uploadUrl, fileUrl } = await res.json();

  //   // Upload to S3
  //   const uploadRes = await fetch(uploadUrl, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": file.type,
  //     },
  //     body: file,
  //   });

  //   if (uploadRes.ok) {
  //     return fileUrl; // public S3 URL (includes folder)
  //   } else {
  //     console.error("Upload failed for", file.name);
  //     return null;
  //   }
  // };

  // // 🔹 Process a question (upload its images & map to URLs)
  // const processQuestion = async (q) => {
  //   const questionImageUrl = q.image ? await uploadFileToS3(q.image, "questions") : null;
  //   const solutionImageUrl = q.solutionImage ? await uploadFileToS3(q.solutionImage, "solutions") : null;

  //   const option1ImageUrl =
  //     typeof q.options?.[0] === "string"
  //       ? null
  //       : q.options?.[0]?.image
  //         ? await uploadFileToS3(q.options[0].image, "options")
  //         : null;

  //   const option2ImageUrl =
  //     typeof q.options?.[1] === "string"
  //       ? null
  //       : q.options?.[1]?.image
  //         ? await uploadFileToS3(q.options[1].image, "options")
  //         : null;

  //   const option3ImageUrl =
  //     typeof q.options?.[2] === "string"
  //       ? null
  //       : q.options?.[2]?.image
  //         ? await uploadFileToS3(q.options[2].image, "options")
  //         : null;

  //   const option4ImageUrl =
  //     typeof q.options?.[3] === "string"
  //       ? null
  //       : q.options?.[3]?.image
  //         ? await uploadFileToS3(q.options[3].image, "options")
  //         : null;

  //   return {
  //     questionImage: questionImageUrl,
  //     addMatches: q.addMatches || "",
  //     solutionImage: solutionImageUrl,
  //     option1: {
  //       text: typeof q.options?.[0] === "string" ? q.options[0] : q.options?.[0]?.text || "",
  //       image: option1ImageUrl,
  //     },
  //     option2: {
  //       text: typeof q.options?.[1] === "string" ? q.options[1] : q.options?.[1]?.text || "",
  //       image: option2ImageUrl,
  //     },
  //     option3: {
  //       text: typeof q.options?.[2] === "string" ? q.options[2] : q.options?.[2]?.text || "",
  //       image: option3ImageUrl,
  //     },
  //     option4: {
  //       text: typeof q.options?.[3] === "string" ? q.options[3] : q.options?.[3]?.text || "",
  //       image: option4ImageUrl,
  //     },
  //   };
  // };

  // // 🔹 Usage before saving
  // const handleSaveQuestion = async (q) => {
  //   const processedQ = await processQuestion(q);

  //   console.log("Final Question Payload:", processedQ);

  //   // Send to backend
  //   await fetch("http://localhost:80/api/questions", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(processedQ),
  //   });
  // };


  // 🔹 Define your backend base URL (local or production)
  const API_BASE_URL = "http://localhost:80/api";
  // 👉 In production, replace with your server URL, e.g.:
  // const API_BASE_URL = "https://yourdomain.com/api";


  // 🔹 Generic uploader for any file
  const uploadFileToS3 = async (file, folderName = "uploads") => {
    console.log(file)
    if (!file) return null;

    // Use original file name
    const fileName = encodeURIComponent(`${folderName}/${file.name}`);
    const fileType = encodeURIComponent(file.type);

    // ✅ Print details
    console.log("====================================");
    console.log("📂 Folder Name:", folderName);
    console.log("📝 File Name:", file.name);
    console.log("🏷️ File Type:", file.type);
    console.log("====================================");

    // Request presigned URL from backend
    const res = await fetch(
      `${API_BASE_URL}/image/presigned-url-image?folderPath=${folderName}&fileName=${fileName}&fileType=${fileType}`
    );

    if (!res.ok) {
      console.error("❌ Failed to get presigned URL:", await res.text());
      return null;
    }

    const { uploadUrl, fileUrl } = await res.json();
    console.log("✅ Presigned URL generated:", fileUrl);

    // Upload to S3
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (uploadRes.ok) {
      console.log("✅ Successfully uploaded:", fileUrl);
      return fileUrl;
    } else {
      console.error("❌ Upload failed for", file.name);
      return null;
    }
  };

  // 🔹 Process a question (uploads images → replaces with URLs)
  const processQuestion = async (q) => {
    const questionImageUrl = q.image ? await uploadFileToS3(q.image, "questions") : null;
    const showImageUrl = q.showImage ? await uploadFileToS3(q.showImage, "questions") : null;

    // const solutionImageUrl = q.solutionImage ? await uploadFileToS3(q.solutionImage, "solutions") : null;

    const option1ImageUrl = typeof q.options?.[0] === "string"
      ? null
      : q.options?.[0]?.image ? await uploadFileToS3(q.options[0].image, "options") : null;

    const option2ImageUrl = typeof q.options?.[1] === "string"
      ? null
      : q.options?.[1]?.image ? await uploadFileToS3(q.options[1].image, "options") : null;

    const option3ImageUrl = typeof q.options?.[2] === "string"
      ? null
      : q.options?.[2]?.image ? await uploadFileToS3(q.options[2].image, "options") : null;

    const option4ImageUrl = typeof q.options?.[3] === "string"
      ? null
      : q.options?.[3]?.image ? await uploadFileToS3(q.options[3].image, "options") : null;

    const processedQ = {
      questionImage: questionImageUrl,
      showImage: showImageUrl,
      addMatches: q.addMatches || "",
      // solutionImage: solutionImageUrl,
      option1: {
        text: typeof q.options?.[0] === "string" ? q.options[0] : q.options?.[0]?.text || "",
        image: option1ImageUrl,
      },
      option2: {
        text: typeof q.options?.[1] === "string" ? q.options[1] : q.options?.[1]?.text || "",
        image: option2ImageUrl,
      },
      option3: {
        text: typeof q.options?.[2] === "string" ? q.options[2] : q.options?.[2]?.text || "",
        image: option3ImageUrl,
      },
      option4: {
        text: typeof q.options?.[3] === "string" ? q.options[3] : q.options?.[3]?.text || "",
        image: option4ImageUrl,
      },
    };

    console.log("📝 Processed Question:", processedQ);
    return processedQ;
  };

  // 🔹 Save Question (send to backend API)
  const handleSaveQuestion = async (q) => {
    const processedQ = await processQuestion(q);

    console.log("🚀 Final Question Payload (to backend):", processedQ);

    try {
      const res = await fetch(`${API_BASE_URL}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(processedQ),
      });

      if (!res.ok) {
        throw new Error(`❌ Failed to save question: ${res.status}`);
      }

      const result = await res.json();
      console.log("📡 Backend Response:", result);
      return result;
    } catch (err) {
      console.error("⚠️ Error while saving question:", err);
      return null;
    }
  };



  const handleDeleteTest = () => {
    const confirmed = window.confirm("Are you sure You want to Delete this whole unit")
    if (!confirmed) return
    setLessonTestsMap(prev => {
      const updated = [...(prev[selectedUnit] || [])];
      updated.splice(editingTestIndex, 1);
      return { ...prev, [selectedUnit]: updated };
    });
    const testDatas = {
      dbname: courseName,
      parentId: lastClicked,
      rootId: firstClicked,
      subjectName: subjectName,
      testName: testName,
      timeLimit: testTimeLimit,
      marks: passPercentage,
      questionsList: questions.map(q => ({
        question: q.text || "",
        questionImage: q.image || null,
        explanation: q.explanation || "",
        option1: {
          text: q.options?.[0]?.text || "",
          image: q.options?.[0]?.image || null
        },
        option2: {
          text: q.options?.[0]?.text || "",
          image: q.options?.[0]?.image || null
        },
        option3: {
          text: q.options?.[0]?.text || "",
          image: q.options?.[0]?.image || null
        },
        option4: {
          text: q.options?.[0]?.text || "",
          image: q.options?.[0]?.image || null
        },
        answer: {
          text: q.options?.[q.correctIndex]?.text || "",
          image: q.options?.[q.correctIndex]?.image || null
        }
      }))
    };
    // console.log("deleteing test data:", testDatas);
    // console.log("JSON Stringified:", JSON.stringify(testDatas));
    try {
      const json = JSON.stringify(testDatas); // This should not throw
      fetch(`http://localhost:80/deleteQuestion/${lastClicked}`, {
        //  fetch(`https://trilokinnovations-api-prod.trilokinnovations.com/test/deleteQuestion/${lastClicked}`,{
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: json
      })
        .then(res => res.json())
        .then(data => {
          console.log("Test submitted:", data)
          getAllData()
          resetTestForm();
          setSelectedTest(null)
          setTestName('')
          //   setLastClicked(null)
          // setFirstClicked(null)
        })
        .catch(err => console.error("Submission failed:", err));
    } catch (err) {
      console.error("JSON stringify failed:", err);
    }
    resetTestForm();
  };
  const resetTestForm = () => {
    //console.log("here")
    setTestTimeLimit('');
    setQuestions([]);
    setCurrentQuestion({
      text: '',
      image1: null,
      options: [
        {
          text: '', image: null,
        },
        {
          text: '', image: null,
        },
        {
          text: '', image: null,
        },
        {
          text: '', image: null,
        },
      ],
      correctIndex: null,
      explanation: '',
    });
    setShowExplanationForm(false)
    setShowTestForm(false);
  };
  const currentUnits = standards.length > 0 ? unitsMap[selectedStandard] || [] : unitsMap.default || [];
  const renderSubtopicsRecursive = (subtopics, depth = 0) => {
    return subtopics.map((sub, idx) => (
      <li key={`${sub.title}-${idx}`} style={{ marginTop: '5px', marginLeft: `${depth * 10}px` }}>
        <span
          onClick={() => setSelectedSubtopic(sub)}
          style={{ cursor: 'pointer' }}
        >
          📘 {sub.title}
        </span>
        {sub.children && sub.children.length > 0 && (
          <ul style={{ marginLeft: '15px' }}>
            {renderSubtopicsRecursive(sub.children, depth + 1)}
          </ul>
        )}
      </li>
    ));
  };

















  const handleDeleteSubtopicReal = () => {
    const confirmed = window.confirm("Are you sure You want to Delete this whole unit")
    if (!confirmed) return
    const currentdata = {
      dbname: courseName,
      subjectName: subjectName,
      standard: standard,

      parentId: lastClicked,
      rootUnitId: firstClicked,
      unitName: subTitle,
      explanation: subDesc

    }

    setSavedItems([]);
    setCurrentQuestion(q => ({ ...q, image: null })); // reset uploaded image
    setSubDesc("");
    //console.log(currentdata)
    fetch(`http://localhost:80/deleteUnit`, {
      // fetch('https://trilokinnovations-api-prod.trilokinnovations.com/test/deleteUnit',{
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentdata)
    }).then(resp => {
      // console.log(resp)
    })
      .then(data => {
        // console.log('data updated successfully')
        getAllData()
        setEditSelecetedSubUnit('')
        setSelectedSubUnit(null)
        setSelectedUnit(null);
        setSelectedSubTopicUnit(null)
        setSelectedSubTopicUnitAudio([])
        setShowExplanationForm(false)
        setLastClicked(null)
        setFirstClicked(null)
      }).catch(err => console.log(err))
  }


  const unitSelection = (unit, path) => {
    // console.log("Selected Unit:", unit);
    //console.log("Unit Path:", path); // use directly
    setSelectedUnit(path);           // optional if needed elsewhere
    setSelectedSubtopic(null);
    setSelectedTest(null);
  };

  const handleSetEditSelecetedSubUnit = () => {
    setEditSelecetedSubUnit('value')
    setSubTitle(selectedSubUnit.unitName)
    setSubDesc(selectedSubUnit.explanation || "")
    setShowExplanationForm(true)
  }
  const removeServerAudio = (indexToRemove) => {
    setServerAudioFiles(prev => prev.filter((_, i) => i !== indexToRemove));
  };


  const addNewSubTopic = async () => {
    //  handleStopRecording()
    if (isRecording) {
      alert("Stop recording first before adding a subtopic.");
      return;
    }


    const allAudioFiles = [...recordedVoiceFiles, ...uploadedVoiceFiles];
    const uploadedUrls = [];
    for (const file of allAudioFiles) {
      console.log("Audio file object:", file);
      const fileName = encodeURIComponent(file.name);
      const fileType = encodeURIComponent(file.type);
      //console.log("inside audio sending to pre signed ",fileName)
      // 🔸 Get presigned PUT URL from backend
      //  const res = await fetch(`https://trilokinnovations-api-prod.trilokinnovations.com/test/api/audio/presigned-url?fileName=${fileName}&fileType=${fileType}`);

      const res = await fetch(`http://localhost:80/api/audio/presigned-url?fileName=${fileName}&fileType=${fileType}`);
      const { uploadUrl, fileUrl } = await res.json();
      //console.log(uploadUrl,"    0",fileUrl)
      // 🔸 Upload file to S3
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file
      });

      if (uploadRes.ok) {
        uploadedUrls.push(fileUrl);
      } else {
        // console.error("Upload failed for", file.name);
        return;
      }
    }
    let allUrls;
    if (editSelecetedSubUnit === 'value') {
      const oldUrls = selectedSubTopicUnit?.audioFileId || [];

      // 🔁 Merge both
      allUrls = [...oldUrls, ...uploadedUrls];
    }
    else {
      allUrls = [...uploadedUrls]
    }
    const currentdata = {
      dbname: courseName,
      subjectName: subjectName,
      standard: standard,

      parentId: lastClicked,
      rootUnitId: firstClicked,
      unitName: subTitle,
      explanation: subDesc,
      audioFileId: allUrls,
    }
    //console.log(currentdata)
    const formData = new FormData();
    formData.append("unit", new Blob([JSON.stringify(currentdata)], { type: "application/json" }));

    // Append all audio files as one field: "audioFiles"
    const url = editSelecetedSubUnit === 'value'
      ? 'http://localhost:80/updateSubsection'
      : 'http://localhost:80/addNewSubsection';
    // ?`https://trilokinnovations-api-prod.trilokinnovations.com/test/updateSubsection`
    // :`https://trilokinnovations-api-prod.trilokinnovations.com/test/addNewSubsection`

    fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: formData
    })
      .then(resp => {
        // console.log("✅ Upload response", resp);
        return resp.json();
      })
      .then(data => {
        getAllData();
        setSubTitle();
        setSubDesc()
        setEditSelecetedSubUnit('');
        setSelectedSubUnit(null);
        setSelectedUnit(null);
        setSelectedSubTopicUnit(null);
        setSelectedSubTopicUnitAudio([])
        setShowExplanationForm(false);
        setLastClicked(null);
        setFirstClicked(null);
        setRecordedVoiceFiles([]);
        setUploadedVoiceFiles([]);
        // console.log("✅ Data saved:", data);
        // Reset form

      })
      .catch(err => {
        console.error("❌ Error saving data", err);
      });
    setSelectedSubTopicUnitAudio([]);
    setRecordedVoiceFiles([])
    setUploadedVoiceFiles([])

  }

  const handleOptionImagesChange = (idx, fileList) => {
    const files = Array.from(fileList).slice(0, 4);
    setCurrentQuestion(q => {
      const options = [...q.options];
      const prev = options[idx] || {};
      options[idx] = {
        ...prev,
        images: files,
        // keep existing descriptions when possible; fill missing with ""
        imageDescriptions: files.map((_, i) => prev.imageDescriptions?.[i] || ""),
      };
      return { ...q, options };
    });
  };

  const handleImageDescChange = (idx, imgIdx, value) => {
    setCurrentQuestion(q => {
      const options = [...q.options];
      const opt = { ...options[idx] };
      const desc = [...(opt.imageDescriptions || [])];
      desc[imgIdx] = value;
      opt.imageDescriptions = desc;
      options[idx] = opt;
      return { ...q, options };
    });
  };




  const handleAddheadUnit = () => {

    if (editHeadUnit === 'value') {
      //console.log("inside editing")
      //   console.log(oldHeadUnitName,"    ",newUnit)
      fetch(`http://localhost:80/updateHeadUnit/${newUnit}`, {
        // fetch(`https://trilokinnovations-api-prod.trilokinnovations.com/test/updateHeadUnit/${newUnit}`,{
        //  fetch(`https://test-padmasiniAdmin-api.trilokinnovations.com/updateHeadUnit/${newUnit}`,{
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({

          dbname: courseName,
          subjectName: subjectName,
          unit: {
            unitName: oldHeadUnitName,
            standard: standard,

          }
        })
      }).then(resp => resp.json())
        .then((resp) => {
          //console.log("new unit",newUnit,"old unit",setOldHeadUnitName)
          // console.log("edit new unit resp",resp)
          if (resp.status === 'pass') {

            getAllData()
            setNewUnit('');
            setOldHeadUnitName('')
            setEditingLessonIndex(null);
            setEditHeadUnit('')
          }
          setNewUnit('');
          setOldHeadUnitName('')
          setEditingLessonIndex(null);
          setEditHeadUnit('')
        }).catch(err => {
          console.log("new unit fetch error", err)
        })
    }
    else {
      // console.log("inside adding")
      fetch(`http://localhost:80/addNewHeadUnit`, {
        // fetch(`https://trilokinnovations-api-prod.trilokinnovations.com/test/addNewHeadUnit`,{
        //  fetch(`https://test-padmasiniAdmin-api.trilokinnovations.com/addNewHeadUnit`,{
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({

          dbname: courseName,
          subjectName: subjectName,
          unit: {
            unitName: newUnit,
            standard: standard,

          }
        })
      }).then(resp => resp.json())
        .then((resp) => {

          //  console.log("add new unit resp",resp)
          if (resp.status === 'pass') {

            getAllData()
            setNewUnit('');
            setEditingLessonIndex(null);
            setEditHeadUnit('')
          }
        }).catch(err => {
          console.log("new unit fetch error", err)
        })
    }
  }


  const handleEditHeadLesson = (unitName) => {

    setNewUnit(unitName)
    setOldHeadUnitName(unitName)
    setEditHeadUnit("value");

  }
  const handleDeleteHeadLesson = (unitName) => {
    const confirmed = window.confirm("Are you sure You want to Delete this whole unit")
    if (!confirmed) return
    fetch(`http://localhost:80/deleteHeadUnit`, {
      // fetch(`https://trilokinnovations-api-prod.trilokinnovations.com/test/deleteHeadUnit`,{
      //  fetch(`https://test-padmasiniAdmin-api.trilokinnovations.com/deleteHeadUnit`,{
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({

        dbname: courseName,
        subjectName: subjectName,
        unit: {
          unitName: unitName,
          standard: standard,

        }
      })
    }).then(resp => resp.json())
      .then((resp) => {

        // console.log("add new unit resp",resp)
        if (resp.status === 'pass') {

          getAllData()
          setSelectedUnit(null);
        }
      }).catch(err => {
        console.log("new unit fetch error", err)
      })
  }

  const changeTestToFrontend = (realTest) => {
    const test = {
      name: realTest.testName,
      timeLimit: realTest.timeLimit,
      passPercentage: realTest.marks,
      questions: realTest.questionsList.map((q) => {
        const optionList = [
          { text: q.option1?.text || "", image: q.option1?.image || null },
          { text: q.option2?.text || "", image: q.option2?.image || null },
          { text: q.option3?.text || "", image: q.option3?.image || null },
          { text: q.option4?.text || "", image: q.option4?.image || null },
        ];
        const correctIndex = optionList.findIndex(
          (opt) =>
            opt.text === (q.answer?.text || "") &&
            opt.image === (q.answer?.image || null)
        );
        return {
          text: q.question || "",
          image: q.questionImage || null,
          options: optionList,
          correctIndex,
          explanation: q.explanation || "",
        };
      }),
    };

    setSelectedTest(test);
    setShowTestForm(false);
    setShowExplanationForm(false);
  };


  // const[knowUnit,setKnowUnit]=useState('');
  // const[knowSubUnit,setKnowSubUnit]=useState('');
  const [selectedSubTopicUnit, setSelectedSubTopicUnit] = useState()
  const [selectedSubTopicUnitAudio, setSelectedSubTopicUnitAudio] = useState([])

  const [serverAudioFiles, setServerAudioFiles] = useState([]);
  useEffect(() => {
    if (selectedSubTopicUnit?.audioFileId) {
      setServerAudioFiles(selectedSubTopicUnit.audioFileId);
    }
  }, [selectedSubTopicUnit]);
  const [selectedSubUnit, setSelectedSubUnit] = useState()
  const [editSelecetedSubUnit, setEditSelecetedSubUnit] = useState('')

  const [oldQuestionForDeletion, setOldQuestionForDeletion] = useState()
  const [editHeadUnit, setEditHeadUnit] = useState('')
  const [unitData, setUnitData] = useState(null);
  const [expandedUnits, setExpandedUnits] = useState({});
  const [firstClicked, setFirstClicked] = useState(null);
  const [lastClicked, setLastClicked] = useState(null);
  const renderUnitTree = (units, parentPath = '') => (
    <ul style={{ listStyleType: 'none', paddingLeft: '10px' }}>
      {units.map((unit, index) => {
        const currentPath = parentPath ? `${parentPath}/${unit.unitName}` : unit.unitName;

        const isFirst = firstClicked === unit.id;
        const isLast = lastClicked === unit.id;

        return (
          <li key={currentPath}>
            <div style={{ cursor: 'pointer', userSelect: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ marginBottom: '0px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ flexGrow: 1 }}>
                      <button
                        className={unit.standard ? 'lesson-btn' : 'none'}
                        style={{
                          padding: unit.standard ? 'none' : '0px',
                          margin: unit.standard ? 'none' : '0px',
                          color: unit.standard ? undefined : 'blue',
                          background: unit.standard ? undefined : 'none',
                        }}
                        onClick={() => handleUnitClick(unit, currentPath)}
                      >
                        📚 {unit.unitName}
                      </button>
                    </div>
                    {unit.standard && (
                      <>
                        <button
                          className="icon-btn"
                          onClick={() => handleEditHeadLesson(unit.unitName)}
                          title="Edit"
                          style={{ marginLeft: '5px' }}
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          className="icon-btn"
                          onClick={() => handleDeleteHeadLesson(unit.unitName)}
                          title="Delete"
                          style={{ marginLeft: '5px' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    {expandedUnits[currentPath] &&
                      unit.test &&
                      unit.test.map((test, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setTestName(test.testName);
                            changeTestToFrontend(test);
                            // ⬇️ Set firstClicked and lastClicked here
                            const rootId = findRootOfUnit(unit.id, unitData);
                            setFirstClicked(rootId);
                            setLastClicked(unit.id);

                            // ⬇️ Also update selectedSubTopicUnit to the parent unit for context
                            setSelectedSubTopicUnit(unit);
                          }}
                          style={{ padding: '0px', marginLeft: '0px', background: 'none', color: 'blue' }}
                        >
                          📝 {test.testName} - Assessment
                        </button>
                      ))}
                  </div>
                </div>
              </div>

              {unit.units && unit.units.length > 0 && (
                <span style={{ marginLeft: '0px', color: 'gray' }}>
                  {expandedUnits[currentPath]}
                </span>
              )}
            </div>

            {unit.units && unit.units.length > 0 && expandedUnits[currentPath] &&
              renderUnitTree(unit.units, currentPath)}
          </li>
        );
      })}
    </ul>
  );
  const [unitPath, setUnitPath] = useState('');


  const handleUnitClick = (unit, path) => {
    if (!selectedSubTopicUnitAudio) { console.log("no audio file bro") }
    setSelectedSubTopicUnitAudio([]);
    setRecordedVoiceFiles([])
    setUploadedVoiceFiles([])

    setSelectedSubTopicUnit(unit)

    const rootId = findRootOfUnit(unit.id, unitData); // Find root
    setFirstClicked(rootId); // Set first clicked as root of last
    setLastClicked(unit.id); // Last clicked as this unit
    //setKnowSubUnit(unit.unitName)
    //console.log('unit id',unit.unitName)
    toggleExpand(path);

    //setSelectedSubTopicUnitAudio(unit.audioFileId)
    unitSelection(unit, path)  // pass path directly
    //console.log("Rendering audios:", selectedSubTopicUnitAudio);

    //setSelectedSubTopicUnit(unit)
    // console.log("Clicked Path:", path);
    setUnitPath(path);
    if (!unit.standard) setSelectedSubUnit(unit)
    const newAudioIds = Array.isArray(unit.audioFileId)
      ? unit.audioFileId
      : unit.audioFileId
        ? [unit.audioFileId]
        : [];

    setTimeout(() => {
      setSelectedSubTopicUnitAudio(newAudioIds);
      console.log("✅ Updated audio to:", newAudioIds);
      //console.log(newAudioIds.name)
    }, 0);
  };
  const toggleExpand = (id) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const findRootOfUnit = (targetId, units, parentId = null) => {
    for (let unit of units) {
      if (unit.id === targetId) {

        return parentId ?? unit.id; // Return parent if exists, else self (root)
      }
      if (unit.units) {
        const result = findRootOfUnit(targetId, unit.units, parentId ?? unit.id);
        if (result) {
          // setKnowUnit(unit.unitName)
          return result;
        }
      }
    }
    return null;
  };
  // const audioFetch = async (id) => {
  //   try {
  //     const response = await fetch(`http://localhost:8081/getAudio/${id}`, {
  //       method: 'GET'
  //     });

  //     if (!response.ok) throw new Error('Failed to fetch audio');

  //     const blob = await response.blob();
  //     const audioUrl = URL.createObjectURL(blob);
  //     setAudioUrls(prev => ({ ...prev, [id]: audioUrl }));
  //     //return audioUrl;

  //   } catch (error) {
  //     console.error("Audio fetch error:", error);
  //     //return null;
  //   }
  // };
  const handleDeleteServerAudio = (fileUrl) => {
    // const confirmed = window.confirm("Are you sure you want to delete this audio file?");
    // if (!confirmed) return;

    // fetch(`http://localhost:80/deleteAudio/${fileId}/${courseName}/${subjectName}`, {
    //  fetch(`https://test-padmasiniAdmin-api.trilokinnovations.com/deleteAudio/${fileId}/${courseName}/${subjectName}`,{
    //     method: "DELETE",
    //     credentials: "include"
    //   })
    //     .then((res) => {
    //       if (!res.ok) throw new Error("Failed to delete audio");
    //       // Update frontend state (remove the deleted audio id from unit)
    //       const updatedAudioIds = selectedSubTopicUnit.audioFileId.filter(id => id !== fileId);
    //       setSelectedSubTopicUnit(prev => ({ ...prev, audioFileId: updatedAudioIds }));
    //     })
    //     .catch((err) => {
    //       console.error("Error deleting audio:", err);
    //       alert("Failed to delete audio");
    //     });
    fetch("http://localhost:80/api/audio/delete-file", {
      // fetch(`https://trilokinnovations-api-prod.trilokinnovations.com/test/api/audio/delete-file`,{
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        fileUrl: fileUrl
        // Replace with actual unitId
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("✅ Success:", data);
        const updatedAudioIds = selectedSubTopicUnit.audioFileId.filter(id => id !== fileUrl);
        setSelectedSubTopicUnit(prev => ({ ...prev, audioFileId: updatedAudioIds }));
      })
      .catch((error) => {
        console.error("❌ Error:", error);
      });
  };
  //update fetch for delete audio



  useEffect(() => {
    if (selectedSubTopicUnit?.audioFileId) {
      setServerAudioFiles(selectedSubTopicUnit.audioFileId);
    }
  }, [selectedSubTopicUnit]);

  // const parseTextWithFormulas = (text) => {
  //   // Step 1: Temporarily replace escaped \$ with a placeholder
  //   const TEMP_DOLLAR = '__DOLLAR__';
  //   const safeText = text.replace(/\\\$/g, TEMP_DOLLAR);

  //   // Step 2: Split on math expressions inside $...$
  //   const parts = safeText.split(/(\$[^$]+\$)/g);

  //   // Step 3: Render parts
  //   return parts.map((part, index) => {
  //     if (part.startsWith('$') && part.endsWith('$')) {
  //       const latex = part.slice(1, -1); // remove the surrounding $s
  //       return <InlineMath key={index} math={latex} />;
  //     } else {
  //       // Step 4: Restore $ in pl ain text
  //       return <span key={index}>{part.replace(new RegExp(TEMP_DOLLAR, 'g'), '$')}</span>;
  //     }
  //   });
  // };
  // const parseTextWithFormulas = (text) => {
  //   const TEMP_DOLLAR = '__DOLLAR__';
  //   const safeText = text.replace(/\\\$/g, TEMP_DOLLAR);
  //   const parts = safeText.split(/(\$[^$]+\$)/g);

  //   return parts.map((part, index) => {
  //     if (part.startsWith('$') && part.endsWith('$')) {
  //       const latex = part.slice(1, -1);
  //       return <InlineMath key={index}>{latex}</InlineMath>;
  //     } else {
  //       return <span key={index}>{part.replaceAll(TEMP_DOLLAR, '$')}</span>;
  //     }
  //   });
  // };


  // const parseTextWithFormulas = (text) => {
  //   const TEMP_DOLLAR = '__DOLLAR__';
  //   const safeText = text.replace(/\\\$/g, TEMP_DOLLAR);
  //   const parts = safeText.split(/(\$[^$]+\$)/g);

  //   return parts.map((part, i) => {
  //     if (part.startsWith('$') && part.endsWith('$')) {
  //       const latex = part.slice(1, -1);
  //       const html = katex.renderToString(latex, { throwOnError: false });
  //       return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
  //     }
  //     return <span key={i}>{part.replaceAll(TEMP_DOLLAR, '$')}</span>;
  //   });
  // };
  // const parseTextWithFormulas = (text) => {
  //   const TEMP_DOLLAR = '__DOLLAR__';
  //   const safeText = text.replace(/\\\$/g, TEMP_DOLLAR);
  //   const parts = safeText.split(/(\$[^$]+\$)/g);

  //   return parts.map((part, index) => {
  //     if (part.startsWith('$') && part.endsWith('$')) {
  //       const latex = part.slice(1, -1);
  //       try {
  //         const html = katex.renderToString(latex, { throwOnError: false });
  //         return <span key={index}>{parse(html)}</span>;
  //       } catch (err) {
  //         return <span key={index} style={{ color: 'red' }}>{latex}</span>;
  //       }
  //     } else {
  //       return <span key={index}>{part.replaceAll(TEMP_DOLLAR, '$')}</span>;
  //     }
  //   });
  // };


  const parseTextWithFormulas = (texts) => {
    if (!texts) return;
    const text = texts.replace(/\\\\/g, "\\")
    const TEMP_DOLLAR = '__DOLLAR__';
    const safeText = text.replace(/\\\$/g, TEMP_DOLLAR);

    const parts = safeText.split(/(\$[^$]+\$)/g);

    return parts.map((part, index) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        const latex = part.slice(1, -1);
        try {
          const html = katex.renderToString(latex, {
            throwOnError: false,
            output: 'html',
          });
          return <span key={index}>{parse(html)}</span>;
        } catch (err) {
          return <span key={index} style={{ color: 'red' }}>{latex}</span>;
        }
      } else {
        return <span key={index}>{part.replaceAll(TEMP_DOLLAR, '$')}</span>;
      }
    });
  };
  //////////////////image part//////////////


































  return (
    <div className="adminright-container">
      <h2 className="title">
        You are in:
        {examTitle && ` ${examTitle} -`}
        {subjectName && ` ${subjectName}`}
        {standard && ` (Standard ${standard})`}
      </h2>

      <div className="adminright-grid">
        <div className="left-panel">
          <h3>{editingLessonIndex !== null ? 'Edit Lesson' : 'Add New Lesson'}</h3>
          <input
            type="text"
            placeholder="Enter lesson name"
            value={newUnit}
            onChange={(e) => setNewUnit(e.target.value)}
          />
          <button onClick={handleAddheadUnit}>
            {(editingLessonIndex !== null || editHeadUnit !== '') ? 'Update Lesson' : 'Add Lesson'}
          </button>
          <div className="bottom-box">
            <h3>All Lessons</h3>
            <h4>Select Lesson</h4>
            <div>
              {unitData && renderUnitTree(unitData)}
              {currentUnits.map((unit, index) => (
                <button key={index}>{unit.unitName}</button>
              ))}
            </div>
            {currentUnits.map((unit, index) => (
              <React.Fragment key={index}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0' }}>
                  <button
                    className="lesson-btn"
                    onClick={() => {
                      unitSelection(unit)
                    }}
                  >
                    📚 {unit}
                  </button>
                  <button className="icon-btn" onClick={() => handleEditLesson(index)} title="Edit">
                    <Pencil size={18} />
                  </button>
                  <button className="icon-btn" onClick={() => handleDeleteLesson(index)} title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Subtopics */}
                {selectedUnit === unit && lessonSubtopicsMap[unit]?.length > 0 && (
                  <ul style={{ marginLeft: '20px', marginTop: '5px', color: 'blue' }}>
                    {renderSubtopicsRecursive(lessonSubtopicsMap[unit])}
                  </ul>
                )}
                {/* Tests */}
                {selectedUnit === unit && lessonTestsMap[unit]?.length > 0 && (
                  <ul style={{ marginLeft: '20px', marginTop: '5px', color: 'green' }}>
                    {lessonTestsMap[unit].map((test, idx) => (
                      <li
                        key={`test-${idx}`}
                        onClick={() => {
                          setSelectedTest(test);
                          setShowTestForm(false);
                          setShowExplanationForm(false);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        📝 {test.name}
                      </li>
                    ))}
                  </ul>
                )}
              </React.Fragment>
            ))}
          </div>
          <button
            onClick={() => {
              const confirmed = window.confirm("Are you sure you want to clear all stored data?");
              if (confirmed) {
                localStorage.removeItem('admin_unitsMap');
                localStorage.removeItem('admin_subtopicsMap');
                localStorage.removeItem('admin_testsMap');
                window.location.reload();
              }
            }}
          >
            Clear All Stored Data
          </button>

          <button
            onClick={() => navigate('/adminhome')}
          >
            Back to Admin Home
          </button>
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
              {selectedSubTopicUnit && selectedSubTopicUnit.test && (
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
                      image: null,
                      options: [
                        { text: '', image: null },
                        { text: '', image: null },
                        { text: '', image: null },
                        { text: '', image: null },
                      ],
                      correctIndex: null,
                      explanation: '',
                    });
                    setQuestions([]);
                    setEditingTestIndex(null);
                  }}
                >
                  Add Test
                </button>
              )}
            </div>
            {selectedSubTopicUnit && !selectedSubTopicUnit.standard && (
              <div className="subtopic-detail-box" style={{ marginTop: '20px' }}>
                <h4>Subtopic Preview</h4>
                <p><strong>Title:</strong> {selectedSubTopicUnit.unitName}</p>
                <p><strong>Description:</strong> {parseTextWithFormulas(selectedSubTopicUnit.explanation)}</p>
                {/* <div>{parseTextWithFormulas("This is a quadratic formula: $\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ and here is a dollar: \\$5")}</div> */}
                <div style={{ paddingLeft: "2px" }}>
                  <h5>Audio:</h5>
                  {selectedSubTopicUnitAudio && Array.isArray(selectedSubTopicUnitAudio) && selectedSubTopicUnitAudio.length > 0 && (
                    selectedSubTopicUnitAudio.map((id, index) => {
                      const fileName = id.split('/').pop();
                      return (
                        <div key={index} style={{ marginBottom: "8px" }}>
                          <div style={{ marginBottom: "4px", fontWeight: "bold" }}>{fileName}</div>
                          {/* <audio controls src={`http://localhost:80/getAudio/${id}/${courseName}/${subjectName}`} />  */}
                          <audio key={index} controls src={id} />
                        </div>
                      );
                    })
                  )}
                </div>
                {/* <div>
      <h5>Audio:</h5>
      {selectedSubtopic.voices.map((audioFile, idx) => (
        <audio
          key={idx}
          controls
          src={URL.createObjectURL(audioFile)}
          style={{ marginBottom: '10px' }}
        />
      ))}
    </div> */}
                {/* <div>
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
      </div> */}
                {/* NEW: Edit/Delete Buttons */}
                <div className="subtopic-actions" style={{ marginTop: '15px' }}>
                  <button
                    className="icon-btn"
                    onClick={() => {
                      handleSetEditSelecetedSubUnit()
                    }}
                    title="Edit Subtopic"
                  >
                    <Pencil size={10} /> Edit
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => {
                      handleDeleteSubtopicReal()
                    }}
                    title="Delete Subtopic"
                    style={{ marginLeft: '10px' }}
                  >
                    <Trash2 size={10} /> Delete
                  </button>
                </div>


              </div>
            )}
            {selectedTest && (
              <div className="test-detail-box" style={{ marginTop: '20px' }}>
                <h4>Test Preview</h4>
                <p><strong>Name:</strong> {selectedTest.name}</p>
                {/* <p><strong>Time Limit:</strong> {selectedTest.timeLimit} mins</p> */}
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
                    // setTestTimeLimit(selectedTest.timeLimit);
                    setPassPercentage(selectedTest.passPercentage)
                    setOldQuestionForDeletion(selectedTest.name)
                    setEditingTestIndex("value");
                  }}>        <Pencil size={10} /> All Edit
                  </button>
                  <button onClick={() => {
                    // console.log("Delete clicked!");
                    setTestName(selectedTest.name);
                    handleDeleteTest();
                  }} style={{ marginLeft: '10px' }}>
                    <Trash2 size={10} /> All Delete
                  </button>
                </div>
              </div>
            )}
            {showExplanationForm && (
              <div className="explanation-form">
                <h4>{selectedSubtopic ? 'Add Child Subtopic' : 'Add Subtopic'}</h4>
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
                <input id="imageInput"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]; // take only the first file
                    setCurrentQuestion(q => ({ ...q, image: file }));
                  }}
                />

                {currentQuestion.image && (
                  <div style={{ position: "relative", marginTop: 10 }}>
                    <img
                      src={
                        typeof currentQuestion.image === "string"
                          ? currentQuestion.image
                          : URL.createObjectURL(currentQuestion.image)
                      }
                      alt="upload-preview"
                      width="120"
                      height="120"
                      style={{ objectFit: "cover", borderRadius: 6 }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentQuestion(q => ({ ...q, image: null }))

                      }

                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        background: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: 20,
                        height: 20,
                        cursor: "pointer",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="action-buttons">
                  <button onClick={handleSaveImage}>
                    {editingTestIndex === "value" ? "Update Test" : "Save"}
                  </button>
                  <button
                    onClick={() => {
                      resetTestForm()
                    }}

                  >Cancel</button>
                </div>

                {/* Show saved list */}
                <div style={{ marginTop: 20 }}>
                  {savedItems.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: 10 }}>
                      <p><b>Image:</b> {item.imageName}</p>
                      <p><b>Description:</b> {item.description}</p>
                    </div>
                  ))}
                </div>


                {/* Record Audio */}
                <div className='recordaudio'>
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

                  {((selectedSubTopicUnit && selectedSubTopicUnit.audioFileId?.length > 0) || uploadedVoiceFiles.length > 0) && (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {/* Show audio files from backend (already uploaded) */}
                      {editSelecetedSubUnit === 'value' && selectedSubTopicUnit.audioFileId?.map((id, index) => (
                        <li key={index} style={{ marginTop: '10px' }}>
                          <audio controls src={id} />
                          <button
                            className="remove-button"
                            onClick={() => handleDeleteServerAudio(id)}
                          >
                            Delete
                          </button>
                          {/* Optional: Add a delete button for server audio if you want */}
                        </li>

                      ))}

                      {/* Show newly selected files before upload */}
                      {uploadedVoiceFiles.map((file, index) => (
                        <li key={`local-${index}`} style={{ marginTop: '10px' }}>
                          <audio controls src={URL.createObjectURL(file)} />
                          <button
                            className="remove-button"
                            onClick={() =>
                              setUploadedVoiceFiles((prev) => prev.filter((_, i) => i !== index))
                            }
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* Upload Video */}
                {/* <div style={{ marginTop: '20px' }}>
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
</div> */}
                {/* {lessonSubtopicsMap[selectedUnit]?.length > 0 && (
  <div>
    <h5>Subtopics Added:</h5>
    <ul>{lessonSubtopicsMap[selectedUnit].map((s, idx) => (
      <li key={idx}>{s.title}</li>
    ))}</ul>
  </div>
)} */}
                <div className="action-buttons">
                  <button
                    onClick={() => { addNewSubTopic(); }
                      // selectedSubtopic
                      //   ? handleAddChildSubtopic(selectedSubtopic)  // you define this function separately
                      //   : handleAddSubtopic()
                    }
                  >
                    {editSelecetedSubUnit === 'value'
                      ? 'Update Subtopic'
                      : selectedSubtopic
                        ? 'Add Child Subtopic'
                        : 'Add Subtopic'}
                  </button>
                  <button
                    onClick={() => {
                      if (isRecording) {
                        alert("Stop recording first before adding a subtopic.");
                        return;
                      }
                      resetExplanationForm();
                    }}
                  >
                    Cancel
                  </button>
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
                {/* <input
                  type="number"
                  placeholder="Time limit (minutes)"
                  min="1"
                  value={testTimeLimit}
                  onChange={(e) => setTestTimeLimit(e.target.value)}
                /> */}
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

                {/* <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setCurrentQuestion((q) => ({ ...q, image: file }));
                    }
                  }}
                /> */}
                {/* {currentQuestion.image && (
                  <img
                    src={URL.createObjectURL(currentQuestion.image)}
                    alt="Question Preview"
                    style={{ width: "150px", marginTop: "8px" }}
                  />
                )} */}

                <div style={{ marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentQuestion((q) => ({ ...q, showImage: true }))
                    }
                  >
                    Add Image
                  </button>

                  {/* Rows & Columns Selector for Matches */}
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={currentQuestion.rows}
                    onChange={(e) =>
                      setCurrentQuestion((q) => ({ ...q, rows: parseInt(e.target.value) }))
                    }
                    style={{ marginLeft: "1rem", width: "50px" }}
                  />
                  <span> Rows </span>

                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={currentQuestion.cols}
                    onChange={(e) =>
                      setCurrentQuestion((q) => ({ ...q, cols: parseInt(e.target.value) }))
                    }
                    style={{ marginLeft: "0.5rem", width: "50px" }}
                  />
                  <span> Cols </span>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentQuestion((q) => ({
                        ...q,
                        showMatches: true,
                        tableData: generateTable(q.rows, q.cols),
                        tableEditable: true,
                      }))
                    }
                    style={{ marginLeft: "0.5rem" }}
                  >
                    Add Matches
                  </button>
                </div>

                {/* Conditional image input */}
                {currentQuestion.showImage && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setCurrentQuestion((q) => ({ ...q, showImage: file })); // ✅ Fix here
                    }}
                    style={{ marginTop: "0.5rem" }}
                  />
                )}


                {currentQuestion.showMatches && (
                  <div style={{ marginTop: "1rem" }}>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentQuestion((q) => ({
                          ...q,
                          tableEditable: !q.tableEditable,
                        }))
                      }
                    >
                      {currentQuestion.tableEditable ? "Lock Table" : "Edit Table"}
                    </button>

                    <table
                      border="1"
                      style={{ marginTop: "0.5rem", borderCollapse: "collapse" }}
                    >
                      <tbody>
                        {currentQuestion.tableData.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, colIndex) => (
                              <td
                                key={colIndex}
                                style={{
                                  width: 80,
                                  height: 40,
                                  textAlign: "center",
                                  padding: "4px",
                                }}
                              >
                                {currentQuestion.tableEditable ? (
                                  <input
                                    type="text"
                                    value={cell}
                                    onChange={(e) => {
                                      const newTable = currentQuestion.tableData.map(
                                        (r, rIdx) =>
                                          rIdx === rowIndex
                                            ? r.map((c, cIdx) =>
                                              cIdx === colIndex ? e.target.value : c
                                            )
                                            : r
                                      );
                                      setCurrentQuestion((q) => ({
                                        ...q,
                                        tableData: newTable,
                                      }));
                                    }}
                                    style={{ width: "100%" }}
                                  />
                                ) : (
                                  cell
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

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
                      value={opt.text}
                      onChange={(e) => {
                        const newOpts = [...currentQuestion.options];
                        newOpts[idx] = e.target.value;
                        setCurrentQuestion((q) => ({ ...q, options: newOpts }));
                      }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const newOpts = [...currentQuestion.options];
                          newOpts[idx] = { ...newOpts[idx], image: file };
                          setCurrentQuestion((q) => ({ ...q, options: newOpts }));
                        }
                      }}
                    />
                    {opt.image && (
                      <img
                        src={URL.createObjectURL(opt.image)}
                        alt={`Option ${idx + 1} Preview`}
                        style={{ width: "100px", marginLeft: "10px" }}
                      />
                    )}
                  </div>
                ))}
                <textarea
                  placeholder="Explain the correct answer"
                  rows={3}
                  value={currentQuestion.explanation}
                  onChange={(e) => setCurrentQuestion((q) => ({ ...q, explanation: e.target.value }))}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setCurrentQuestion((q) => ({ ...q, image: file }));
                    }
                  }}
                />
                <button onClick={handleAddQuestion}>Add Question</button>
                {editingQuestionIndex !== null && (
                  <button
                    onClick={() => {
                      setEditingQuestionIndex(null);
                      setCurrentQuestion({
                        text: '',
                        image: null,
                        options: [
                          { text: '', image: null },
                          { text: '', image: null },
                          { text: '', image: null },
                          { text: '', image: null },
                        ],
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
                        <div>
                          {q.text && <strong>{q.text}</strong>}
                          {q.image && (
                            <div>
                              <img
                                src={typeof q.image === "string" ? q.image : URL.createObjectURL(q.image)}
                                alt="Question"
                                style={{ maxWidth: "150px", display: "block", marginTop: "5px" }}
                              />
                            </div>
                          )}
                        </div>
                        <div style={{ marginTop: '5px' }}>
                          <button
                            onClick={() => {
                              setCurrentQuestion({ ...q })
                              setEditingQuestionIndex(idx);
                              handleEditQuestion(idx)
                              handleOptionImagesChange(idx)
                              handleImageDescChange(idx)

                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              const confirmed = window.confirm("Are you sure You want to Delete this whole unit")
                              if (!confirmed) return
                              const updatedQuestions = questions.filter((_, i) => i !== idx);
                              setQuestions(updatedQuestions);
                              if (editingQuestionIndex === idx) {
                                setCurrentQuestion({
                                  text: '',
                                  image: null,
                                  options: [
                                    { text: '', image: null },
                                    { text: '', image: null },
                                    { text: '', image: null },
                                    { text: '', image: null },
                                  ],
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
                    {editingTestIndex === 'value' ? 'Update Test' : 'Save Test'}
                  </button>
                  {editingTestIndex === 'value' && (
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