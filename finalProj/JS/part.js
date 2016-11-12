function apiCall () {
	var response;	
	
	function getInfo() {
		var queryURL = "https://api.steampowered.com/";
		var apiKey = "&key=CD37400280DEB90934FA41672112C9A0";
		var steamID = "&steamid=76561198002826553";
		var queryString = queryURL + "IPlayerService/GetOwnedGames/v1/?" + "format=json" + apiKey + steamID + "&include_appinfo=1&include_played_free_games=1";
		var imgUrl = "http://media.steampowered.com/steamcommunity/public/images/apps/"

		var request = new XMLHttpRequest();
		request.open('GET', queryString, true);
		//request.setRequestHeader('Content-Type', 'application/json');
		request.addEventListener("load", function() {            
    		response = JSON.parse(request.responseText);
    		console.log(response);
    	});
    	request.send();
	}
	getInfo();
}

apiCall();