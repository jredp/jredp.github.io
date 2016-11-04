document.addEventListener('DOMContentLoaded', assignButtons);

function cityOrZip() {
	var cityLook = document.getElementById('cityLook');				
	var zipLook = document.getElementById('zipLook');	
	var urlAns;
	if (cityLook.value == '' && zipLook.value == '') {
		alert("Please enter a City or Zip.");		
	}
	else if (cityLook && cityLook.value) { 
		urlAns = 'q=' + cityLook.value + ',us';
		return urlAns;
	} 
	else if (zipLook && zipLook.value) {
		urlAns = 'zip=' + zipLook.value + ',us';
		return urlAns;
	}	
}

function assignButtons() {	
	document.getElementById('reqSubmit').addEventListener('click', function(event){		
		var req = new XMLHttpRequest();						
		var url = "http://api.openweathermap.org/data/2.5/weather?";	
		var apiKey = '&appid=4847a4112a0699897d0f56df3dc42093';					
		var urlChunk = cityOrZip();
		var urlFull = url + urlChunk  + apiKey + '&units=imperial';		
		req.open('GET', urlFull, true); //false is synchronous, true is asynch
		req.addEventListener('load', function() {			
			if(req.status >= 200 && req.status < 400){
        		var response = JSON.parse(req.responseText);
				setWeatherResponse(response);							        		
      		} 
      		else {
        		console.log("Error in network request: " + request.statusText);
      		}
      	});		
		req.send();				
		event.preventDefault();		
	});

	document.getElementById('postItSubmit').addEventListener('click', function(event){
    	var req = new XMLHttpRequest();
    	var urlPost = "http://httpbin.org/post";
		var payload = { 'yourname': null, 'age': null, 'weight': null };		
    	payload.yourname = document.getElementById('postItname').value;
    	payload.age = document.getElementById('postItage').value;
    	payload.weight = document.getElementById('postItweight').value;    	
    	req.open('POST', urlPost, true);
    	req.setRequestHeader('Content-Type', 'application/json');
    	req.addEventListener('load', function() {
      		if(req.status >= 200 && req.status < 400){
      			var response = JSON.parse(JSON.parse(req.responseText).data);        		
        		setPostResponse(response);
      		}
      		else {
        		console.log("Error in network request: " + request.statusText);
      		}
      	});
    	req.send(JSON.stringify(payload));
    	event.preventDefault();
  	});
}

function setWeatherResponse(response) {
	document.getElementById('res-name').textContent = response.name;
	document.getElementById('res-temp').textContent = response.main.temp;
	document.getElementById('res-press').textContent = response.main.pressure;
}

function setPostResponse(response) {
	document.getElementById('res-yourname').textContent = response.yourname;
    document.getElementById('res-age').textContent = response.age;
    document.getElementById('res-weight').textContent = response.weight;
}