Nsquares = 9;
Pieces = ["p","l","n","s","g","k","b","r","pl","pn","ps","t","d","h"];


//checks that there is no pieces between the squares (ox,oy) and (nx,ny)
function inArray(arr, obj) {
    return arr.indexOf(obj) !== -1;
}

//returns the sign of x
function sign(x) {
    var res = x? x<0? -1:1:0;
    return res;
}

//returns the absolute value of x
function abs(x) {
    if(x<0) {
        return -x;
    }
    return x;
}

function getOppositeColor(color) {
    if(color === "b") {
        return "r";
    }
    return "b";
}

//addition for vectors. x and y need to have the same length
function add(x,y) {
    var n = x.length;
    if(y.length !== n) {
        return undefined;
    }
    var i, res = [];
    for(i=0;i<n;i++) {
        res.push(x[i]+y[i]);
    }
    return res;
}

//tells if a square (represented by the coordinates [x,y]) belongs to the board
function isInBoard(square) {
    var x,y;
    x = square[0];
    y = square[1];
    return 0<x && x < nSquares && 0<y && y<nSquares;
}

//returns all the square from where a piece "piece" of color "color" controls the square [x][y] (on an empty board).
function reverseMove(x,y,piece,color) {
    var dir;
    var initSquare = [x,y];
    if(color === "b") {
        dir = 1;
    }
    else {
        dir = -1
    }
    if(piece === "p") {
        var newY = y-dir;
        if(newY > 0 && newY < nSquares) {
            return [[[x,newY]]];
        }
        return [];
    } else if(piece === "l") {
        var res = [];
        var k = 1;
        while(y+k*dir>0 && y+k*dir<nSquares) {
            res.push([x,y+k*dir]);
            k++;
        }
        return [res];
    } else if(piece === "n") {
        var newY = y + 2*dir;
        if(newY<0 || newY >= nSquares) {
            return [];
        }
        var d1 =[];
        var d2 = [];
        if(x+1<nSquares) {
            d1.push([x+1,newY])
        }
        if(x-1>0) {
            d2.push([x-1,newY]);
        }
        return [d1,d2];
    } else if (piece === "s") {
        var silverDirs = [[-1,-dir],[1,-dir],[-1,dir],[0,dir],[1,dir]];
        var newSquare;
        res = [];
        for(sd in silverDirs) {
            newSquare = add(initSquare, sd);
            if(isInBoard(newSquare)) {
                res.push([newSquare]);
            }
        }
        return res;
    } else if(inArray(["g","pl","pn","ps","t"],piece)) {
        var goldDir = [[0,-dir],[-1,0],[1,0],[-1,dir],[0,dir],[1,dir]];
        var newSquare;
        var res = [];
        for(gd in goldDir) {
            newSquare = add(initSquare,sd);
            if(isInBoard(newSquare)) {
                res.push([newSquare]);
            }
        }            
        return res;
    } else if(piece === "b") {
        var bishopDir = [[-1,1],[-1,-1],[1,1],[1,-1]];
        var newSquare;
        var newDir;
        var res = [];
        for(bd in bishopDir) {
            newDir = [];
            newSquare = add(bd,initSquare);
            while(isInBoard(newSquare)) {
                newDir.push(newSquare);
                newSquare = add(newSquare,bd);
            }
            res.push(newDir);
        }
        return res;
    } else if(piece === "r") {
        var rookDir = [[-1,0],[1,0],[0,-1],[0,1]];
        var newSquare;
        var newDir;
        var res = [];
        for(rd in rookDir) {
            newDir = [];
            newSquare = add(rd, initSquare);
            while(isInBoard(newSquare)) {
                newDir.push(newSquare);
                newSquare = add(newSquare,rd);
            }
            res.push(newDir);
        }
        return res;
    } else if(piece === "h") {
        var bishopDir = [[-1,1],[-1,-1],[1,1],[1,-1]];
        var newSquare;
        var newDir;
        var res = [];
        for(bd in bishopDir) {
            newDir = [];
            newSquare = add(bd,initSquare);
            while(isInBoard(newSquare)) {
                newDir.push(newSquare);
                newSquare = add(newSquare,bd);
            }
            res.push(newDir);
        }
        var horseDir = [[-1,0],[1,0],[0,-1],[0,1]];
        for(hd in horseDir) {
            newSquare = add(initSquare,hd);
            if(isInBoard(newSquare)) {
                res.push([newSquare]);
            }
        }
        return res;
    } else if(piece === "d") {
        var rookDir = [[-1,0],[1,0],[0,-1],[0,1]];
        var newSquare;
        var newDir;
        var res = [];
        for(rd in rookDir) {
            newDir = [];
            newSquare = add(rd, initSquare);
            while(isInBoard(newSquare)) {
                newDir.push(newSquare);
                newSquare = add(newSquare,rd);
            }
            res.push(newDir);
        }
        var dragonDir = [[-1,-1],[-1,1],[1,-1],[1,1]];
        for(dd in dragonDir) {
            newSquare = add(initSquare, dd);
            if(isInBoard(newSquare)) {
                res.push([newSquare]);
            }
        }
        return res;
    } else if(piece === "k") {
        var kingDir = [[-1,-1],[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1]];
        var newSquare;
        res = [];
        for(kd in kingDir) {
            newSquare = add(initSquare, kd);
            if(isInBoard(newSquare)) {
                res.push([newSquare]);
            }
        }
        return res;
    } 
    return undefined;
    
}

