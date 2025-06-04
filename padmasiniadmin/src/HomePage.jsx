import React, { useEffect, useState } from "react";
import "./HomePage.css";
import HomeLeft from './HomeLeft';
import HomeRight from './HomeRight';
import HomeRightSubject from './HomeRightSubject'

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const data = useState(null);        // fetched data from backend
  const [selectedData, setSelectedData] = useState(null); // data to show on right
  const [selectedSubject, setSelectedSubject] = useState(null);
  const[subjectArray,setSubjectArray]=useState(null);
  // Fetch data on component mount
  console.log("selected",selectedSubject)
  useEffect(() => {
   // const startTime = performance.now();
   const start = performance.now();
      fetch('https://padmasiniadmin-1.onrender.com/getAllSubjects')
        .then(res => res.json())
        .then(jsonData => {
          const end = performance.now();
          console.log(`API call took: ${end - start} ms`);
         // onDataUpdate(jsonData); // update parent
          const uniqueSubjects = [...new Set(jsonData?.map(item => item.unit || item.name).filter(Boolean))];
          //setSubjectArray(uniqueSubjects); // update local list
          console.log("first fetch inside homepage",uniqueSubjects)
          setSubjectArray(uniqueSubjects)
         /// const endTime = performance.now();
         // console.log(`⏱️ Fetch took ${Math.round(endTime - startTime)} ms`);
        })
        .catch(err => {
          console.error('Fetch all error:', err);
        });


    // fetch("http://localhost:8080/padmasiniAdmin/ServletClassSubjects")
    //   .then(response => {
    //     if (!response.ok) throw new Error("Network response was not ok");
    //     return response.json();
    //   })
    //   .then(jsonData => {
    //     console.log("should be same first fetch",jsonData)
    //     setData(jsonData); // Store complete response in state
    //   })
    //   .catch(error => console.error("Fetch error:", error));
  }, []);
  // const handleDataUpdate = (updatedData,subject) => {
  //   console.log("should be same after fetch in setdata in handleupdate",updatedData)
  //   setData(updatedData)
  //   console.log("success",subject)
  //   if(typeof subject==='string'){const setsub=updatedData[subject];
  //   setSelectedData(setsub);
  //   setSelectedSubject(subject)
  //   console.log("after submission"+data)}
  // };
  // const handleDataUpdateforSubject=(updatedData)=>{
  //   setData(updatedData)
  //   const subjectData=updatedData.subjects
  //   console.log(subjectData)
  //   if(Array.isArray(subjectData)){
  //     const subjectJson=[...new Set(subjectData?.map(item=>item.unit).filter(Boolean))]
  //     setSubjectArray(subjectJson)
  //     console.log(subjectJson)
  //   }
    
  // }
  
  return (
    <div className="container">
    <button 
    style={{color:'black'}}
        className="dis" 
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>
      
      <div className={menuOpen?"left":"noleft"}>
        <HomeLeft data={data} onSelect={setSelectedData} onSelectSubject={setSelectedSubject} subjectArray={subjectArray}/>
      </div>
      <div className="right">
       {(selectedSubject==="subjects"||!selectedSubject)&&<HomeRightSubject receivedData={subjectArray} onSubjectArray={setSubjectArray}/> /*onDataUpdate={handleDataUpdateforSubject}/>*/}
        {(selectedSubject!=="subjects"&&selectedSubject)&&<HomeRight receivedData={selectedData}  selectedSubject={selectedSubject} />}
       
      </div>
    </div>
  );
}

export default HomePage;
