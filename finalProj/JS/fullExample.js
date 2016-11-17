function apiCall() {
  function getInfo() {
    var queryURL = "https://api.steampowered.com/";
    var apiKey = "&key=CD37400280DEB90934FA41672112C9A0";
    var steamID = "&steamid=76561198002826553";
    var queryString = queryURL + "IPlayerService/GetOwnedGames/v1/?" + "format=json" + apiKey + steamID + "&include_appinfo=1&include_played_free_games=1";
    var imgUrl = "http://media.steampowered.com/steamcommunity/public/images/apps/"
    var request = new XMLHttpRequest();
    request.open('GET', queryString, true);
    request.addEventListener("load", function() {
      var response = JSON.parse(request.responseText);
      console.log(response);
      for (var p in response.response.games) {
        //General
        var gameName = response.response.games[p].name;
        var gameAppId = response.response.games[p].appid;
        var gameStoreLink = "http://store.steampowered.com/app/" + gameAppId + "/";
        var gameTime = response.response.games[p].playtime_forever;
        //Icons Logos
        var gameIconUrl = response.response.games[p].img_icon_url;
        var gameIconDisp = imgUrl + gameAppId + "/" + gameIconUrl + ".jpg"; //Smaller
        var gameLogoUrl = response.response.games[p].img_logo_url;
        var gameLogoDisp = imgUrl + gameAppId + "/" + gameLogoUrl + ".jpg"; //Bigger
        //DOM
        var newLogo = document.createElement('img');
        var newIcon = document.createElement('img');
        var newLogoLink = document.createElement('a');
        var newIconLink = document.createElement('a');
        var newDiv = document.createElement('div');
        var newPname = document.createElement('p');
        var newPtime = document.createElement('p');
        var newPicon = document.createElement('p');
        var newPlogoLink = document.createElement('p');
        var br = document.createElement('br');
        newDiv.classList.add("game");
        newLogo.src = gameLogoDisp;
        newIcon.src = gameIconDisp;
        newLogoLink.href = gameStoreLink;
        newLogoLink.appendChild(newLogo);
        newLogoLink.target = "_blank"; //New Tab or Window
        newIconLink.href = gameStoreLink;
        newIconLink.appendChild(newIcon);
        newIconLink.target = "_blank"; //New Tab or Window
        newPname.style = "font-weight: bold";
        newPname.textContent = "Game Name: " + gameName;
        newPtime.textContent = "Playtime in Mins: " + gameTime;
        newPicon.textContent = "Game Icon Store Link: ";
        newPlogoLink.textContent = "Logo Store Link: ";
        newDiv.appendChild(newPname);
        newDiv.appendChild(newPtime);
        newDiv.appendChild(newPicon);
        newDiv.appendChild(newIconLink);
        newDiv.appendChild(br);
        newDiv.appendChild(newPlogoLink);
        newDiv.appendChild(newLogoLink);
        document.body.appendChild(newDiv);
      }
    });
    request.send();
  }
  getInfo();
}
apiCall();
