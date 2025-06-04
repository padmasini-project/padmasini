import React, { useState, useEffect } from 'react';
import './HomeRight.css';
import Drawer from './Drawer';
import AudioRecorder from './AudioRecorder';
const HomeRight = ({  selectedSubject}) => {
  const[inputValue,setInputValue]=useState('');
  const [unitData, setUnitData] = useState(null);
  const[unitName,setUnitName]=useState('');
  const [expandedUnits, setExpandedUnits] = useState({});
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
   const [explanationForUnit,setExplanationForUnit]=useState('')
  const [audioFile, setAudioFile] = useState(null); // recorded blob
const [inputFile, setInputFile] = useState(null); // browsed file
  
   //const [audioUrls, setAudioUrls] = useState({});
  const[knowUnit,setKnowUnit]=useState('');
  const[knowSubUnit,setKnowSubUnit]=useState('');
   const [videoFile, setVideoFile] = useState(null);
  console.log(audioFile+""+videoFile)
  const [firstClicked, setFirstClicked] = useState(null);
const [lastClicked, setLastClicked] = useState(null);
  const [filteredData,setFilteredData]=useState('')
  const [selectedStandard,setSelectedStandard]=useState('');
  const kinderClass=["Kindergarden Jr","Kindergarden Sr"]
  const schoolClass=["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th"]
  const toSuperscript = (className) => {
    const suffixMap = {
      st: "ˢᵗ",
      nd: "ⁿᵈ",
      rd: "ʳᵈ",
      th: "ᵗʰ",
    };
    const match = className.match(/^(\d+)(st|nd|rd|th)$/);
    if (match) {
      const [_, number, suffix] = match;
      return number + suffixMap[suffix];
    }
    return className;
  };
  
  const handleCancel = () => {
    setInputValue('');
    setExplanationForUnit('');
    setFirstClicked(null);
    setLastClicked(null);
  };
  
const checkStandard=()=>{
  return selectedStandard !== null && selectedStandard !== '';
};
const checkFirstClicked=()=>{
  return firstClicked!==null&&firstClicked!=='';
}

  const handleAddUnit=()=>{
    try{
      if(checkStandard()){
        if(unitName!==''&&unitName.trim()!==''){

          const start = performance.now();
          fetch(`https://padmasiniadmin-1.onrender.com/addNewUnit/${selectedSubject}`,{
            method:'POST',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({
              unitName: unitName,
              standard: selectedStandard
            })
          })
          
          .then(() => {
            const end = performance.now();
            console.log(`API call took: ${end - start} ms`);
            setUnitName('')
            handleClickForFetch(selectedSubject)
          })
          .catch(err => {
            console.error('Fetch all error:', err);
          });
        }
        else{
          throw new Error ("Unit Name Cannot Be Empty")
        }
      }
      else {
        throw new Error("Please select a standard")
      }
    }
    catch(error){
      alert(error.message)
    }
  }
const handleAddNewSubunit=()=>{
  try{
   if(checkStandard()){
    if(checkFirstClicked()){
      if(inputValue!==''||inputValue.trim()!==''){
       
          fetchFunction("addNewSubUnit")
        }
        else{
          throw new Error("sub section cannot be empty")
        }
    }
    else{throw new Error("please select a unit")}
   }
   else {throw new Error("standard cannot be empty")}
  }
  catch(error){
    alert(error.message)
  }
}
const handleUpdateUnit=()=>{
  try{
    if(checkStandard()){
     if(checkFirstClicked()){
       if(inputValue!==''||inputValue.trim()!==''||explanationForUnit!==''
       ||explanationForUnit.trim()!==''||audioFile!==null||inputFile!==null){
            
          fetchFunction("updateUnit")
         }
         else{
           throw new Error("sub section cannot be empty")
         }
     }
     else{throw new Error("please select a unit")}
    }
    else {throw new Error("standard cannot be empty")}
   }
   catch(error){
     alert(error.message)
   }
}
const handleDeleteUnit=()=>{
  try{
    if(checkStandard()){
     if(checkFirstClicked()){
      
          fetchFunction("deleteUnit")
     }
     else{throw new Error("please select a unit")}
    }
    else {throw new Error("standard cannot be empty")}
   }
   catch(error){
     alert(error.message)
   }
}
const fetchFunction=(name)=>{
  console.log("First clicked:", firstClicked);
  console.log("Last clicked:", lastClicked);
  console.log(selectedSubject)
  console.log(inputValue)
  console.log(explanationForUnit)
  console.log(selectedStandard)
        const fileToSend = audioFile || inputFile;
        console.log("audio file",fileToSend)
        let formData = new FormData();
        formData.append('parentId',lastClicked)
        formData.append( "standard",selectedStandard)
        if(inputValue!=='')formData.append( "unitName",inputValue)
        formData.append("rootUnitId",firstClicked)
        formData.append("subjectName",selectedSubject)
        if(explanationForUnit!=='')formData.append("explanation",explanationForUnit)
        if (fileToSend) {
  formData.append('audioFileId', fileToSend); // Only append if file exists
}
        let url = '';
        let method = '';
       
        if(name==='addNewSubUnit'){
          url=`https://padmasiniadmin-1.onrender.com/addNewSubsection`;
          method='POST';
        }
        else if(name==='updateUnit'){
          url=`https://padmasiniadmin-1.onrender.com/updateSubsection`;
          method='PUT';
        }
        else if(name==='deleteUnit'){
          url=`https://padmasiniadmin-1.onrender.com/deleteUnit`;
          method='DELETE';
        }
        const start = performance.now();
        fetch(url,{
          method: method,
          body : formData
      })
      .then(()=>{
        setInputValue('')
        setExplanationForUnit('')
        setAudioFile(null)
        setInputFile(null)
        handleClickForFetch(selectedSubject)
        const end = performance.now();
        console.log(`API call took: ${end - start} ms`);
      })
      .catch(err=>{
        console.log('error messge ',err)
    })
    setExplanationForUnit('')
    console.log(explanationForUnit)
    if(name==='deleteUnit'){
      setFirstClicked(null);
      setLastClicked(null);      
    }
    
}
  
  const handleClickForFetch = (subject) => {
    const start = performance.now();
    fetch(`https://padmasiniadmin-1.onrender.com/getAllUnits/${subject}`, {
      method: 'GET',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(data => {
        setUnitData(data)
        console.log('Fetched data in home right :', data);
        const filteredNew = data.filter(item => item.standard === selectedStandard);
        setFilteredData(filteredNew);
        filteredNew && renderUnitTree(filteredNew)
        // Example: setData(data);
        const end = performance.now();
        console.log(`API call took: ${end - start} ms`);
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  };

  
  
  useEffect(() => {
    if (selectedSubject) {
      handleClickForFetch(selectedSubject);
    }
  }, [selectedSubject]);
  

  const renderUnitTree = (units, parentPath = '') => (
    <ul style={{ listStyleType: 'none', paddingLeft: '20px' }}>
      {units.map((unit, index) => {
        const currentPath = `${parentPath}/${unit.unitName}-${index}`;
        {/* const isFirst = firstClicked?.id === unit.id;
      const isLast = lastClicked?.id === unit.id; */}
      const isFirst = firstClicked === unit.id;
const isLast = lastClicked === unit.id;
      const highlightStyle = {
        backgroundColor: isFirst ? '#cce5ff' : isLast ? '#d4edda' : 'transparent',
        padding: '5px',
        borderRadius: '5px'
      };
     // let audioUrl=null;
      //if(unit.audioFileId){ audioUrl=audioFetch(unit.audioFileId)}
      //console.log("audio url inside",audioUrl)
        return (
          <li key={currentPath}>
            <div
              onClick={() => handleUnitClick(unit, currentPath)}
              style={{ cursor: 'pointer', userSelect: 'none', ...highlightStyle }}
            >
              <span style={{ fontWeight: 'bold' }}>{unit.unitName}</span>
              {unit.units && unit.units.length > 0 && (
                <span style={{ marginLeft: '10px', color: 'gray' }}>
                  {expandedUnits[currentPath] }
                  
                </span>
                
              )}
             
            </div>
             <div  style={{paddingLeft:"2px"}}
             >
              {unit.explanation&&<p>{unit.explanation}</p>}
            </div>
            <div style={{paddingLeft:"2px"}} >
               {unit.audioFileId && (
  <audio controls src={`https://padmasiniadmin-1.onrender.com/getAudio/${unit.audioFileId}`} />
)}

            </div>
           
            {unit.units && unit.units.length > 0 && expandedUnits[currentPath] &&
              renderUnitTree(unit.units, currentPath)}
          </li>
        );
      })}
    </ul>
  );
 
    const handleUnitClick = (unit, path) => {
    const rootId = findRootOfUnit(unit.id, unitData); // Find root
    setFirstClicked(rootId); // Set first clicked as root of last
    setLastClicked(unit.id); // Last clicked as this unit
      setKnowSubUnit(unit.unitName)
      //console.log('unit id',unit.unitName)
    toggleExpand(path);
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
          setKnowUnit(unit.unitName)
          return result;}
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

  return (
    <div className="right-components">
    <div><h1>You are in {selectedSubject}</h1></div>
    <div className='right-component-top'> 
      <div className="flex-container">
        <div style={{ flex: '1', paddingRight: '20px' ,paddingTop:"20px"}}>
            <h3>Standard</h3>
        </div>
        <div className="unit-section">
            <div className="flex-column">
                {schoolClass.length+kinderClass.length > 0 ? (
                <select className="input-box" 
                value={selectedStandard}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSelectedStandard(newValue);
                  const filtered = unitData.filter(item => item.standard === newValue);
                  setFilteredData(filtered);
                  setFirstClicked(null)
                  setLastClicked(null)
                }}>
                <option value="" disabled>Select a Standard</option>
                {kinderClass.map((item, idx) => (
                <option key={idx} value={item}>
                {item}
                </option>
                ))}
                {schoolClass.map((item, idx) => (
                <option key={idx} value={item}>
                {toSuperscript(item)}
                </option>
                ))}
                </select>
                ) : (
                <p>No subjects available</p>
                )}
            </div>
        </div>
        
      </div>
      <div className="flex-containerDiff">
        <div >
            <h3>New Unit</h3>
        </div>
         <div>
            <input className='subject-inputForUnit' type='text' placeholder='add new unit'
            value={unitName}
            style={{marginLeft:'120px'}}
            onChange={e=>setUnitName(e.target.value)}></input>
            </div>
            <div>
            <button className="my-buttonInAdd" onClick={handleAddUnit} >
            Add New Unit
            </button>
            </div>
            </div>
        </div>

        <div className='insideHomeRight'>
                <div className='insideHomeRightLefts'>
                  <div style={{ flex: '1', paddingRight: '20px' ,paddingTop:"20px",paddingLeft:"10px"}}>
                    <h3>Lesson</h3><br></br>
                  </div>
                  <div>
                  {filteredData && renderUnitTree(filteredData)}
                  </div>
                </div>
                <div className='insideHomeRightRights'>
                  {firstClicked&&lastClicked&&firstClicked!==lastClicked&&<h1>{knowUnit}<span> -- </span>{knowSubUnit}</h1>}
                  {firstClicked&&lastClicked&&firstClicked===lastClicked&&<h1>{knowSubUnit}</h1>}
                  <div>
                    <input className='subject-input' type='text' placeholder='Type here'
                    value={inputValue}
                    onChange={e=>setInputValue(e.target.value)}></input>
                  </div>
                  <button className="my-buttonInAdd" style={{marginLeft:'20px'}} onClick={handleCancel}>
                    Cancel
                  </button>
                  <div style={{ flex: '1', paddingRight: '20px' ,paddingTop:"20px"}}>
                    <h3>Explanation</h3><br></br>
                  </div>
                  <div>
                    <textarea
                    placeholder="Section Description"
                    value={explanationForUnit}
                    onChange={e => setExplanationForUnit(e.target.value)}
                    className="textarea-description"
                    />
                  </div>
                   <div>
      <button className='my-buttonInUnit' onClick={() => setIsDrawerOpen(true)}>Record Audio</button>
      
      <Drawer   isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false) }  onConfirm={(file) =>{
    // User clicked OK in recorder
    setAudioFile(file); // recorded file
    setInputFile(null); // clear browsed file
  }} >
        <AudioRecorder />
      </Drawer>

     
    </div>
                  <div className='insideInsideContainer'>
                    <div style={{ flex: '1', paddingRight: '20px' ,paddingTop:"20px"}}>
                    <h3>Voice</h3>
                    </div>
                    {!audioFile && !inputFile && (
  <label className="custom-file-upload">
    <input
      className='subject-input'
      type='file'
      accept='audio/*'
      placeholder='Browse'
      onChange={e => {
        const file = e.target.files[0];
        if (file) {
          setInputFile(file);      // store browsed file
          setAudioFile(null);      // clear recorded file
        }
      }}
    />
    <p>Browse</p>
  </label>
)}


                     
                     {(audioFile || inputFile) && (
  <div style={{ marginTop: '10px', padding: '15px' }}>
    <p><strong>Selected File:</strong> {(audioFile && "Recorded Audio") || inputFile.name}</p>
    <audio
      controls
      src={URL.createObjectURL(audioFile || inputFile)}
    />
    <button
    className='my-buttonInUnit'
      style={{ marginTop: '10px' }}
      onClick={() => {
        setAudioFile(null);
        setInputFile(null);
      }}
    >
      ❌ Remove
    </button>
  </div>
)}

                  </div>
                  <div className='insideInsideContainer'>
                    <div style={{ flex: '1', paddingRight: '20px' ,paddingTop:"20px"}}>
                    <h3>Animation</h3>
                    </div>
                    <label className="custom-file-upload">
                    <input className='subject-input' type='file' accept='video/*' placeholder='Browse'
                    onChange={e => setVideoFile(e.target.files[0])}></input>
                    <p>Browse</p>
                    </label>
                  </div>
                  {/* <button onClick={handleSubmit} className="submit-button" disabled={isSubmitting}>
                   {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button> */}
                  <div className='insideHomeRightRightButtons'>
                    <button className='my-buttonInUnit' onClick={handleAddNewSubunit} >
                     Add New
                    </button>
                    <button className='my-buttonInUnit' onClick={handleUpdateUnit} >
                     Update
                    </button>
                    <button className='my-buttonInUnit' onClick={handleDeleteUnit} >
                     Delete
                    </button>
                  </div>
                </div>
        </div>            
    </div>
  );
};

export default HomeRight;