function checkNoGoThrough(ox,oy,nx,ny) {
    var dir = [sign(nx - ox),sign( ny - oy)];
    var tmpX = ox, tmpY =oy;
    //alert("tmpX = " + tmpX + ", tmpY = " + tmpY + " , nx = "+ nx + " , ny = "+ny );
    //document.getElementById("debugInfo").innerHTML = "ox = "+ ox+ ", dir = "+dir;
    var ex = nx  - dir[0], ey = ny - dir[1];
    while(tmpX !== ex || tmpY !== ey) {
	//alert("inside while");
	tmpX = tmpX+dir[0];
	tmpY = tmpY+dir[1];
	//alert(board[tmpX][tmpY]);
	
	
	if(board[tmpY][tmpX] !== 0) {
	    document.getElementById("debugInfo").innerHTML ="tmpX = " + tmpX +  ", board[tmpX][tmpY] = "+ board[tmpY][tmpX]+", tmpY= "+tmpY+", dir = " + dir+", ex = " + ex + ", ey = " +ey+ ", oy = " + oy+ ", ny = " + ny;
	    return false;
	}
    }
    var piece = board[oy][ox];
    return true;//checkNotSameColorPiece(piece, nx,ny);
}

function lastRow(color) {
    if(color === "b") {
        return 0;
    }
    return 8;
}

function lastRows(color,n) {
    var init, step;
    if(color === "b" ) {
        init = 8;
        step = -1;
    } else {
        init = 0;
        step = 1;
    }
    res = [];
    for(i=0;i<n;i++) {
        res.push(init+i*step);
    }
    return res;
}

function checkMating() {
    return false;
}

function checkDropValidity(initPosition,to,color,toDrop,piece) {
    if(!inArray(["n","l","p"],piece.p)) {
        return true;
    }
    if(piece.p === "l") {
        return to.y === lastRow(piece.col);
    }
    if(piece.p === "n") {
        return inArray(lastRows(piece.col,2),to.y);
    }
    if(piece.p === "p") {
        if(to.y === lastRow(piece.col)) {
            return false;
        }
        return !checkMating();
    }
}

