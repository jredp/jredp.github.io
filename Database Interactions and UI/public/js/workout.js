/*-------------------------------------------*/
// Author: Jared Parkinson
// Mail: parkinja @ oregonstate . edu
// CS290 - Final Project
// MySQL Database Exercise Tracker
/*-------------------------------------------*/

/*-------------------------------------------*/
//   DOM on load listener assignments
/*-------------------------------------------*/

document.addEventListener("DOMContentLoaded", assignListenButtons);

function assignListenButtons() {
    document.getElementById('addMe').addEventListener('click', addMe);        
    
    var delList = document.getElementsByName("delete");
    for(var i=0; i<delList.length; i++) {                
    //return false to fix FIREFOX issues, else should use event.preventDefault();
        delList[i].setAttribute("onclick", "deleteMe(this); return false;");         
    }        
}

/*-------------------------------------------*/
//             Messages
/*-------------------------------------------*/

function setMsgTimer() {
    document.getElementById("messageP").style.color = "#4542f4";
    setTimeout ( "setMsgClear()", 5000 );
}

function setMsgClear(msgP) {
    document.getElementById("messageP").style.color = "#ffffff";
}

/*-------------------------------------------*/
//   Add the JSON object, response is JSON
/*-------------------------------------------*/

//Collect the form data clientside
function addMe(event){      
    var payload = {};       
    payload.name = document.getElementById('name').value;
    payload.reps = document.getElementById('reps').value;
    payload.weight = document.getElementById('weight').value;
    payload.date = document.getElementById('date').value;
    payload.lbs = 0;
    if(document.getElementById('lbs').checked) {payload.lbs=1};    
    if ((payload.name=='')||(payload.reps=='')||(payload.weight=='')||(payload.date=='')) {
        alert("You must enter all values!");                
    } else {                                
        //Reset Fields
        document.getElementById('name').value = '';
        document.getElementById('reps').value = '';
        document.getElementById('weight').value = '';
        document.getElementById('date').value = '';
        //Start Submission
        doAddRequest(payload);
    }            
    event.preventDefault();    
}

//Send JSON to server, return JSON string of Last Added Object for DOM
function doAddRequest(payload) { 
    console.log("Here is your send JSON string: " + JSON.stringify(payload)); 
    var request = new XMLHttpRequest();        
    request.open('POST', '/insert', true); //asynch wait     
    request.setRequestHeader('Content-Type', 'application/json');
    request.addEventListener('load', function() {                       
        if (request.status >= 200 && request.status < 400) {            
            var response = request.responseText;                                   
            if(response) { //If Response is not empty
                console.log("Here is your Processed responseText, should be Payload + ID");                
                console.log(response);
                var resJSON = JSON.parse(response);
                addToExistTable(resJSON);                             
            } else { console.log("No Callback") }
        }
        else { console.log("error" + request.statusText); }       
    });        
    request.send(JSON.stringify(payload));    
}

/*----------------------------------*/
// DOM - ADD row at bottom of table
/*----------------------------------*/

function addToExistTable(jsonObj) {
    var theTable = document.getElementById('dataTable');   
    var newRow = document.createElement('tr');
    newRow.setAttribute('id', (jsonObj.id)); //id from JSON
    //Create 7 tds in the newRow
    for(var j=1; j<8; j++) {
        var td = document.createElement('td'); //1 column of table data                       
        td.setAttribute('id', ("col"+ j)); //Col id
        //First cell shading
        if (j === 1) {
            td.setAttribute("class", "cell-id");
            td.appendChild(document.createTextNode(jsonObj.name)); //col#
        }        
        if (j === 2) { td.appendChild(document.createTextNode(jsonObj.reps)); }
        if (j === 3) { td.appendChild(document.createTextNode(jsonObj.weight)); }
        if (j === 4) { td.appendChild(document.createTextNode(jsonObj.date)); }
        if (j === 5) { 
            var unit = "kg";
            if(jsonObj.lbs == true) { unit = "lbs"; }
            td.appendChild(document.createTextNode(unit));
        }
        if (j===6) { //EDIT BUTTON FORM            
            var newForm = document.createElement('form');
            newForm.setAttribute("method", "GET");
            newForm.setAttribute("action", "/edit");
            var newInp1 = document.createElement('input');
            newInp1.setAttribute("type", "hidden"); newInp1.setAttribute("name", "id"); newInp1.setAttribute("value", jsonObj.id);
            newForm.appendChild(newInp1);
            var newInp2 = document.createElement('input');                        
            newInp2.setAttribute("type", "submit"); newInp2.setAttribute("class", "button"); 
            newInp2.setAttribute("name", "edit"); newInp2.setAttribute("id", "editMe");
            newInp2.setAttribute("value", " Edit ");            
            newForm.appendChild(newInp2);
            td.appendChild(newForm);
        }
        if (j===7) { //DELETE BUTTON FORM
            var newFormD = document.createElement('form');
            newFormD.setAttribute("method", "POST");                        
            var newInpD = document.createElement('input');
            newInpD.setAttribute("type", "hidden"); newInpD.setAttribute("id", "delMe"); newInpD.setAttribute("value", jsonObj.id);
            newFormD.appendChild(newInpD);
            var newInpD1 = document.createElement('input');            
            newInpD1.setAttribute("type", "submit"); newInpD1.setAttribute("class", "button"); 
            newInpD1.setAttribute("name", "delete"); newInpD1.setAttribute("value", " Delete ");
            newInpD1.setAttribute("onclick", "deleteMe(this)");
            newFormD.appendChild(newInpD1);
            td.appendChild(newFormD);            
        }
        newRow.appendChild(td);
    }
    theTable.appendChild(newRow);    
    document.getElementById("messageP").innerText = jsonObj.message;
    setMsgTimer();
}

/*---------------------------------------------------*/
// Delete the table row, response after submit is JSON
/*---------------------------------------------------*/

function deleteMe(node){
    var payload = {};    
    payload.node = node.parentNode.parentNode.parentNode;
    payload.id = payload.node.id;    
    var table = document.getElementById('dataTable');                    
    var rowCount = table.rows.length;
    if (payload.id=='') {
        alert("The id is missing for some reason");
    }     
    else if (rowCount <= 1) {
        alert("Cannot delete all the rows.");        
    }                   
    else {                                
        doDelRequest(payload);
    }                             
    event.preventDefault();    
}      

function doDelRequest(payload) {
    console.log("Here is your send JSON string: " + JSON.stringify(payload));
    var request = new XMLHttpRequest();        
    request.open('POST', '/delete', true); //asynch wait
    request.setRequestHeader('Content-Type', 'application/json');
    request.addEventListener('load', function() {                       
        if (request.status >= 200 && request.status < 400) {            
            var response = request.responseText;
            if(response) {
                console.log("I got an answer");                
                console.log(response);    
                var resJSON = JSON.parse(response);
                resJSON.node = payload.node;                
                delFromTable(resJSON);
            } else { console.log("No Callback") }
        }
        else { console.log("error" + request.statusText); }
    });        
    request.send(JSON.stringify(payload));    
}

/*--------------------------------*/
// DOM - DELETE selected row
/*--------------------------------*/

function delFromTable(jsonObj) {                
    var table = document.getElementById('dataTable');
    var rowCount = table.rows.length;
    var currentRow = jsonObj.node;        
    currentRow.parentNode.removeChild(currentRow);
    console.log("I deleted id: " + jsonObj.id);
    document.getElementById("messageP").innerText = jsonObj.message;
    setMsgTimer();
};