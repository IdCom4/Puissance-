document.addEventListener("DOMContentLoaded", function() {
	var tour;
	var over;
	var Cases;
	var Info;
	var poss;

	var grid;
	var gridSave;

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
		tour = prompt("Voulez vous être le joueur 1 ou le joueur 2 ?");
		poss = 0;
		over = false;
		grid = new Array();
		gridSave = new Array();
		for(var i = 0; i < 6; i++) {
			grid[i] = new Array();
			gridSave[i] = new Array();
			for(var y = 0; y < 7; y++) {
				grid[i][y] = 0;
				gridSave[i][y] = 0;
			}
		}
		for(var i = 0; i < 6*7; i++){
			Cases[i].innerHTML = "";
		}
		Info.innerText = "C'est au joueur "+tour+" !";
		if(tour == 2)
			IA();
	}

	function copyGrid(action) {
		for(var i = 0; i < 6; i++) {
			for(var y = 0; y < 7; y++) {
				if(action == "save")
					gridSave[i][y] = grid[i][y];
				else if(action == "restore")
					grid[i][y] = gridSave[i][y];
			}
		}
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
		if(id[0] < 1 || id[0] > 6 || id[2] < 1 || id[2] > 7)
			return(10)
		var columnId = id[2] - 1;
		for(var i = 5; i >= 0; i--) {
			if(grid[i][columnId] == 0)
				return(i);
		}
		return(10);
	}

	function putToken(line, column, joueur) {
		joueur = (joueur == "IA")?((tour == 1)?2:1):((tour == 1)?1:2);
		//console.log("dans putToken");
		grid[line][column] = (joueur == 1)?1:2;
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
				//console.log("grid["+i+"]["+y+"] = "+grid[i][y]+" et lastTokenType = "+lastTokenType);
				if(grid[i][y] != 0 && grid[i][y] == lastTokenType) {
					//console.log("	so token++, donc token = "+(token+1));
					token++;
				}
				else if(grid[i][y] != 0) {
					//console.log("	token = 1");
					token = 1;
				}
				else
					token = 0;
				lastTokenType = grid[i][y];
				//console.log("token = "+token);
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
		console.log("dans testDiagonals");
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

	function testDiagonalsIA_1(joueur) {
		joueur = (joueur == "IA")?((tour == 1)?2:1):((tour == 1)?1:2);
		var id = new String();
		var token;
		var lastTokenType;
		var y = 0;
		var i = 0;
		var iBis;
		var yBis;
		var blank;
		for(var n = 0; n < 6+(7-1); n++) {
			if(y >= 7){
				y = 6;
				i++;
			}
			yBis = y;
			iBis = i;
			token = 0;
			lastTokenType = grid[iBis][yBis];
			blank = 0;
			while(yBis >= 0 && iBis < 6) {
				if(grid[iBis][yBis] == joueur && (lastTokenType == joueur || (lastTokenType == 0 && blank != 0))){
					token++;
				}
				else if(grid[iBis][yBis] == joueur) {
					token = 1;
				}
				else if(lastTokenType == joueur && grid[iBis][yBis] == 0 && blank == 0){
					blank = new String((iBis+1)+"-"+(yBis+1));
				}
				else {
					token = 0;
					blank = 0;
				}
				lastTokenType = grid[iBis][yBis];
				if(token >= 3 && blank == 0 && firstEmptyCase(new String((iBis-2)+"-"+(yBis+2))) == iBis - 3) {
					id+= (iBis - 3);
					id+= (yBis + 3);
					return(id);
				}
				if(token >= 3 && blank == 0 && firstEmptyCase(new String((iBis+2)+"-"+(yBis-2))) == iBis + 1) {
					id+= (iBis + 1);
					id+= (yBis - 1);
					return(id);
				}
				if(token >= 3 && blank != 0 && firstEmptyCase(blank) == blank[0] - 1) {
					id+= blank[0] - 1;
					id+= blank[2] - 1;
					return(id);
				}
				yBis--;
				iBis++;
			}
			y++;
		}
		return(0);
	}

	function testDiagonalsIA_2(joueur) {
		joueur = (joueur == "IA")?((tour == 1)?2:1):((tour == 1)?1:2);
		var id = new String();
		var token;
		var lastTokenType;
		var y = 0;
		var i = 5;
		var iBis;
		var yBis;
		var blank;
		for(var n = 0; n < 6+(7-1); n++) {
			if(i < 0){
				i = 0;
				y++;
			}
			yBis = y;
			iBis = i;
			token = 0;
			lastTokenType = grid[iBis][yBis];
			blank = 0;
			while(yBis < 7 && iBis < 6) {
				if(grid[iBis][yBis] == joueur && (lastTokenType == joueur || (lastTokenType == 0 && blank != 0))){
					token++;
				}
				else if(grid[iBis][yBis] == joueur) {
					token = 1;
				}
				else if(lastTokenType == joueur && grid[iBis][yBis] == 0 && blank == 0){
					blank = new String((iBis+1)+"-"+(yBis+1));
				}
				else {
					token = 0;
					blank = 0;
				}
				lastTokenType = grid[iBis][yBis];
				if(token >= 3 && blank == 0 && firstEmptyCase(new String((iBis-2)+"-"+(yBis-2))) == iBis - 3) {
					id += (iBis - 3);
					id += (yBis - 3);
					return(id);
				}
				if(token >= 3 && blank == 0 && firstEmptyCase(new String((iBis+2)+"-"+(yBis+2))) == iBis + 1) {
					id += (iBis + 1);
					id += (yBis + 1);
					return(id);
				}
				if(token >= 3 && blank != 0 && firstEmptyCase(blank) == blank[0] - 1) {
					id+= blank[0] - 1;
					id+= blank[2] - 1;
					return(id);
				}
				yBis++;
				iBis++;
			}
			i--;
		}
		return(0);
	}

	function testDiagonalsIA(joueur) {
		joueur = (joueur == "IA")?((tour == 1)?2:1):((tour == 1)?1:2);
		var id = new String();
		var token;
		var lastTokenType;
		var y = 0;
		var i = 0;
		var iBis;
		var yBis;
		var blank;
		for(var n = 0; n < 6+(7-1); n++) {
			if(y >= 7){
				y = 6;
				i++;
			}
			yBis = y;
			iBis = i;
			token = 0;
			lastTokenType = grid[iBis][yBis];
			blank = 0;
			while(yBis >= 0 && iBis < 6) {
				if(grid[iBis][yBis] == joueur && (lastTokenType == joueur || (lastTokenType == 0 && blank != 0))){
					token++;
				}
				else if(grid[iBis][yBis] == joueur) {
					token = 1;
				}
				else if(lastTokenType == joueur && grid[iBis][yBis] == 0 && blank == 0){
					blank = new String((iBis+1)+"-"+(yBis+1));
				}
				else {
					token = 0;
					blank = 0;
				}
				lastTokenType = grid[iBis][yBis];
				if(token >= 3 && blank == 0 && firstEmptyCase(new String((iBis-2)+"-"+(yBis+4))) == iBis - 3) {
					//console.log("		de top-right à bottom-left option 1");
					id+= (iBis - 3);
					id+= (yBis + 3);
					return(id);
				}
				if(token >= 3 && blank == 0 && firstEmptyCase(new String((iBis+2)+"-"+(yBis-2))) == iBis + 1) {
					//console.log("		de top-right à bottom-left option 2");
					id+= (iBis + 1);
					id+= (yBis - 1);
					return(id);
				}
				if(token >= 3 && blank != 0 && firstEmptyCase(blank) == blank[0] - 1) {
					//console.log("		de top-right à bottom-left option 3");
					id+= blank[0] - 1;
					id+= blank[2] - 1;
					return(id);
				}
				yBis--;
				iBis++;
			}
			y++;
		}
		i = 5;
		y = 0;
		for(var n = 0; n < 6+(7-1); n++) {
			if(i < 0){
				i = 0;
				y++;
			}
			yBis = y;
			iBis = i;
			token = 0;
			lastTokenType = grid[iBis][yBis];
			blank = 0;
			while(yBis < 7 && iBis < 6) {
				if(grid[iBis][yBis] == joueur && (lastTokenType == joueur || (lastTokenType == 0 && blank != 0))){
					token++;
				}
				else if(grid[iBis][yBis] == joueur) {
					token = 1;
				}
				else if(lastTokenType == joueur && grid[iBis][yBis] == 0 && blank == 0){
					blank = new String((iBis+1)+"-"+(yBis+1));
				}
				else {
					token = 0;
					blank = 0;
				}
				lastTokenType = grid[iBis][yBis];
				if(token >= 3 && blank == 0 && firstEmptyCase(new String((iBis-2)+"-"+(yBis-2))) == iBis - 3) {
					//console.log("		de top-left à bottom-right option 1");
					id += (iBis - 3);
					id += (yBis - 3);
					return(id);
				}
				if(token >= 3 && blank == 0 && firstEmptyCase(new String((iBis+2)+"-"+(yBis+2))) == iBis + 1) {
					//console.log("		de top-left à bottom-right option 2");
					id += (iBis + 1);
					id += (yBis + 1);
					return(id);
				}
				if(token >= 3 && blank != 0 && firstEmptyCase(blank) == blank[0] - 1) {
					//console.log("		de top-left à bottom-right option 3");
					id+= blank[0] - 1;
					id+= blank[2] - 1;
					return(id);
				}
				yBis++;
				iBis++;
			}
			i--;
		}
		return(0);
	}

	function testLinesIA(joueur) {
		joueur = (joueur == "IA")?((tour == 1)?2:1):((tour == 1)?1:2);
		var blank;
		var id = new String();
		var token;
		var lastTokenType;
		for(var i = 0; i < 6; i++) {
			token = 0;
			lastTokenType = grid[i][0];
			blank = 0;
			for(var y = 0; y < 7; y++) {
				if(grid[i][y] == joueur && (lastTokenType == joueur || (lastTokenType == 0 && blank != 0))) {
					token++;
				}
				else if(grid[i][y] == joueur) {
					token = 1;
				}
				else if(lastTokenType == joueur && grid[i][y] == 0 && blank == 0) {
					blank = new String((i+1)+"-"+(y+1));
				}
				else {
					token = 0;
					blank = 0;
				}
				lastTokenType = grid[i][y];
				if(token >= 3 && blank == 0 && firstEmptyCase(new String((i+1)+"-"+(y+2))) == i) {
					id += i;
					id += (y+1);
					return(id);
				}
				if(token >= 3 && blank == 0 && firstEmptyCase(new String((i+1)+"-"+(y-2))) == i) {
					id += i;
					id += (y-3);
					return(id);
				}
				if(token >= 3 && blank != 0 && firstEmptyCase(blank) == i) {
					id += i;
					id += blank[2] - 1;
					return(id);
				}
			}
		}
		return(0);
	}

	function testColumnsIA(joueur) {
		//console.log("dans testColumns");
		joueur = (joueur == "IA")?((tour == 1)?2:1):((tour == 1)?1:2);
		var id = new String();
		var token;
		var lastTokenType = 0;
		for(var i = 0; i < 7; i++) {
			token = 0;
			lastTokenType = grid[0][i];
			for(var y = 0; y < 6; y++) {
				//console.log("grid["+y+"]["+i+"] = "+grid[y][i]+" et lastTokenType = "+lastTokenType);
				if(grid[y][i] == joueur && grid[y][i] == lastTokenType){
					token++;
				}
				else if(grid[y][i] == joueur)
					token = 1;
				else
					token = 0;
				lastTokenType = grid[y][i];
				if(token >= 3 && firstEmptyCase(new String((y+1)+"-"+(i+1))) == y - 3) {
					//console.log("firstEmptyCase = "+firstEmptyCase(new String((y+1)+"-"+(i+1)))+" && y-3 = "+(y-3));
					id += (y-3);
					id += i;
					return(id);
				}
			}
		}
		return(0);
	}

	function canWin(joueur) {
		console.log("	in canWin for player "+joueur);
		var id = testDiagonalsIA(joueur);
		if(id != 0) {
			console.log("		true, testDiagonals = "+id);
			putToken(id[0], id[1], "IA");
			return(true);
		}
		id = testLinesIA(joueur);
		if(id != 0) {
			console.log("		true, testLines = "+id);
			putToken(id[0], id[1], "IA");
			return(true);
		}
		id = testColumnsIA(joueur);
		if(id != 0) {
			console.log("		true, testColumns = "+id);
			putToken(id[0], id[1], "IA");
			return(true);
		}
		return(false);
	}

	function canWinTest(joueur) {
		console.log("	in canWinTest for player "+joueur);
		var id = testDiagonalsIA(joueur);
		if(id != 0) {
			console.log("		true, testDiagonals = "+id);
			return(true);
		}
		id = testLinesIA(joueur);
		if(id != 0) {
			console.log("		true, testLines = "+id);
			return(true);
		}
		id = testColumnsIA(joueur);
		if(id != 0) {
			console.log("		true, testColumns = "+id);
			return(true);
		}
		console.log("		false");
		return(false);
	}

	function canWinTestNbr(joueur) {
		var nbrWinPoss = 0;
		console.log("	in canWinTestNbr for player "+joueur);
		var id = testDiagonalsIA(joueur);
		//console.log("		testDiagonals = "+id);
		if(id != 0) {
			nbrWinPoss++;
		}
		id = testLinesIA(joueur);
		//console.log("		testLines = "+id);
		if(id != 0) {
			nbrWinPoss++;
		}
		id = testColumnsIA(joueur);
		//console.log("		testColumns = "+id);
		if(id != 0) {
			nbrWinPoss++;
		}
		console.log("		resultat = "+nbrWinPoss);
		return(nbrWinPoss);
	}

	function isPlayable(id, length) {
		var good = 0;
		for(var i = 0; i < length; i++) {
			if((grid[id[3*i]-1][id[i*3+2]-1] == 0 && firstEmptyCase(new String(id[i*3]+id[i*3+1]+id[i*3+2])) == id[i*3] - 1) || grid[id[3*i]-1][id[i*3+2]-1] != 0)
				good++;
		}
		if(good == length)
			return(true);
		return(false);
	}

	function findPatternLine(toFind) {
		var finded;
		var id;
		for(var i = 0; i < 6; i++) {
			finded = 0;
			id = new String();
			for(var y = 0; y < 7; y++) {
				if(grid[i][y] == toFind[finded]) {
					finded++;
					id+=(i+1)+"-"+(y+1);
				}
				else {
					finded = 0;
					id = new String();
				}
				if(finded == toFind.length && isPlayable(id, toFind.length) == true)
					return(id);
			}
		}
		return(0);
	}

	function tryPattern(joueur) {
		console.log("in tryPattern");
		joueur = (joueur == "IA")?((tour == 1)?2:1):((tour == 1)?1:2);
		id = findPatternLine([0,0,joueur,joueur,0]);
		if(id != 0) {
			copyGrid("save");
			putToken(firstEmptyCase(new String(id[3]+id[4]+id[5])), id[5] - 1, "IA");
			if(canWinTest("humain") == false) {
				return(true);
			}
			copyGrid("restore");

		}
		id = findPatternLine([0,joueur,joueur,0,0]);
		if(id != 0) {
			copyGrid("save");
			putToken(firstEmptyCase(new String(id[9]+id[10]+id[11])), id[11] - 1, "IA");
			if(canWinTest("humain") == false) {
				return(true);
			}
			copyGrid("restore");

		}
		// id = findPattern2D([
		// 					[joueur,joueur,0],
		// 					[0,joueur,0],
		// 					[joueur,0,0]
		// 					]);
		// if(id != 0) {
		// 	copyGrid("save");
		// 	putToken(firstEmptyCase(new String(id[6]+id[7]+id[8])), id[8] - 1, "IA");
		// 	if(canWinTest("humain") == false) {
		// 		return(true);
		// 	}
		// 	copyGrid("restore");

		// }
		// id = findPattern2D([
		// 					[0,joueur,joueur],
		// 					[0,joueur,0],
		// 					[0,0,joueur]
		// 					]);
		// if(id != 0) {
		// 	copyGrid("save");
		// 	putToken(firstEmptyCase(new String(id[0]+id[1]+id[2])), id[2] - 1, "IA");
		// 	if(canWinTest("humain") == false) {
		// 		return(true);
		// 	}
		// 	copyGrid("restore");

		// }
		return(false);
	}

	function createPoss(nbr, joueur) {
		console.log("in createPoss for "+nbr+" poss to player "+joueur);
		var allPoss = new Array();
		var idBest;
		var bigerPoss;
		for(var y = 0; y < 7; y++) {
			if(columnIsFull(new String(1+"-"+(y+1))) == false) {
				copyGrid("save");
				putToken(firstEmptyCase(new String(1+"-"+(y+1))), y, joueur);
				poss = 0;
				poss+= (testDiagonalsIA_1(joueur) != 0)?1:0;
				poss+= (testDiagonalsIA_2(joueur) != 0)?1:0;
				poss+= (testLinesIA(joueur) != 0)?1:0;
				poss+= (testColumnsIA(joueur) != 0)?1:0;
				if(canWinTest("humain") == true)
					allPoss[y] = 0;
				else
					allPoss[y] = poss;
				copyGrid("restore");
			}
		}
		bigerPoss = allPoss[0];
		idBest = 0;
		for(var y = 0; y < 7; y++) {
			if(bigerPoss < allPoss[y]) {
				bigerPoss = allPoss[y];
				idBest = y;
			}
		}
		if(bigerPoss >= nbr) {
			console.log(idBest);
			console.log(firstEmptyCase(new String(1+"-"+(idBest+1))));
			putToken(firstEmptyCase(new String(1+"-"+(idBest+1))), idBest, "IA");
			return(true);
		}
		return(false);
	}

	function isAllDone(allPoss) {
		for(var i = 0; i < 7; i++) {
			if(allPoss[i] != 0)
				return(allPoss);
		}
		return(true);
	}

	function updateAllPoss(allPoss, value) {
		for(var i = 0; i < 7; i++) {
			if(allPoss[i] == value)
				allPoss[i] = 0;
		}
		return(allPoss);
	}

	function random() {
		console.log("in random");
		var ok = false;
		var value;
		var allDone = false;
		var allPoss = new Array(1,2,3,4,5,6,7);
		while(allDone == false) {
			allPoss = isAllDone(allPoss);
			if(allPoss == true)
				allDone = true;
			value = Math.floor(Math.random()*7)+1;
			allPoss = updateAllPoss(allPoss, value);
			if(columnIsFull(new String(1+"-"+value)) == false) {
				copyGrid("save");
				putToken(firstEmptyCase(new String(1+"-"+value)), (value-1), "IA");
				if(canWinTest("humain") == false) {
					return(true);
				}
				else
					copyGrid("restore");
			}
		}
		while(ok == false) {
			value = Math.floor(Math.random()*7)+1;
			if(columnIsFull(new String(1+"-"+value)) == false) {
				putToken(firstEmptyCase(new String(1+"-"+value)), (value-1), "IA");
				ok = true;
			}
		}
	}

	function canCreatMulPoss(joueur) {
		console.log("in canCreatMulPoss");
		for(var y = 0; y < 7; y++) {
			if(columnIsFull(new String(1+"-"+(y+1))) == false) {
				copyGrid("save");
				putToken(firstEmptyCase(new String(1+"-"+(y+1))), y, joueur);
				if(canWinTestNbr(joueur) >= 2 && canWinTest("humain") == false) {
					copyGrid("restore");
					putToken(firstEmptyCase(new String(1+"-"+(y+1))), y, "IA");
					return(true);
				}
				else
					copyGrid("restore");
			}
		}
		return(false);
	}

	function IA() {
		var win = false;
		if(canWin("IA") == true) {
			console.log("in canWin(IA)");
			win = true;
		}
		else if(canWin("humain") == true) {console.log("in canWin(humain)");}
		else if(tryPattern("humain") == true) {console.log("in tryPattern(IA)");}
		else if(canCreatMulPoss("IA") == true) {console.log("in canCreatMulPoss(IA)");}
		else if(canCreatMulPoss("humain") == true) {console.log("in canCreatMulPoss(humain)");}
		else if(createPoss(2, "IA") == true) {console.log("in createPoss(2 IA)");}
		else if(createPoss(2, "humain") == true) {console.log("in createPoss(2 humain)");}
		else if(createPoss(1, "humain") == true) {console.log("in createPoss(1 humain)");}
		else if(tryPattern("IA") == true) {console.log("in tryPattern(IA)");}
		else if(createPoss(1, "IA") == true) {console.log("in createPoss(1 IA)");}
		else {
			random();
			console.log("in random()");
		}
		if(win == true) {
			Info.innerText = "Victoire de l'IA !";
			over = true;
		}
		else if(isOver() == 2) {
			Info.innerText = "Egalité !";
			over = true;
		}
		updateHTML();
		return(0);
	}

	function controller(monThis) {
		if(over == false) {
			var id = monThis.id;
			if(columnIsFull(id) == true){
				console.log("true");
				return(0);
			}
			putToken(firstEmptyCase(id), id[2] - 1, "humain");
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
				IA();
			}
		}
	}

	init();
});
