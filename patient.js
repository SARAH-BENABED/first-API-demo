const API_URL = "http://localhost:8080/patients";

function showMessage(message) {
   const box = document.getElementById("messageBox") ;
   box.textContent = message ;
   box.style.display = "block" ;
   setTimeout(()=>{
      box.style.display = "none" ;
   }, 2000) ;

}

function showEditForm(patient) {
    const newName = document.createElement("input") ;
    newName.value = patient.name ;

    const newAge = document.createElement("input") ;
    newAge.value = patient.age ;

    const saveBtn = document.createElement("button") ;
    saveBtn.textContent = "Save" ;

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
            recordItem.textContent = r.description + " - " + r.id ;

            const deleteBtn = document.createElement("button") ;
            deleteBtn.textContent = "Delete Record" ;
            deleteBtn.onclick = () => deleteRecord(r.id) ;

            recordItem.appendChild(deleteBtn) ;
            recordsDiv.appendChild(recordItem) ;
        })
    }
    li.appendChild(recordsDiv) ;

}

function showAddRecordForm(patientId,li) {
    const existing = li.querySelector(".input") ;
    if(existing) {
        return ;
    }
    const inputDiv = document.createElement("div") ;
    inputDiv.className = "input" ;

    const input = document.createElement("input") ;
    input.placeholder = "Enter description" ;

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
    await fetch(API_URL,{
        method : "POST",
        headers : {
            "Content-Type" : "application/json" ,
        },
        body : JSON.stringify(patient) ,
    }) ;
    showMessage("Patient Added !")
    loadPatients() ;
}

// GET Request 
async function loadPatients() {
    const response = await fetch(API_URL) ; 
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
        ageSpan.textContent = p.age ;

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
    await fetch(API_URL + "/" + id , {
        method : "DELETE" ,
    }) ;
    showMessage("Patent Deleted !") ;
    loadPatients() ;

}

async function updatePatient(id,name,age) {

    const updatedPatient = {
        name : name ,
        age : parseInt(age) ,
        id : id ,
    } ;
    await fetch(API_URL + "/" + id , {
        method : "PUT" ,
        headers : {
            "Content-Type" : "application/json" ,
        },
        body : JSON.stringify(updatedPatient) ,
    }) ;

    showMessage("Patient Updated !") ;
    loadPatients() ;
}

async function addRecord(patientId, description) {
    const record = {
        description : description ,
    } ;

    await fetch("http://localhost:8080/records/patient/"+patientId,{
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(record),

    }) ;

    showMessage("Record Added") ;
    loadPatients() ;
}

async function deleteRecord(recordId) {
    await fetch("http://localhost:8080/records/"+recordId,{
        method : "DELETE" ,
    }) ;
    showMessage("Record Deleted") ;
    loadPatients() ;
}