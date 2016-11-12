function apiCall () {
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
            var response = JSON.parse(request.responseText);
            console.log(response);        
            for (var p in response.response.games) {
            //General
            var gameName = response.response.games[p].name;
            var gameAppId = response.response.games[p].appid;  
            var gameStoreLink = "http://store.steampowered.com/app/" + gameAppId + "/";

            //Game Time
            var gameTime = response.response.games[p].playtime_forever;
            var gameTmin = gameTime/60;

            //Icons Logos
            var gameIconUrl = response.response.games[p].img_icon_url;
            var gameIconDisp = imgUrl + gameAppId + "/" + gameIconUrl + ".jpg"; //Smaller
            var gameLogoUrl = response.response.games[p].img_logo_url;
            var gameLogoDisp = imgUrl + gameAppId + "/" + gameLogoUrl + ".jpg"; //Bigger

            var newLogo = document.createElement('img');
            var newIcon = document.createElement('img');
            var newStoreLink = document.createElement('a');
            var newDiv = document.createElement('div');
            var newP = document.createElement('p');
        
            newDiv.classList.add("game");
            newLogo.src = gameLogoDisp;
            newIcon.src = gameIconDisp;
            newStoreLink.href = gameStoreLink;
            newStoreLink.appendChild(newLogo);
            newStoreLink.target = "_blank"; //New Tab or Window
            newP.textContent = gameName;
            newDiv.appendChild(newP);
            newDiv.appendChild(newStoreLink);
            document.body.appendChild(newDiv);
            }   
        });
        request.send();
    }
    getInfo();
}
apiCall();