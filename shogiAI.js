//functions for the AI of the shogi





//given a position, lists all the legal moves the piece on square "from" can do
function getLegalMoves(position, from) {
    var piece = position[from.y][from.x];    
    var col = piece.col;
    var p = piece.p;
    //console.log("getLegalMoves: piece = " + p + " from.x = " + from.x + " from.y = " + from.y);
    var dir = getDirection(col);
    var dirVect = {x:1, y:dir};
    var acceptableSquare = function(move) {
        var x = move.to;
        console.log("acceptableSquare: x:");
        console.log(x);
        if(!inBoard(x)) {
            console.log("out of the board!");
            return false;
        }
        //console.log("acceptableSquare: x.to: = " + x.to["y"]);
        ////console.log("acceptableSquare: keys(x) = " + keys(x));
        var content = position[x.y][x.x];
        console.log("content: "); 
        console.log(content);
        return content === 0 || content.col !== col;
    };
    var extendDir = makeDirectionExtension(position, col, from);
    if(p === 0) {
        return [];
    }
    var res = [];
    if(p === "p") {
        var newY = from.y+dir;
        if(newY<0 || newY >=Nsquares) {
            //console.log("target out of the board..");
            return [];
        }
        var to = {x:from.x, y:newY};
        var target = position[to.y][to.x];
        if(target.col !== col) {
            //console.log("adding stuff to res");
            res.push({from:from, to:to});
        } else {
            //console.log("nothing added to res!");
        }
    }
    if(p === "n") {
        var newY = from.y + 2*dir;
        var newX1 = from.x + 1;
        var newX2 = from.x -1;
        if(dimOK(newY)) {
            if(dimOK(newX1)) {
                if(position[newY][newX1].col !== col) {
                    res.push({from:from, to:{x:newX1, y:newY}});    
                }
                
            }
            if(dimOK(newX2)) {
                if(position[newY][newX1].col !== col) {
                    res.push({from: from, to:{x:newX2, y:newY}});    
                }
                
            }
        }
    }
    if(p === "l" ) {
        var dirL = {
            x: 0, y: dir
        };
        var tmp, tmpSquare = add(from, dirL);
        while(dimOK(tmpSquare.y)){// && position[tmpSquare.y][tmpSquare.x].col !== col) {
            tmp = position[tmpSquare.y][tmpSquare.x];
            if(tmp === 0) {
                res.push({from: from, to: tmpSquare});
                tmpSquare = add(tmpSquare,dirL);
                continue;
            }
            if(tmp.col !== col) {
                res.push({from: from, to: tmpSquare});
            }
            break;
        }
    }
    if(p === "s") {
        console.log("silver");
        var dirs = dirsS.map(function(x) {return dotProd(x,dirVect);});
        console.log(dirs);
        var tmpSquares = dirs.map(function(x){return {from:from, to:add(x, from)};});
        console.log("tmpSquares: ");
        console.log(tmpSquares);
        var availableSquares = tmpSquares.filter(acceptableSquare);
        res = res.concat(availableSquares);
    }
    if(inArray(Golds,p)) {
        var dirs = dirsG.map(function(x) {return dotProd(x, dirVect);});
        var availableSquares = dirs.map(function(x) {return {from: from, to:add(x,from)};}).filter(acceptableSquare);
        res = res.concat(availableSquares);
    }
    if(p === "k") {
        var dirs = dirsK.map(function(x) {return dotProd(x, dirVect);});
        var availableSquares = dirs.map(function(x) {return {from:from, to:add(x,from)};}).filter(acceptableSquare);
        res = res.concat(availableSquares);
    }
    if(p === "r") {
        console.log("p = rook");
        var k,tmpDir,n=dirsStraight.length;
        for(k=0;k<n;k++) {
            res = res.concat(extendDir(dirsStraight[k]));
        }
        //var dirsFuncs = dirsStraight.map(function(x) {return makeDirectionExtension()) 
    }
    if(p === "b") {
        var k,tmpDir,n=dirsStraight.length;
        for(k=0;k<n;k++) {
            res = res.concat(extendDir(dirsDiag[k]));
        }
    }
    //console.log("res.length = " + res.length);
    return res;
}


//given a position and a list of pieces to drop, gives all the legal drops
function getAllLegalDrops(position, toDrop) {
    
}



//given a position, list all the legal moves that the color "colorToMove" can play
function getAllLegalMoves(position, toDrop,  colorToMove){
    var x,y,tmp,res = [];
    //get all the legal moves
    for(y = 0; y < Nsquares; y++) {
        for(x = 0; x < Nsquares; x++) {
            //console.log("getAllLegalMoves: x = " + x, " y = " + y);
            tmp = position[y][x];
            if(tmp !== 0) {
                if(tmp.col === colorToMove){
                    ////console.log("getAllLegalMoves: tmp = " + tmp);
                    res = res.concat(getLegalMoves(position,{x:x,y:y}));
                    //console.log("res.length = " + res.length);
                }    
            }
            
        }
    }
    //get all the legal drops

    //and finally
    return res;
}


//AI that simply picks a move randomly...
function dumbAI() {
    var moves = getAllLegalMoves(position, undefined, Color);
    var n = moves.length;
    var moveNum = Math.floor(n*Math.random());
    var move = moves[moveNum];
    //console.log("moveNum: " + moveNum + " move.from.x = " + move.from.x );
    updatePosition(move.from, move.to);
}


function generateTree(pos, toDrop, color,depth) {
    console.log("generateTree: depth = "+depth);
    var moves = getAllLegalMoves(pos, toDrop, color);
    var res = new Arboreal();
    var nMoves = moves.length;
    var i;
    for(i=0; i<nMoves; i++){
        res.appendChild();
        res.children[i].data = moves[i];
        if(depth > 0) {
            
            res.children[i].appendChild();
            var moveToBePlayed = moves[i];
            console.log("moveToBePlayed:");
            console.log(moveToBePlayed);
            console.log("pos:");
            console.log(pos);
            var piece = pos[moveToBePlayed.from.y][moveToBePlayed.from.x];
            console.log("piece:");
            console.log(piece);
            if(piece ===0 ) {
                
                continue;
            }
           
            var tmp = makeMove(pos,toDrop,moves[i].from, moves[i].to,undefined, undefined);
            
            console.log("successfully called function makeMove!");
            res.children[i].children = generateTree(tmp.position, tmp.toDrop,changeColor(color),depth-1);
        }
    }
    return res;
}

//min-max algorithm
function minMax(position,color,depth,evalFunc) {
    var moves = getAllLegalMoves(position, undefined, color);
    for(move in moves) {
        
    }
}