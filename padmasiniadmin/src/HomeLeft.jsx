import React, { useState } from 'react';
import "./HomePage.css";
const HomeLeft = ({  onSelect, onSelectSubject, subjectArray}) => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const handleClick = (subject) => {
    if(subject==="subjects"){
      onSelectSubject(subject);
      setSelectedSubject("subjects");
    }
     else {
      onSelect([]); // or display a message
    }
  };
  //console.log("in home left",selectedSubject)
  const handleClickForFetch = (subject) => {
    onSelectSubject(subject)
    setSelectedSubject(subject);
   // const start = performance.now();
   
  };
  


  return (
    <div >
       
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          
          onClick={()=>handleClick("subjects")}
           className={`my-button ${selectedSubject === "subjects" ? "selected" : ""}`}>
          {selectedSubject === "subjects" ? "You are in Subjects" : "Subjects"}
        </button>
        {Array.isArray(subjectArray)&&subjectArray.map((subject,index)=>
          <button
          key={index}
          onClick={() => handleClickForFetch(subject)}
          className={`my-button ${selectedSubject === subject ? "selected" : ""}`}>
          {selectedSubject === subject ? `You are in ${subject}` : subject}
        </button>
        )
        }
      </div>
    </div>
  );
};

export default HomeLeft;
