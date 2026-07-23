const token = localStorage.getItem("token") ;

if(!token) {
    window.location.href = "index.html" ;

}

const API_URL = "https://first-api-demo-spring-bot-2.onrender.com/patients";

function showMessage(message) {
    
   if(message !== "") {
        const box = document.getElementById("messageBox") ;
        box.textContent = message ;
        box.style.display = "block" ;
        setTimeout(()=>{
            box.style.display = "none" ;
        }, 2000) ;
   }

}

function showEditForm(patient) {
    const newName = document.createElement("input") ;
    newName.value = patient.name ;
    newName.classList.add("inputField") ;

    const newAge = document.createElement("input") ;
    newAge.value = patient.age ;
    newAge.classList.add("inputField") ;

    const saveBtn = document.createElement("button") ;
    saveBtn.textContent = "Save" ;
    saveBtn.classList.add("save-update-btn") ;
    saveBtn.onclick = ()=> {
        updatePatient(patient.id,newName.value,newAge.value) ;
    }

    const li = document.createElement("li") ;
    li.appendChild(newName) ;
    li.appendChild(newAge) ;
    li.appendChild(saveBtn) ;
    const list = document.getElementById("patientsList") ;
    list.innerHTML = "" ;
    list.appendChild(li) ;
}

function toggleRecords(patient,li) {
    const existingInput = li.querySelector(".input") ;
    if(existingInput) {
        existingInput.remove() ;
    }

    const existing = li.querySelector(".records") ;
    if(existing) {
        existing.remove() ;
        return ;
    }

    const recordsDiv = document.createElement("div") ;
    recordsDiv.className = "records" ;

    if(patient.records.length === 0 ) {
        recordsDiv.textContent = "No Records ." ;
    }
    else {
        recordsDiv.textContent = "All Records :" ;
        patient.records.forEach(r=>{
            const recordItem = document.createElement("div") ;
            recordItem.classList.add("record-row") ;

            const descSpan = document.createElement("span") ;
            descSpan.textContent = r.description ;

            const idSpan = document.createElement("span") ;
            idSpan.textContent = r.id ;

            const deleteBtn = document.createElement("button") ;
            deleteBtn.classList.add("delete-btn")
            deleteBtn.textContent = "Delete Record" ;
            deleteBtn.onclick = () => deleteRecord(r.id) ;

            recordItem.appendChild(descSpan) ;
            recordItem.appendChild(idSpan) ;

            recordItem.appendChild(deleteBtn) ;
            recordsDiv.appendChild(recordItem) ;
        })
    }
    li.appendChild(recordsDiv) ;

}

function showAddRecordForm(patientId,li) {
    const existingRecords = li.querySelector(".records") ;
    if(existingRecords) {
        existingRecords.remove() ;
    }
    const existing = li.querySelector(".input") ;
    if(existing) {
        return ;
    }
    const inputDiv = document.createElement("div") ;
    inputDiv.className = "input" ;

    const input = document.createElement("input") ;
    input.placeholder = "Enter description" ;
    input.classList.add("inputField") ;    

    const saveBtn = document.createElement("button") ;
    saveBtn.textContent = "Save" ;

    inputDiv.appendChild(input) ;
    inputDiv.appendChild(saveBtn) ;

    saveBtn.onclick = () => addRecord(patientId, input.value) ;
 
    li.appendChild(inputDiv) ;
}

// Post Request 
async function addPatient() {
    const name = document.getElementById("name").value ;
    const age = document.getElementById("age").value ;
    const patient = {
        name : name ,
        age : parseInt(age) ,
    } ;

    try {
        const response = await fetch(API_URL,{
            method : "POST",
            headers : {    
                "Content-Type" : "application/json" ,
                "Authorization" : "Bearer " + token
            },
            body : JSON.stringify(patient) ,
        }) ;

        if(!response.ok) {
            const errorText = await response.text() ;
            throw new Error(errorText) ;
        }

        showMessage("Patient Added !") ;
        loadPatients() ;

    }catch(error) {
        showMessage(error.message) ;

    }

}