//return true if a move is legal, false otherwise
function checkMoveValidity(initPositionm, from, to, color, piece ) {
    var dir = 1;
    if(color === "b" ) {
        dir = -1;
    }
    if(piece.p === "p") {
        return (from.x === to.x )&& ((to.y-from.y) === dir);
    }
    if(piece.p === "l") {
        return (from.x === to.x) && (sign(to.y - from.y) === dir);
    }
    if(piece.p ==="n") {
        return (abs(from.x - to.x)===dir) && ((to.y-from.y)===2*dir);
    }
    if(piece.p === "s") {
        return ((abs(to.x-from.x)===1 && abs(to.y-from.y)===1) || (to.y-from-y===dir && to.x===from.x));
    }
    if(inArray(["g","ps","t","pn","pl"],piece.p)) {
        return (abs(to.x-from.x) + abs(to.y-from.y) === 1) || (abs(to.x-from.x)===1 && to.y-from.y===dir);
    }
    if(piece.p=== "r") {
        return (from.x === to.x || from.y === to.y);
    }
    if(piece.p === "b") {
        return abs(to.x - from.x) === abs(to.y - from.y);
    }
    if(piece.p === "k") {
        return abs(to.x - from.x) <= 1 && abs(to.y-from.y)<=1;
    }
    if(piece.p === "h") {
        return (abs(to.x - from.x) <= 1 && abs(to.y-from.y)<=1)||(abs(to.x - from.x) === abs(to.y - from.y));
    }
    if(piece.p === "d") {
        return (abs(to.x - from.x) <= 1 && abs(to.y-from.y)<=1)||(from.x === to.x || from.y === to.y);
    }
}

//just makes a move, without worrying about its legality
function makeMove(initPosition, toDrop, from, to, drop, piece) {
    var newPosition = initPosition;
    var newToDrop = toDrop;
    if(!drop) {
        newPosition[from.y][from.x] = 0;

    } else {
        newToDrop[color][piece.p]--;
    }
    newPosition[to.y][to.x] = piece;    
    if(initPosition[to.y][to.x] !== 0) {
        var captured = initPosition[to.y][to.x];
        newToDrop[color][captured.p]++;
    }
    var res = {position: newPosition, toDrop: newToDrop};
    return res;
}

//look for piece = {col = color, p = pieceKind}, and returns the coordinates of the square where the piece is. If not found, returns undefined.
function findPiece(position, piece) {
    var i,j,tmp;
    for(j=0;j<nSquares;j++) {
        for(i=0;i<nSquares;i++) {
            tmp = position[j][i];
            if(tmp === 0) {
                continue;
            }
            if(tmp.p === piece.p && tmp.col === piece.col) {
                return [j,i];
            }
        }
    }
    return undefined;
}
x
//return true if the king of the side "color" is attacked, false otherwise
function isCheck(position,color) {
    var king = {
        p:"k",
        col:color
    };
    var kingSquare = findPiece(position, king);
    var xK,yK;
    xK = kingSquare[1];
    yK = kingSquare[0];
    var oppColor = getOppositeColor(color);
    //for all kind of piece available, check if one of this kind is attacking the king
    var square;
    var dir, dirs;
    var x,y;
    var tmp;
    for(piece in Pieces) {
        if(inArray(["pn","pl","ps","t"],piece)) {
            continue;
        }
        if(piece === "g") {
            dirs = reverseMove(xK,yK,piece,oppColor);
            for(dir in dirs) {
               for(square in dir) {
                   x = square[0];
                   y = square[1];
                   tmp = position[y][x];
                   if(tmp === 0) {
                       continue;
                   }
                   if(tmp.col === oppColor && inArray(["g","pn","pl","ps","t"],piece)) {
                       return true;
                   }
                   break;
               } 
            }
        } else {
            dirs = reverseMove(xK,yK,piece,oppColor);
            for(dir in dirs) {
               for(square in dir) {
                   x = square[0];
                   y = square[1];
                   tmp = position[y][x];
                   if(tmp === 0) {
                       continue;
                   }
                   if(tmp.col === oppColor && tmp.p === piece) {
                       return true;
                   }
                   break;
               } 
            }
        }
    }
    return false;
}

//from init position, tells whether the move from case from to case to is valid. If it's a drop, from should be the piece that is dropped.
function validateMove(initPosition, toDrop, from, to, color,piece) {
    if(piece.col !== color) {
        return false;
    }
    if(from === undefined) {
        return checkDropValidity(initPosition, to, color, toDrop);
    }
    return true;
}
