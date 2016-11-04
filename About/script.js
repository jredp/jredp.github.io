var tableModule = (function () {	
	var tLocation = {col:1, row:1};  
	document.title = "DOM and Events";
  	
	function tableCreate() {
		var myTable = document.createElement('table');	
		myTable.setAttribute('border', '1');
  	myTable.style.width = '100%';	
		var tHead = document.createElement('thead');
		myTable.appendChild(tHead);

		for(var i=1; i<5; i++) { 
			var th = document.createElement('th');
    		th.appendChild(document.createTextNode("Header " + i));
    		tHead.appendChild(th);
		}

		for(var i=1; i<4; i++) {
			var tr = document.createElement('tr');		
			myTable.appendChild(tr);
  			for(var j=1; j<5; j++) {
  				var td = document.createElement('td');
  				td.style.textAlign = "center"
  				td.style.border = "1px solid black";
  				td.appendChild(document.createTextNode(j + ', ' + i));
  				td.setAttribute('id', (j + ', ' + i));          
          if (j === 1 && i === 1) td.style.border = "2px solid red";
    			tr.appendChild(td);
  			}		
		}
		document.body.appendChild(myTable);
	}
  
  	function assignButton() {  		
    	moveInCell(this.innerText);
  	}

	function buttonsCreate() {
		var body = document.body;
		var buttonNames =  ["UP", "DOWN", "LEFT", "RIGHT", "Mark Cell"];  
		for(var i=0; i < buttonNames.length; i++) {
			var button = document.createElement('button');
			button.appendChild(document.createTextNode(buttonNames[i]));
    	body.appendChild(button);            
			button.addEventListener("click", assignButton);
		}
	}

	function markCell() {  	
		var currentCell = document.getElementById(tLocation.col + ", " + tLocation.row);
		currentCell.style.backgroundColor = "yellow";
	}

	function moveInCell(dir) {  	    
		var currentCell = document.getElementById(tLocation.col + ", " + tLocation.row);    
		currentCell.style.border = "1px solid black";
	
    	switch (dir) {
			case "UP":
				if (tLocation.row !== 1) tLocation.row--;
				break;			
			case "DOWN":
				if (tLocation.row !== 3) tLocation.row++;
				break; 		
			case "LEFT":
				if (tLocation.col !== 1) tLocation.col--;
        		break; 		
			case "RIGHT":
				if (tLocation.col !== 4) tLocation.col++;
				break; 		
			case "Mark Cell":
				markCell();		
		}
      currentCell = document.getElementById(tLocation.col + ", " + tLocation.row);
      currentCell.style.border = "2px solid red";
	}
  
	tableCreate();
	buttonsCreate();
})();