// GET Request 
async function loadPatients() {

    const response = await fetch(API_URL,{
        method : "GET",
        headers : {    
            "Authorization" : "Bearer " + token
        }  
    }) ;

    if (!response.ok) {
        localStorage.removeItem("token") ;
        window.location.href = "index.html" ;
        return ;
    }

    const patients = await response.json() ;
    
    const list = document.getElementById("patientsList") ;
    list.innerHTML = "" ;

    patients.forEach(p => {
        const li = document.createElement("li") ;
        li.className = "patient-row" ;

        const deleteBtn = document.createElement("button") ;
        const updateBtn = document.createElement("button") ;
        const showRecordsBtn = document.createElement("button") ;
        const addRecordBtn = document.createElement("button") ;

        deleteBtn.classList.add("delete-btn") ;

        deleteBtn.textContent = "Delete" ;
        updateBtn.textContent = "Update" ;
        showRecordsBtn.textContent = "Show Records" ;
        addRecordBtn.textContent = "Add Record" ;

        const nameSpan = document.createElement("span") ;
        nameSpan.textContent = p.name ;

        const ageSpan = document.createElement("span") ;
        ageSpan.textContent = p.age+" yo" ;

        const idSpan = document.createElement("span") ;
        idSpan.textContent = p.id ;

        deleteBtn.onclick = () => deletePatient(p.id) ;
        updateBtn.onclick = () => showEditForm(p) ;
        showRecordsBtn.onclick = () => toggleRecords(p,li) ;
        addRecordBtn.onclick = () => showAddRecordForm(p.id,li) ;

        li.appendChild(nameSpan) ;
        li.appendChild(ageSpan) ;
        li.appendChild(idSpan) ;

        li.appendChild(deleteBtn) ;
        li.appendChild(updateBtn) ;
        li.appendChild(showRecordsBtn) ;
        li.appendChild(addRecordBtn) ;

        list.appendChild(li) ;
    });
}

async function deletePatient(id) {
    try {
        const response = await fetch(API_URL + "/" + id , {
            method : "DELETE" ,
            headers : {    
                "Authorization" : "Bearer " + token
            },
        }) ;

        if(!response.ok) {
            const errorText = await response.text() ;
            throw new Error(errorText) ;
        }

        showMessage("Patent Deleted !") ;
        loadPatients() ;

    }catch(error) {
        showMessage(error.message) ;

    } 

}

async function updatePatient(id,name,age) {

    const updatedPatient = {
        name : name ,
        age : parseInt(age) ,
        id : id ,
    } ;
    try {
        const response = await fetch(API_URL + "/" + id , {
            method : "PUT" ,
            headers : {
                "Content-Type" : "application/json" ,
                "Authorization" : "Bearer " + token
            },
            body : JSON.stringify(updatedPatient) ,
        }) ;
        
        if(!response.ok) {
            const errorText = await response.text() ;
            throw new Error(errorText) ;
        }
        showMessage("Patient Updated !") ;
        loadPatients() ;

    }catch(error) {
        showMessage(error.message) ;

    }

}

async function addRecord(patientId, description) {
    const record = {
        description : description ,
    } ;
     
    try {
        const response = await fetch("https://first-api-demo-spring-bot-2.onrender.com/records/patient/"+patientId,{
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + token
            },
            body : JSON.stringify(record),

        }) ;

        if(!response.ok) {
            const errorText = await response.text() ;
            throw new Error(errorText) ;
        }
        showMessage("Record Added") ;
        loadPatients() ;

    }catch(error) {
        showMessage(error.message) ;

    }

}

async function deleteRecord(recordId) {

    try {
        const response = await fetch("https://first-api-demo-spring-bot-2.onrender.com/records/"+recordId,{
            method : "DELETE" ,
            headers : {    
                "Authorization" : "Bearer " + token
            },
        }) ;
        if(!response.ok) {
            const errorText = await response.text() ;
            throw new Error(errorText) ;
        }
        showMessage("Record Deleted") ;
        loadPatients() ;
    
    }catch(error) {
        showMessage(error.message) ;

    }

}

loadPatients() ;