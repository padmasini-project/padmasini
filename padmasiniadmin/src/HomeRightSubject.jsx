import React, { useState,useEffect } from 'react';
import './HomeRightSubject.css'; // Or wherever your CSS is

const HomeRightSubject = ({ receivedData,onSubjectArray }) => {
    const[comboSelectedSubject,setComboSelectedSubject]=useState('');
    const[newSubject,setNewSubject]=useState('');
    const [subjectArray, setSubjectArray] = useState([]);
    useEffect(() => {
        setSubjectArray(receivedData);
        // if (Array.isArray(receivedData)) {
        //     const uniqueSubjects = [...new Set(receivedData?.map(item => item.unit).filter(Boolean))];
        //     setSubjectArray(uniqueSubjects);
        //     onSubjectArray(uniqueSubjects); // Update parent component
        // }
    }, [receivedData, onSubjectArray]);
   

    const fetchAllSubjects = () => {
        const start = performance.now();
        fetch('https://padmasiniadmin-1.onrender.com/getAllSubjects')
          .then(res => res.json())
          .then(jsonData => {
            const end = performance.now();
            console.log(`API call took: ${end - start} ms`);
           // onDataUpdate(jsonData); // update parent
            const uniqueSubjects = [...new Set(jsonData?.map(item => item.unit || item.name).filter(Boolean))];
            //setSubjectArray(uniqueSubjects); // update local list
            console.log("second fetch inside fetch",uniqueSubjects)
            onSubjectArray(uniqueSubjects)
          })
          .catch(err => {
            console.error('Fetch all error:', err);
          });
      };


    const fetchfunction=(type,subject,selectOptionSubject)=>{
        //const startTime = performance.now();
        let url = '';
        let method = '';
        let body = null;
        if (type === 'addNew') {
            url = 'https://padmasiniadmin-1.onrender.com/addSubject';
            method = 'POST';
            body = JSON.stringify({ name: subject });
        } else if (type === 'update') {
            url = `https://padmasiniadmin-1.onrender.com/updateSubject/${selectOptionSubject}`;
            method = 'PUT';
            body = JSON.stringify({ name: subject });
        } else if (type === 'delete') {
            url = `https://padmasiniadmin-1.onrender.com/deleteSubject/${selectOptionSubject}`;
            method = 'DELETE';
        }
        const start = performance.now();
        fetch(url,{
          
            method: method,
            headers: {'Content-Type':'application/json'},
            ...(body && { body: body })
        })
        .then(response=> response.text())
        .then(()=>{
            const end = performance.now();
            console.log(`API call took: ${end - start} ms`);
            // if(data.type==="success"){
            //     fetch('http://localhost:8080/padmasiniAdmin/SubjectClassServlet')
            // .then(res => res.json())
            // .then(() => {
                fetchAllSubjects();
            //   onDataUpdate(jsonData);
            //   console.log("in this shit",jsonData.subjects)
            //   if (Array.isArray(receivedData)) {
            //     const uniqueSubjects = [...new Set(jsonData.subjects?.map(item => item.unit).filter(Boolean))];
            //     setSubjectArray(uniqueSubjects);
            //     console.log(uniqueSubjects)
            // }
            // })
            // .catch(err => {
            //   console.error('Fetch error:', err);
            // });
            //}
            // const endTime = performance.now();
            // console.log(`⏱️ Fetch took ${Math.round(endTime - startTime)} ms`);
        }

        )
        .catch(err=>{
            console.log('error messge ',err)
        })
    }
    
    const handleAddNew = () => {
        try{
            if(newSubject!==''&&newSubject.trim()!==''){
                if (subjectArray.includes(newSubject.trim())) {
                    throw new Error("Subject already exists.");
                }
                console.log('Adding new subject:', newSubject);
                fetchfunction("addNew",newSubject,comboSelectedSubject)
                handleCancel()
            }
            else{
                    throw new Error("Subject name cannot be empty");
            }
        }
        catch(error){
            alert(error.message)
        }
       
      };
    
      const handleUpdate = () => {
        try{
            if(newSubject&&newSubject.trim()!==''&&comboSelectedSubject&&comboSelectedSubject.trim()!==''){
                if (subjectArray.includes(newSubject.trim())) {
                    throw new Error("Subject already exists.");
                }
                console.log('Adding new subject:', newSubject);
                console.log("slected subject ",comboSelectedSubject)
                fetchfunction("update",newSubject,comboSelectedSubject)
                handleCancel()
            }
            else if(!comboSelectedSubject&&comboSelectedSubject.trim()==='')throw new Error('please select a subject')
            else if(!newSubject&&newSubject.trim()==='')throw new Error("subject name cannot be empty")
        }
        catch(error){
            alert(error.message)
        }
      };
    
      const handleDelete = () => {
        try{
            if(comboSelectedSubject!==''&&comboSelectedSubject.trim()!==''){
                const confirmAction=window.confirm("All the data in that field will be delete")
                if(confirmAction){
                console.log('deleting a subject:', comboSelectedSubject);
                fetchfunction("delete",newSubject,comboSelectedSubject)
                handleCancel()
                }
            }
            else{
                    throw new Error("please select a subject");
            }
        }
        catch(error){
            alert(error.message)
        }
      };

      const handleCancel = () => {
        // Reset both fields
        setComboSelectedSubject('');
        setNewSubject('');
      };
  return (
<div className="right-component">
    <div className="flex-container">
        <div style={{ flex: '1', paddingRight: '20px' ,paddingTop:"20px"}}>
            <h3>Subjects</h3>
        </div>
        <div className="unit-section">
            <div className="flex-column">
                {subjectArray&&subjectArray.length > 0 ? (
                <select className="input-box" 
                value={comboSelectedSubject}
                onChange={(e) => {
                  setComboSelectedSubject(e.target.value);
                }}>
                <option value="" disabled>Select a subject</option>
                {subjectArray.map((item, idx) => (
                <option key={idx} value={item}>
                {item}
                </option>
                ))}
                </select>
                ) : (
                <p>No subjects available</p>
                )}
            </div>
        </div>
    </div>
    <div>
        <input className='subject-input' type='text' placeholder='Subject Name'
        value={newSubject}
        onChange={e=>setNewSubject(e.target.value)}></input>
    </div>
    <div className='inner-button'>
        <button className='my-buttonIn ' onClick={handleAddNew}>
            Add New
        </button>
        <button className='my-buttonIn ' onClick={handleUpdate}>
            Update
        </button>
        <button className='my-buttonIn ' onClick={handleDelete}>
        Delete
        </button>
        <button className="my-buttonIn " onClick={handleCancel}>
          Cancel
        </button>
    </div>
</div>
  );
};

export default HomeRightSubject;
