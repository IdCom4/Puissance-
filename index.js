document.addEventListener("DOMContentLoaded", function() {
	var tour;
	var over;
	var Cases;
	var Info;

	var grid;
	var gridTest;

	function init() {
		Cases = document.getElementsByClassName("case");
		Info = document.getElementById("info");
		Bouton = document.getElementById("new");
		for(var i = 0; i < 6*7; i++){
			Cases[i].addEventListener("click", function(){controller(this);});
		}
		Bouton.addEventListener("click", function(){newGame();});
		newGame();
	}

	function newGame() {
		//console.log("dans newGame");
		tour = 1;
		over = false;
		grid = new Array();
		gridTest = new Array();
		for(var i = 0; i < 6; i++) {
			grid[i] = new Array();
			gridTest[i] = new Array();
			for(var y = 0; y < 7; y++) {
				grid[i][y] = 0;
				gridTest[i][y] = 0;
			}
		}
		for(var i = 0; i < 6*7; i++){
			Cases[i].innerHTML = "";
		}
		Info.innerText = "C'est au joueur 1 !";
	}

	function columnIsFull(id) {
		//console.log("dans columnIsFull");
		var columnId = id[2] - 1;
		for(var i = 0; i < 6; i++) {
			//console.log("grid["+i+"]["+columnId+"] = "+grid[i][columnId]);
			if(grid[i][columnId] == 0){
				return(false);
			}
		}
		return(true);
	}

	function firstEmptyCase(id) {
		//console.log("dans firstEmptyCase");
		var columnId = id[2] - 1;
		for(var i = 5; i >= 0; i--) {
			if(grid[i][columnId] == 0)
				return(i);
		}
		return(-1);
	}

	function putToken(line, column) {
		//console.log("dans putToken");
		grid[line][column] = (tour == 1)?1:2;
	}

	function updateHTML() {
		//console.log("dans updateHTML");
		for(var i = 0; i < 6; i++) {
			for(var y = 0; y < 7; y++) {
				//console.log("("+i+"*7)+"+y+" = "+((i*7)+y));
				Cases[(i*7)+y].innerHTML = (grid[i][y] == 1)?"<div class=\"token token1\"></div>":(grid[i][y] == 2)?"<div class=\"token token2\"></div>":"";
			}
		}
	}

	function isOver(){
		//console.log("dans isOver");
		if(testLines() == 1 || testColumns() == 1 || testDiagonals() == 1)
			return(1);
		if(isFull() == true)
			return(2);
		return(0);
	}

	function isFull() {
		//console.log("dans isFull");
		for(var i = 0; i < 6; i++) {
			for(var y = 0; y < 7; y++) {
				if(grid[i][y] == 0)
					return(false);
			}
		}
		return(true);
	}

	function testLines() {
		//console.log("dans testLines");
		var token;
		var lastTokenType;
		for(var i = 0; i < 6; i++) {
			token = 0;
			lastTokenType = grid[i][0];
			for(var y = 0; y < 7; y++) {
				console.log("grid["+i+"]["+y+"] = "+grid[i][y]+" et lastTokenType = "+lastTokenType);
				if(grid[i][y] != 0 && grid[i][y] == lastTokenType) {
					console.log("	so token++, donc token = "+(token+1));
					token++;
				}
				else if(grid[i][y] != 0) {
					console.log("	token = 1");
					token = 1;
				}
				else
					token = 0;
				lastTokenType = grid[i][y];
				console.log("token = "+token);
				if(token >= 4)
					return(1);
			}
		}
		return(0);
	}

	function testColumns() {
		//console.log("dans testColumns");
		var token;
		var lastTokenType = 0;
		for(var i = 0; i < 7; i++) {
			token = 0;
			lastTokenType = grid[0][i];
			for(var y = 0; y < 6; y++) {
				//console.log("grid["+y+"]["+i+"] = "+grid[y][i]+" et lastTokenType = "+lastTokenType);
				if(grid[y][i] != 0 && grid[y][i] == lastTokenType){
					token++;
				}
				else if(grid[y][i] != 0)
					token = 1;
				else
					token = 0;
				lastTokenType = grid[y][i];
				if(token >= 4)
					return(1);
			}
		}
		return(0);
	}

	function testDiagonals() {
		//console.log("dans testDiagonals");
		var token;
		var lastTokenType;
		var y = 0;
		var i = 0;
		var iBis;
		var yBis;
		//console.log("////// DIAGONALES - + //////");
		for(var n = 0; n < 6+(7-1); n++) {
			if(y >= 7){
				y = 6;
				i++;
			}
			yBis = y;
			iBis = i;
			// console.log("yBis = "+yBis+" et iBis = "+iBis);
			// console.log("grid["+iBis+"]["+yBis+"] = "+grid[iBis][yBis]);
			token = 0;
			lastTokenType = grid[iBis][yBis];
			// console.log("");
			// console.log("nouvelle diagonale :");
			while(yBis >= 0 && iBis < 6) {
				//console.log("	grid["+iBis+"]["+yBis+"] = "+grid[iBis][yBis]+" et lastTokenType = "+lastTokenType);
				if(grid[iBis][yBis] != 0 && grid[iBis][yBis] == lastTokenType){
					//console.log("		so token++, donc token = "+(token+1));
					token++;
				}
				else if(grid[iBis][yBis] != 0) {
					//console.log("		token = 1");
					token = 1;
				}
				else
					token = 0;
				lastTokenType = grid[iBis][yBis];
				yBis--;
				iBis++;
				//console.log("token = "+token);
				if(token >= 4)
					return(1);
			}
			y++;
		}
		i = 5;
		y = 0;
		// console.log("");
		// console.log("////// DIAGONALES + + //////");
		for(var n = 0; n < 6+(7-1); n++) {
			if(i < 0){
				i = 0;
				y++;
			}
			yBis = y;
			iBis = i;
			// console.log("yBis = "+yBis+" et iBis = "+iBis);
			// console.log("grid["+iBis+"]["+yBis+"] = "+grid[iBis][yBis]);
			token = 0;
			lastTokenType = grid[iBis][yBis];
			// console.log("");
			// console.log("nouvelle diagonale :");
			while(yBis < 7 && iBis < 6) {
				//console.log("	grid["+iBis+"]["+yBis+"] = "+grid[iBis][yBis]);
				if(grid[iBis][yBis] != 0 &&grid[iBis][yBis] == lastTokenType){
					token++;
				}
				else if(grid[iBis][yBis] != 0)
					token = 1;
				else
					token = 0;
				lastTokenType = grid[iBis][yBis];
				yBis++;
				iBis++;
				if(token >= 4)
					return(1);
			}
			i--;
		}
		return(0);
	}

	function controller(monThis) {
		if(over == false) {
			var id = monThis.id;
			if(columnIsFull(id) == true){
				console.log("true");
				return(0);
			}
			putToken(firstEmptyCase(id), id[2] - 1);
			updateHTML();
			over = isOver();
			if(over == 1) {
				over = true;
				Info.innerText = "Le joueur "+tour+" à gagné !";
			}
			else if(over == 2) {
				over = true;
				Info.innerText = "Egalité !";
			}
			else {
				over = false;
				tour = (tour == 1)?2:1;
				Info.innerText = "C'est au joueur "+tour+" !";
			}
		}
	}

	init();
});
