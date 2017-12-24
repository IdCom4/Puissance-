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

	function putID(i, y) {
		return(newString((i+1)+"-"+(y+1)));
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

	function isCaseEmpty(line, column) {
		console.log("								in isCaseEmpty, line = "+line+" && column = "+column);
		if(line < 0 || line > 5 || column < 0 || column > 6)
			return(false);
		if(grid[line][column] == 0)
			return(true);
		return(false);
	}

	function columnIsFull(columnId) {
		console.log("								dans columnIsFull");
		if(grid[0][columnId] == 0)
			return(false);
		return(true);
	}

	function firstEmptyCase(columnId) {
		console.log("								dans firstEmptyCase, columnId = "+columnId);
		if(columnId < 0 || columnId > 6) {
			console.log("								columnId = "+columnId+" ///// return 10");
			return(10)
		}
		for(var i = 5; i >= 0; i--) {
			//console.log("								grid["+i+"]["+columnId+"] = "+grid[i][columnId]);
			if(grid[i][columnId] == 0) {
				console.log("									&& line = "+i);
				return(i);
			}
		}
		console.log("									la colonne est pleine ///// return 10");
		return(10);
	}

	function putToken(line, column, joueur) {
		joueur = (joueur == "IA")?((tour == 1)?2:1):((tour == 1)?1:2);
		//console.log("dans putToken");
		grid[line][column] = joueur;
		console.log("						in putToken, grid["+line+"]["+column+"] = "+joueur);
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

	function testDiagonalsIA_1(joueur) {
		console.log("			dans testDiagonalsIA_1");
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
			blank = new String("99");
			console.log("				start with iBis = "+iBis+" && yBis = "+yBis+" && token = "+token);
			while(yBis >= 0 && iBis < 6) {
				if(grid[iBis][yBis] == joueur && (lastTokenType == joueur || (lastTokenType == 0 && blank != "99"))){
					token++;
				}
				else if(grid[iBis][yBis] == joueur) {
					token = 1;
				}
				else if(lastTokenType == joueur && grid[iBis][yBis] == 0 && blank == "99"){
					blank = new String(new String(iBis)+yBis);
				}
				else {
					token = 0;
					blank = new String("99");
				}
				lastTokenType = grid[iBis][yBis];
				console.log("				iBis = "+iBis+" && yBis = "+yBis);
				if(token >= 3 && blank == "99" && firstEmptyCase(yBis+3) == iBis - 3) {
					id+= (iBis - 3);
					id+= (yBis + 3);
					console.log("				option 1, id = "+id);
					return(id);
				}
				if(token >= 3 && blank == "99" && firstEmptyCase(yBis-1) == iBis + 1) {
					id+= (iBis + 1);
					id+= (yBis - 1);
					console.log("				option 2, id = "+id);
					return(id);
				}
				if(token >= 3 && blank != "99" && firstEmptyCase(blank[1]) == blank[0]) {
					id+= blank[0];
					id+= blank[1];
					console.log("				option 3, id = "+id);
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
		console.log("			dans testDiagonalsIA_2");
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
			blank = new String("99");
			while(yBis < 7 && iBis < 6) {
				if(grid[iBis][yBis] == joueur && (lastTokenType == joueur || (lastTokenType == 0 && blank != "99"))){
					token++;
				}
				else if(grid[iBis][yBis] == joueur) {
					token = 1;
				}
				else if(lastTokenType == joueur && grid[iBis][yBis] == 0 && blank == "99"){
					blank = new String(new String(iBis)+yBis);
				}
				else {
					token = 0;
					blank = new String("99");
				}
				lastTokenType = grid[iBis][yBis];
				if(token >= 3 && blank == "99" && firstEmptyCase(yBis-3) == iBis - 3) {
					id += (iBis - 3);
					id += (yBis - 3);
					console.log("				option 1, id = "+id);
					return(id);
				}
				if(token >= 3 && blank == "99" && firstEmptyCase(yBis+1) == iBis + 1) {
					id += (iBis + 1);
					id += (yBis + 1);
					console.log("				option 2, id = "+id);
					return(id);
				}
				if(token >= 3 && blank != "99" && firstEmptyCase(blank[1]) == blank[0]) {
					id+= blank[0];
					id+= blank[1];
					console.log("				option 3, id = "+id);
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
		console.log("			dans testDiagonalsIA");
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
			blank = new String("99");
			while(yBis >= 0 && iBis < 6) {
				if(grid[iBis][yBis] == joueur && (lastTokenType == joueur || (lastTokenType == 0 && blank != "99"))){
					token++;
				}
				else if(grid[iBis][yBis] == joueur) {
					token = 1;
				}
				else if(lastTokenType == joueur && grid[iBis][yBis] == 0 && blank == "99"){
					blank = new String(new String(iBis)+yBis);
				}
				else {
					token = 0;
					blank = new String("99");
				}
				lastTokenType = grid[iBis][yBis];

				if(token >= 3 && blank == "99" && firstEmptyCase(yBis+3) == iBis - 3) {
					console.log("			de top-right à bottom-left option 1");
					console.log("			grid["+(iBis-3)+"]["+(yBis+3)+"] = "+grid[iBis-3][yBis+3]);
					id+= (iBis - 3);
					id+= (yBis + 3);
					return(id);
				}
				if(token >= 3 && blank == "99" && firstEmptyCase(yBis-1) == iBis + 1) {
					console.log("			de top-right à bottom-left option 2");
					console.log("			grid["+(iBis+1)+"]["+(yBis-1)+"] = "+grid[iBis+1][yBis-1]);
					id+= (iBis + 1);
					id+= (yBis - 1);
					return(id);
				}
				if(token >= 3 && blank != "99" && firstEmptyCase(blank[1]) == blank[0]) {
					console.log("			de top-right à bottom-left option 3");
					console.log("			grid["+(blank[0])+"]["+(blank[1])+"] = "+grid[blank[0]][blank[1]]);
					id+= blank[0];
					id+= blank[1];
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
			blank = new String("99");
			while(yBis < 7 && iBis < 6) {
				if(grid[iBis][yBis] == joueur && (lastTokenType == joueur || (lastTokenType == 0 && blank != "99"))){
					token++;
				}
				else if(grid[iBis][yBis] == joueur) {
					token = 1;
				}
				else if(lastTokenType == joueur && grid[iBis][yBis] == 0 && blank == "99"){
					blank = new String(new String(iBis)+yBis);
				}
				else {
					token = 0;
					blank = new String("99");
				}
				lastTokenType = grid[iBis][yBis];
				if(token >= 3 && blank == "99" && firstEmptyCase(yBis-3) == iBis - 3) {
					console.log("			de top-left à bottom-right option 1");
					console.log("			grid["+(iBis-3)+"]["+(yBis-3)+"] = "+grid[iBis-3][yBis-3]);
					id += (iBis - 3);
					id += (yBis - 3);
					return(id);
				}
				if(token >= 3 && blank == "99" && firstEmptyCase(yBis+1) == iBis + 1) {
					console.log("			de top-left à bottom-right option 2");
					console.log("			grid["+(iBis+1)+"]["+(yBis+1)+"] = "+grid[iBis+1][yBis+1]);
					id += (iBis + 1);
					id += (yBis + 1);
					return(id);
				}
				if(token >= 3 && blank != "99" && firstEmptyCase(blank[1]) == blank[0]) {
					console.log("			de top-left à bottom-right option 3");
					console.log("			grid["+(blank[0])+"]["+(blank[1])+"] = "+grid[blank[0]][blank[1]]);
					id+= blank[0];
					id+= blank[1];
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
		console.log("			dans testLinesIA");
		joueur = (joueur == "IA")?((tour == 1)?2:1):((tour == 1)?1:2);
		var blank;
		var id = new String();
		var token;
		var lastTokenType;
		for(var i = 0; i < 6; i++) {
			token = 0;
			lastTokenType = grid[i][0];
			blank = new String("99");
			for(var y = 0; y < 7; y++) {
				if(grid[i][y] == joueur && (lastTokenType == joueur || (lastTokenType == 0 && blank != "99"))) {
					token++;
				}
				else if(grid[i][y] == joueur) {
					token = 1;
				}
				else if(lastTokenType == joueur && grid[i][y] == 0 && blank == "99") {
					blank = new String(new String(i)+y);
				}
				else {
					token = 0;
					blank = new String("99");
				}
				lastTokenType = grid[i][y];
				if(token >= 3 && blank == "99" && firstEmptyCase(y+1) == i) {
					id += i;
					id += y+1;
					console.log("				option 1, id = "+id);
					return(id);
				}
				if(token >= 3 && blank == "99" && firstEmptyCase(y-3) == i) {
					id += i;
					id += y-3;
					console.log("				option 2, id = "+id);
					return(id);
				}
				if(token >= 3 && blank != "99" && firstEmptyCase(blank[1]) == i) {
					id += i;
					id += blank[1];
					console.log("				option 3, id = "+id);
					return(id);
				}
			}
		}
		return(0);
	}

	function testColumnsIA(joueur) {
		console.log("			dans testColumnsIA");
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
				if(token >= 3 && firstEmptyCase(i) == y - 3) {
					//console.log("firstEmptyCase = "+firstEmptyCase(new String((y+1)+"-"+(i+1)))+" && y-3 = "+(y-3));
					id += (y-3);
					id += i;
					console.log("				option 1, id = "+id);
					return(id);
				}
			}
		}
		return(0);
	}

	function testDiagonalsNbrIA(joueur, column) {
		console.log("			in testDiagonalsNbrIA");
		joueur = (joueur == "IA")?((tour == 1)?2:1):((tour == 1)?1:2);
		var id = new String();
		var token = 0;
		var lastTokenType;
		var iBis = firstEmptyCase(column) + 1;
		iBis = (iBis >= 6)?5:iBis;
		var yBis = column;
		var blank = new String("99");
		console.log("				avant : iBis = "+iBis+" && yBis = "+yBis);
		while(iBis > 0 && yBis < 6) {
			iBis--;
			yBis++;
		}
		console.log("				après : iBis = "+iBis+" && yBis = "+yBis);
		lastTokenType = grid[iBis][yBis];
		while(yBis >= 0 && iBis < 6) {
			if(grid[iBis][yBis] == joueur && (lastTokenType == joueur || (lastTokenType == 0 && blank != "99"))){
				token++;
			}
			else if(grid[iBis][yBis] == joueur) {
				token = 1;
			}
			else if(lastTokenType == joueur && grid[iBis][yBis] == 0 && blank == "99"){
				blank = new String(new String(iBis)+yBis);
			}
			else {
				token = 0;
				blank = new String("99");
			}
			lastTokenType = grid[iBis][yBis];
			if(token >= 3 && (isCaseEmpty(blank[0], blank[1]) == true || isCaseEmpty(iBis-3, yBis+3) == true || isCaseEmpty(iBis+1, yBis-1) == true)) {
				console.log("				poss in diagonale-+");
				var z = yBis-1;
				for(var x = iBis+1; x >= 0; x--) {
					if(x >= 0 && x < 6 && z >= 0 && z < 7)
						console.log("					grid["+x+"]["+z+"] = "+grid[x][z]);
					z++;
				}
				return(1);
			}
			yBis--;
			iBis++;
		}

		iBis = firstEmptyCase(column) + 1;
		iBis = (iBis >= 6)?5:iBis;
		yBis = column;
		console.log("				avant : iBis = "+iBis+" && yBis = "+yBis);
		while(iBis > 0 && yBis > 0) {
			iBis--;
			yBis--;
		}
		console.log("				après : iBis = "+iBis+" && yBis = "+yBis);
		token = 0;
		lastTokenType = grid[iBis][yBis];
		blank = new String("99");
		while(iBis < 6 && yBis < 7) {
			if(grid[iBis][yBis] == joueur && (lastTokenType == joueur || (lastTokenType == 0 && blank != "99"))){
				token++;
			}
			else if(grid[iBis][yBis] == joueur) {
				token = 1;
			}
			else if(lastTokenType == joueur && grid[iBis][yBis] == 0 && blank == "99"){
				blank = new String(new String(iBis)+yBis);
			}
			else {
				token = 0;
				blank = new String("99");
			}
			lastTokenType = grid[iBis][yBis];
			if(token >= 3 && (isCaseEmpty(blank[0], blank[1]) == true || isCaseEmpty(iBis-3, yBis-3) == true || isCaseEmpty(iBis+1, yBis+1) == true)) {
				console.log("					poss in diagonale++");
				var z = yBis+1;
				for(var x = iBis+1; x >= 0; x--) {
					if(x >= 0 && x < 6 && z >= 0 && z < 7)
						console.log("						grid["+x+"]["+z+"] = "+grid[x][z]);
					z--;
				}
				return(1);
			}
			yBis++;
			iBis++;
		}
		return(0);
	}

	function testLinesNbrIA(joueur, column) {
		console.log("				in testLinesNbrIA");
		joueur = (joueur == "IA")?((tour == 1)?2:1):((tour == 1)?1:2);
		var blank = new String("99");
		var id = new String();
		var token = 0;
		var i = firstEmptyCase(column) + 1;
		i = (i >= 6)?5:i;
		//console.log("					i = "+i);
		var lastTokenType = grid[i][0];
		for(var y = 0; y < 7; y++) {
			if(grid[i][y] == joueur && (lastTokenType == joueur || (lastTokenType == 0 && blank != "99"))) {
				token++;
			}
			else if(grid[i][y] == joueur) {
				token = 1;
			}
			else if(lastTokenType == joueur && grid[i][y] == 0 && blank == "99") {
				blank = new String(new String(i)+y);
			}
			else {
				token = 0;
				blank = new String("99");
			}
			lastTokenType = grid[i][y];
			if(token >= 3 && (isCaseEmpty(blank[0], blank[1]) == true || isCaseEmpty(i, y+1) == true || isCaseEmpty(i, y-3) == true)) {
				console.log("					poss in ligne");
				for(var x = y+1; x >= 0; x--) {
					if(x >= 0 && x < 7 && i >= 0 && i < 6)
						console.log("						grid["+i+"]["+x+"] = "+grid[i][x]);
				}
				return(1);
			}
		}
		return(0);
	}

	function testColumnsNbrIA(joueur, column) {
		console.log("				in testColumnsNbrIA");
		joueur = (joueur == "IA")?((tour == 1)?2:1):((tour == 1)?1:2);
		var id = new String();
		var token;
		var lastTokenType = 0;
		var i = column;
		console.log("i = "+i);
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
			if(token >= 3 && firstEmptyCase(i) == y - 3) {
				console.log("					poss in colonne");
				for(var x = y+1; x >= 0; x--) {
					if(x >= 0 && x < 6 && i >= 0 && i < 7)
						console.log("						grid["+x+"]["+i+"] = "+grid[x][i]);
				}
				return(1);
			}
		}
		return(0);
	}

	function canWin(joueur) {
		console.log("	in canWin for player "+joueur);
		var id = testDiagonalsIA(joueur);
		if(id != 0) {
			console.log("			true, testDiagonalsIA = "+id);
			putToken(id[0], id[1], "IA");
			return(true);
		}
		id = testLinesIA(joueur);
		if(id != 0) {
			console.log("			true, testLinesIA = "+id);
			putToken(id[0], id[1], "IA");
			return(true);
		}
		id = testColumnsIA(joueur);
		if(id != 0) {
			console.log("			true, testColumnsIA = "+id);
			putToken(id[0], id[1], "IA");
			return(true);
		}
		console.log("			false");
		return(false);
	}

	function canWinTest(joueur) {
		console.log("		in canWinTest for player "+joueur);
		var id = testDiagonalsIA(joueur);
		if(id != 0) {
			console.log("			true, testDiagonalsIA = "+id);
			return(new String(id+"D"));
		}
		id = testLinesIA(joueur);
		if(id != 0) {
			console.log("			true, testLinesIA = "+id);
			return(new String(id+"L"));
		}
		id = testColumnsIA(joueur);
		if(id != 0) {
			console.log("			true, testColumnsIA = "+id);
			return(new String(id+"C"));
		}
		console.log("			false");
		return(false);
	}

	function canWinTestNbr(joueur, column) {
		var nbrWinPoss = 0;
		console.log("		in canWinTestNbr for player "+joueur);
		nbrWinPoss += testDiagonalsNbrIA(joueur, column);
		console.log("			testDiagonalsNbrIA("+joueur+", "+column+") ="+testDiagonalsNbrIA(joueur, column));
		nbrWinPoss += testLinesNbrIA(joueur, column);
		console.log("			testLinesNbrIA("+joueur+", "+column+") ="+testLinesNbrIA(joueur, column));
		nbrWinPoss += testColumnsNbrIA(joueur, column);
		console.log("			testColumnsNbrIA("+joueur+", "+column+") ="+testColumnsNbrIA(joueur, column));
		console.log("		resultat = "+nbrWinPoss);
		return(nbrWinPoss);
	}

	function isPlayable(id, length) {
		var good = 0;
		for(var i = 0; i < length; i++) {
			if((grid[id[3*i]-1][id[i*3+2]-1] == 0 && firstEmptyCase(id[i*3+2]-1) == id[i*3] - 1) || grid[id[3*i]-1][id[i*3+2]-1] != 0)
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
		console.log("	in tryPattern");
		var x = (joueur == "IA")?((tour == 1)?2:1):((tour == 1)?1:2);
		id = findPatternLine([0,0,x,x,0]);
		if(id != 0) {
			copyGrid("save");
			putToken(firstEmptyCase(id[5]-1), id[5] - 1, "IA");
			if(canWinTest("humain") == false) {
				return(true);
			}
			copyGrid("restore");

		}
		id = findPatternLine([0,x,x,0,0]);
		if(id != 0) {
			copyGrid("save");
			putToken(firstEmptyCase(id[11]-1), id[11] - 1, "IA");
			if(canWinTest("humain") == false) {
				return(true);
			}
			copyGrid("restore");

		}
		id = findPatternLine([0,x,0,x,0]);
		if(id != 0) {
			copyGrid("save");
			putToken(firstEmptyCase(id[8]-1), id[8] - 1, "IA");
			if(canWinTest("humain") == false) {
				return(true);
			}
			copyGrid("restore");

		}
		// id = findPattern2D([
		// 					[x,x,0],
		// 					[0,x,0],
		// 					[x,0,0]
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
		// 					[0,x,x],
		// 					[0,x,0],
		// 					[0,0,x]
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
		console.log("	in createPoss for "+nbr+" poss to player "+joueur);
		var allPoss = new Array();
		var idBest;
		var bigerPoss;
		for(var y = 0; y < 7; y++) {
			if(columnIsFull(y) == false) {
				copyGrid("save");
				putToken(firstEmptyCase(y), y, joueur);
				poss = 0;
				poss+= (testDiagonalsIA_1(joueur) != 0)?1:0;
				console.log("		testDiagonalsIA_1 = "+testDiagonalsIA_1(joueur));
				poss+= (testDiagonalsIA_2(joueur) != 0)?1:0;
				console.log("		testDiagonalsIA_2 = "+testDiagonalsIA_2(joueur));
				poss+= (testLinesIA(joueur) != 0)?1:0;
				console.log("		testLinesIA = "+testLinesIA(joueur));
				poss+= (testColumnsIA(joueur) != 0)?1:0;
				console.log("		testColumnsIA = "+testColumnsIA(joueur));
				if(canWinTest("humain") != false)
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
			putToken(firstEmptyCase(idBest), idBest, "IA");
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

	function findNbrNearToken(line, column, IA) {
		console.log("				in findNbrNearToken");
		var nbrNearToken = 0;
		if(line == 10)
			return(0);
		line -= 1;
		column -= 1;
		var columnOrigin = column;
		for(var x = 0; x < 9; x++) {
			if(x % 3 == 0 && x != 0) {
				line++;
				column = columnOrigin;
			}
			else
				column++;
			if(line >= 0 && line < 6 && column >= 0 && column < 7) {
				if(grid[line][column] == IA)
					nbrNearToken++;
			}
		}
		return(nbrNearToken);
	}

	function nextTo() {
		console.log("	in nextTo");
		var tampon;
		var IA = (tour == 1)?2:1;
		var dir = Math.floor(Math.random() * 1) + 1;
		var nbrNearToken = new Array();
		var columnId = new Array();
		var poss;

		if(dir == 1) {
			for(var y = 0; y < 7; y++) {
				nbrNearToken[y] = findNbrNearToken(firstEmptyCase(y), y, IA);
				columnId[y] = y;
			}
		}
		else {
			for(var y = 6; y >= 0; y--) {
				nbrNearToken[y] = findNbrNearToken(firstEmptyCase(y), y, IA);
				columnId[y] = y;
			}
		}
		
		for(var i = 0; i < nbrNearToken.length; i++) {
			for(var y = 0; y < nbrNearToken.length-i+1; y++) {
				if(nbrNearToken[y] > nbrNearToken[y+1]) {
					tampon = nbrNearToken[y];
					nbrNearToken[y] = nbrNearToken[y+1];
					nbrNearToken[y+1] = tampon;

					tampon = columnId[y];
					columnId[y] = columnId[y+1];
					columnId[y+1] = tampon;

				}
			}
		}
		console.log("			nbrNearToken = "+nbrNearToken);
		console.log("			begin tests");

		for(var y = 6; y >= 0; y--) {
			if(nbrNearToken[y] > 0) {
				copyGrid("save");
				putToken(firstEmptyCase(columnId[y]), columnId[y], "IA");
				if(columnIsFull(columnId[y]) == false) {
					putToken(firstEmptyCase(columnId[y]), columnId[y], "humain");
					if(canWinTest("humain") == false && isOver() != 1) {
						copyGrid("restore");
						putToken(firstEmptyCase(columnId[y]), columnId[y], "IA");
						return(true);
					}
					copyGrid("restore");
				}
				else if(canWinTest("humain") == false  && isOver() != 1)
					return(true);
				copyGrid("restore");
			}
		}
		return(false);
	}

	function random() {
		console.log("	in random");
		var ok = false;
		var limit = 0;
		var value;
		var allDone = false;
		var allPoss = new Array(1,2,3,4,5,6,7);
		while(allDone == false && limit < 50) {
			allPoss = isAllDone(allPoss);
			if(allPoss == true)
				allDone = true;
			value = Math.floor(Math.random()*7);
			allPoss = updateAllPoss(allPoss, value+1);
			if(columnIsFull(value) == false) {
				copyGrid("save");
				putToken(firstEmptyCase(value), value, "IA");
				if(canWinTest("humain") == false) {
					return(true);
				}
				else
					copyGrid("restore");
			}
			limit++;
		}
		limit = 0;
		while(ok == false && limit < 50) {
			value = Math.floor(Math.random()*7);
			if(columnIsFull(value) == false) {
				putToken(firstEmptyCase(value), value, "IA");
				ok = true;
			}
			limit++;
		}
		for(var y = 0; y < 7; y++) {
			if(columnIsFull(y) == false) {
				putToken(firstEmptyCase(y), y, "IA");
				y = 7;
			}
		}
	}

	function canCreatMulPoss(joueur) {
		console.log("	in canCreatMulPoss");
		for(var y = 0; y < 7; y++) {
			if(columnIsFull(y) == false) {
				copyGrid("save");
				putToken(firstEmptyCase(y), y, joueur);
				if(canWinTestNbr(joueur, y) >= 2) {
					copyGrid("restore");
					copyGrid("save");
					putToken(firstEmptyCase(y), y, "IA");
					if(canWinTest("humain") == false)
						return(true);
				}
				copyGrid("restore");
			}
		}
		return(false);
	}

	function testDiagonalsIASpe(joueur, avoidCoord) {
		console.log("			dans testDiagonalsIASpe");
		joueur = (joueur == "IA")?((tour == 1)?2:1):((tour == 1)?1:2);
		var id = new String();
		var token;
		var lastTokenType;
		var y = 0;
		var i = 0;
		var iBis;
		var yBis;
		var iBisTest;
		var yBisTest;
		var blank;
		var toAvoid;
		for(var n = 0; n < 6+(7-1); n++) {
			if(y >= 7){
				y = 6;
				i++;
			}
			yBis = y;
			iBis = i;
			token = 0;
			lastTokenType = grid[iBis][yBis];
			blank = new String("99");
			toAvoid = false;
			iBisTest = iBis;
			yBisTest = yBis;
			while(iBisTest < 6 && yBisTest >= 0) {
				if(iBisTest == avoidCoord[0] && yBisTest == avoidCoord[1])
					toAvoid = true;
				iBisTest++;
				yBisTest--;
			}
			while(yBis >= 0 && iBis < 6 && toAvoid == false) {
				if(grid[iBis][yBis] == joueur && (lastTokenType == joueur || (lastTokenType == 0 && blank != "99"))){
					token++;
				}
				else if(grid[iBis][yBis] == joueur) {
					token = 1;
				}
				else if(lastTokenType == joueur && grid[iBis][yBis] == 0 && blank == "99"){
					blank = new String(new String(iBis)+yBis);
				}
				else {
					token = 0;
					blank = new String("99");
				}
				lastTokenType = grid[iBis][yBis];
				if(token >= 3 && blank == "99" && firstEmptyCase(yBis+3) == iBis - 3) {
					console.log("				de top-right à bottom-left option 1, grid");
					console.log("				grid["+(iBis-3)+"]["+(yBis+3)+"] = "+grid[iBis-3][yBis+3]);
					id+= (iBis - 3);
					id+= (yBis + 3);
					return(id);
				}
				if(token >= 3 && blank == "99" && firstEmptyCase(yBis-1) == iBis + 1) {
					console.log("				de top-right à bottom-left option 2");
					console.log("				grid["+(iBis+1)+"]["+(yBis-1)+"] = "+grid[iBis+1][yBis-1]);
					id+= (iBis + 1);
					id+= (yBis - 1);
					return(id);
				}
				if(token >= 3 && blank != "99" && firstEmptyCase(blank[1]) == blank[0]) {
					console.log("				de top-right à bottom-left option 3");
					console.log("				grid["+(blank[0])+"]["+(blank[1])+"] = "+grid[blank[0]][blank[1]]);
					id+= blank[0];
					id+= blank[1];
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
			blank = new String("99");
			toAvoid = false;
			iBisTest = iBis;
			yBisTest = yBis;
			while(iBisTest < 6 && yBisTest < 7) {
				if(iBisTest == avoidCoord[0] && yBisTest == avoidCoord[1])
					toAvoid = true;
				iBisTest++;
				yBisTest++;
			}
			while(yBis < 7 && iBis < 6 && toAvoid == false) {
				if(grid[iBis][yBis] == joueur && (lastTokenType == joueur || (lastTokenType == 0 && blank != "99"))){
					token++;
				}
				else if(grid[iBis][yBis] == joueur) {
					token = 1;
				}
				else if(lastTokenType == joueur && grid[iBis][yBis] == 0 && blank == "99"){
					blank = new String(new String(iBis)+yBis);
				}
				else {
					token = 0;
					blank = new String("99");
				}
				lastTokenType = grid[iBis][yBis];
				if(token >= 3 && blank == "99" && firstEmptyCase(yBis-3) == iBis - 3) {
					console.log("				de top-left à bottom-right option 1");
					console.log("				grid["+(iBis-3)+"]["+(yBis-3)+"] = "+grid[iBis-3][yBis-3]);
					id += (iBis - 3);
					id += (yBis - 3);
					return(id);
				}
				if(token >= 3 && blank == "99" && firstEmptyCase(yBis+1) == iBis + 1) {
					console.log("				de top-left à bottom-right option 2");
					console.log("				grid["+(iBis+1)+"]["+(yBis+1)+"] = "+grid[iBis+1][yBis+1]);
					id += (iBis + 1);
					id += (yBis + 1);
					return(id);
				}
				if(token >= 3 && blank != "99" && firstEmptyCase(blank[1]) == blank[0]) {
					console.log("				de top-left à bottom-right option 3");
					console.log("				grid["+(blank[0])+"]["+(blank[1])+"] = "+grid[blank[0]][blank[1]]);
					id+= blank[0];
					id+= blank[1];
					return(id);
				}
				yBis++;
				iBis++;
			}
			i--;
		}
		return(0);
	}

	function testLinesIASpe(joueur, avoidCoord) {
		console.log("			dans testLinesIASpe");
		joueur = (joueur == "IA")?((tour == 1)?2:1):((tour == 1)?1:2);
		var blank;
		var id = new String();
		var token;
		var lastTokenType;
		for(var i = 0; i < 6; i++) {
			token = 0;
			lastTokenType = grid[i][0];
			blank = new String("99");
			if(i != avoidCoord[0]) {
				for(var y = 0; y < 7; y++) {
					if(grid[i][y] == joueur && (lastTokenType == joueur || (lastTokenType == 0 && blank != "99"))) {
						token++;
					}
					else if(grid[i][y] == joueur) {
						token = 1;
					}
					else if(lastTokenType == joueur && grid[i][y] == 0 && blank == "99") {
						blank = new String(new String(i)+y);
					}
					else {
						token = 0;
						blank = new String("99");
					}
					lastTokenType = grid[i][y];
					if(token >= 3 && blank == "99" && firstEmptyCase(y+1) == i) {
						id += i;
						id += y+1;
						console.log("				option 1, id = "+id);
						return(id);
					}
					if(token >= 3 && blank == "99" && firstEmptyCase(y-3) == i) {
						id += i;
						id += y-3;
						console.log("				option 2, id = "+id);
						return(id);
					}
					if(token >= 3 && blank != "99" && firstEmptyCase(blank[1]) == i) {
						id += i;
						id += blank[1];
						console.log("				option 3, id = "+id);
						return(id);
					}
				}
			}
		}
		return(0);
	}

	function testColumnsIASpe(joueur, avoidCoord) {
		console.log("			dans testColumnIASpe");
		joueur = (joueur == "IA")?((tour == 1)?2:1):((tour == 1)?1:2);
		var id = new String();
		var token;
		var lastTokenType = 0;
		for(var i = 0; i < 7; i++) {
			token = 0;
			lastTokenType = grid[0][i];
			if(i != avoidCoord[1]) {
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
					if(token >= 3 && firstEmptyCase(i) == y - 3) {
						//console.log("firstEmptyCase = "+firstEmptyCase(new String((y+1)+"-"+(i+1)))+" && y-3 = "+(y-3));
						id += (y-3);
						id += i;
						console.log("				option 1, id = "+id);
						return(id);
					}
				}
			}
		}
		return(0);
	}

	function canWinTestSpe(joueur, avoidTest, avoidCoord) {
		console.log("		in canWinTestSpe for player "+joueur);
		var id;
		if(avoidTest == "D")
			id = testDiagonalsIASpe(joueur, avoidCoord);
		else
			id = testDiagonalsIA(joueur);
		if(id != 0) {
			return(id);
		}

		if(avoidTest == "L")
			id = testLinesIASpe(joueur, avoidCoord);
		else
			id = testLinesIA(joueur);
		if(id != 0) {
			return(id);
		}

		if(avoidTest == "C")
			id = testColumnsIASpe(joueur, avoidCoord);
		else
			id = testColumnsIA(joueur);
		if(id != 0) {
			return(id);
		}

		return(false);
	}

	function testLineCould(line, column, joueur) {
		var token == 0;
		var tokenCrossed = false;
		var blank = new String("99");
		for(var y = 0; y < 7; y++) {
			if(y == column)
				tokenCrossed = true;
			if(grid[line][y] == joueur)
				token++;
			else if(grid[line][y] == 0 && blank == "99")
				blank = new String(new String(line)+y);
			else {
				blank = new String("99");
				tokenCrossed = false;
				token = 0;
			}
			if(token >= 3 && tokenCrossed == true && blank == "99" && y+1 < 7) {
				if(grid[line][y+1] == 0)
					return(new String(new String(line)+(y+1)));
			}
			if(token >= 3 && tokenCrossed == true && blank != "99")
				return(blank);
		}
		return(false);
	}

	function testColumnCould(line, column, joueur) {
		var token == 0;
		var tokenCrossed = false;
		var blank = new String("99");
		for(var i = 5; i >= 0; i--) {
			if(i == line)
				tokenCrossed = true;
			if(grid[i][column] == joueur)
				token++;
			else if(grid[i][column] == 0 && blank == "99")
				blank = new String(new String(i)+column);
			else {
				blank = new String("99")
				tokenCrossed = false;
				token = 0;
			}
			if(token >= 3 && tokenCrossed == true && blank == "99" && i-1 >= 0) {
				if(grid[i-1][column] == 0)
					return(new String(new String(i-1)+column));
			}
			if(token >= 3 && tokenCrossed == true && blank != "99")
				return(blank);
		}
		return(false);
	}

	function testDiagonalCould(line, column, joueur) {
		var token == 0;
		var tokenCrossed = false;
		var i = line;
		var y = column;
		var blank = new String("99");
		while(i > 0 && y > 0) {
			i--;
			y--;
		}
		while(i < 6 && y < 7) {
			if(i == line && y == column)
				tokenCrossed = true;
			if(grid[i][y] == joueur)
				token++;
			else if(grid[i][y] == 0 && blank == "99")
				blank = new String(new String(i)+y)
			else {
				blank = new String("99");
				tokenCrossed = false;
				token = 0;
			}
			if(token >= 3 && tokenCrossed == true && blank == "99" && i+1 < 6 && y+1 < 7) {
				if(grid[i+1][y+1] == 0)
					return(new String(new String(i+1)+(y+1)));
			}
			if(token >= 3 && tokenCrossed == true && blank != "99")
				return(blank);
			i++;
			y++;
		}
		i = line;
		y = column;
		token = 0;
		tokenCrossed = false;
		blank = new String("99");
		while(i > 0 && y < 7) {
			i--;
			y++;
		}
		while(i < 6 && y >= 0) {
			if(i == line && y == column)
				tokenCrossed = true;
			if(grid[i][y] == joueur)
				token++;
			else if(grid[i][y] == 0 && blank == "99")
				blank = new String(new String(i)+y)
			else {
				blank = new String("99");
				tokenCrossed = false;
				token = 0;
			}
			if(token >= 3 && tokenCrossed == true && blank == "99" && i+1 < 6 && y-1 >= 0) {
				if(grid[i+1][y-1] == 0)
					return(new String(new String(i+1)+(y-1)));
			}
			if(token >= 3 && tokenCrossed == true && blank != "99")
				return(blank);
			i++;
			y--;
		}
		return(false);
	}

	function couldWinTest(line, column, joueur) {
		joueur = (joueur == "IA")?(tour == 1)?2:1:(tour == 1)?1:2;
		var id = testLineCould(line, column, joueur);
		if(id != false)
			return(id);
		id = testColumnCould(line, column, joueur);
		if(id != false)
			return(id);
		id = testDiagonalCould(line, column, joueur);
		if(id != false)
			return(id);
		return(false);
	}

	function couldMultWin(joueur) {
		console.log("	in couldMultWin");
		var responseID;
		for(var y = 0; y < 7; y++) {
			if(columnIsFull(y) == false) {
				copyGrid("save");
				putToken(firstEmptyCase(y), y, joueur);
				responseID = couldWinTest(firstEmptyCase(y), y, joueur);
				if(responseID != false) {
					putToken((10*responseID[1]/10)+1, y, joueur);
					if(isOver() == 1 || isOver() == 2) {
						copyGrid("restore");
						putToken(firstEmptyCase(y), y, "IA");
						if(canWinTest("humain") != false)
							return(true);
					}
				}
				copyGrid("restore");
			}
		}
		return(false);
	}

	function canMultWin(joueur) {
		var enemy = (joueur == "humain")?"IA":"humain";
		var responseID;
		console.log("	in canMultWin for player "+joueur);
		for(var y = 0; y < 7; y++) {
			if(columnIsFull(y) == false) {
				copyGrid("save");
				console.log("		first putToken case = "+(firstEmptyCase(y)+1)+"-"+(y+1));
				putToken(firstEmptyCase(y), y, joueur);
				responseID = canWinTest(joueur);
				if(responseID != false) {
					console.log("		responseID[0] = "+responseID[0]+" && responseID[1] = "+responseID[1]);
					console.log("		firstEmptyCase(responseID[1]) = "+firstEmptyCase(responseID[1])+" && responseID[1] = "+responseID[1]+" && enemy = "+enemy);
					putToken(firstEmptyCase(responseID[1]), responseID[1], enemy);
					if(canWinTestSpe(joueur, responseID[2], responseID) != false) {
						copyGrid("restore");
						putToken(firstEmptyCase(y), y, "IA");
						if(canWinTest("humain") == false)
							return(true);
					}
				}
				copyGrid("restore");
			}
		}
		return(false);
	}

	function lineBigEnought(line, column) {
		var IA = (tour == 1)?2:1;
		var token == 0;
		var tokenCrossed = false;
		for(var y = 0; y < 7; y++) {
			if(y == column)
				tokenCrossed = true;
			if(grid[line][y] == IA || grid[line][y] == 0)
				token++;
			else {
				tokenCrossed = false;
				token = 0;
			}
			if(token >= 4 && tokenCrossed == true)
				return(true);
		}
		return(false);
	}

	function columnBigEnought(line, column) {
		var IA = (tour == 1)?2:1;
		var token == 0;
		var tokenCrossed = false;
		for(var i = 5; i >= 0; i--) {
			if(i == line)
				tokenCrossed = true;
			if(grid[i][column] == IA || grid[i][column] == 0)
				token++;
			else {
				tokenCrossed = false;
				token = 0;
			}
			if(token >= 4 && tokenCrossed == true)
				return(true);
		}
		return(false);
	}

	function diagonalBigEnought(line, column) {
		var IA = (tour == 1)?2:1;
		var token == 0;
		var tokenCrossed = false;
		var i = line;
		var y = column;
		while(i > 0 && y > 0) {
			i--;
			y--;
		}
		while(i < 6 && y < 7) {
			if(i == line && y == column)
				tokenCrossed = true;
			if(grid[i][y] == IA || grid[i][y] == 0)
				token++;
			else {
				tokenCrossed = false;
				token = 0;
			}
			if(token >= 4 && tokenCrossed == true)
				return(true);
			i++;
			y++;
		}
		i = line;
		y = column;
		token = 0;
		tokenCrossed = false;
		while(i > 0 && y < 7) {
			i--;
			y++;
		}
		while(i < 6 && y >= 0) {
			if(i == line && y == column)
				tokenCrossed = true;
			if(grid[i][y] == IA || grid[i][y] == 0)
				token++;
			else {
				tokenCrossed = false;
				token = 0;
			}
			if(token >= 4 && tokenCrossed == true)
				return(true);
			i++;
			y--;
		}
		return(false);
	}

	function align2() {
		console.log("	in align2");
		var bestPoss = new Array();
		var IA = (tour == 1)?2:1;
		for(var y = 0; y < 7; y++) {
			copyGrid("save");
			putToken(firstEmptyCase(y), y, "IA");
			bestPoss[y] = 0;
			if(canWinTest("humain") == false && findNbrNearToken(firstEmptyCase(y), y, IA) >= 1) {
				if(lineBigEnought(firstEmptyCase(y), y) == true || columnBigEnought(firstEmptyCase(y), y) == true || diagonalBigEnought(firstEmptyCase(y), y) == true)
					bestPoss[y] = findNbrNearToken(firstEmptyCase(y), y, IA);
			}
			copyGrid("restore");
		}
		var tampon = bestPoss[0];
		var tamponY = 0;
		for(var y = 0; y < 6; y++) {
			if(bestPoss[y] < bestPoss[y+1]) {
				tampon = bestPoss[y];
				bestPoss[y] = bestPoss[y+1];
				bestPoss[y+1] = tampon;
				tamponY = y;
			}
		}
		if(bestPoss[6] >= 1) {
			putToken(firstEmptyCase(y), y);
			return(true);
		}
		for(var y = 0; y < 7; y++) {
			copyGrid("save");
			putToken(firstEmptyCase(y), y, "IA");
			if(canWinTest("humain") == false) {
				if(lineBigEnought(firstEmptyCase(y), y) == true || columnBigEnought(firstEmptyCase(y), y) == true || diagonalBigEnought(firstEmptyCase(y), y) == true)
					return(true);
			}
			copyGrid("restore");
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
		else if(canMultWin("IA") == true) {console.log("in canMultWin(IA)");}
		else if(canMultWin("humain") == true) {console.log("in canMultWin(humain)");}
		else if(tryPattern("humain") == true) {console.log("in tryPattern(IA)");}
		else if(canCreatMulPoss("IA") == true) {console.log("in canCreatMulPoss(IA)");}
		else if(canCreatMulPoss("humain") == true) {console.log("in canCreatMulPoss(humain)");}
		else if(createPoss(2, "IA") == true) {console.log("in createPoss(2 IA)");}
		else if(createPoss(2, "humain") == true) {console.log("in createPoss(2 humain)");}
		else if(createPoss(1, "humain") == true) {console.log("in createPoss(1 humain)");}
		else if(tryPattern("IA") == true) {console.log("in tryPattern(IA)");}
		else if(createPoss(1, "IA") == true) {console.log("in createPoss(1 IA)");}
		else if(nextTo() == true) {console.log("in nextTo()");}
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
		console.log(grid);
		updateHTML();
		return(0);
	}

	function controller(monThis) {
		if(over == false) {
			var id = monThis.id;
			if(columnIsFull((id[2]*10/10)-1) == true){
				console.log("true");
				return(0);
			}
			putToken(firstEmptyCase((id[2]*10/10)-1), id[2] - 1, "humain");
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
