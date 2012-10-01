Nsquares = 9;
Pieces = ["p","l","n","s","g","k","b","r","pl","pn","ps","t","d","h"];
PromotablePieces = ["p","l","n","s","b","r"];
PromotedPieces = ["pl","pn","ps","t","h","d"];
OneDirPieces = ["p", "l", "n"];

bl = {
    p:"l",col:"b"
};
bn = {
    p:"n", col:"b"
};
bs = {
    p:"s", col:"b"
};
bg = {
    p:"g",col:"b"
};
bk = {
    p:"k",col:"b"  
};
bb = {
    p:"b", col:"b"
};
br = {
    p:"r", col:"b"
};
bp = {
    p:"p", col:"b"
};


rl = {
    p:"l",col:"r"
};
rn = {
    p:"n", col:"r"
};
rs = {
    p:"s", col:"r"
};
rg = {
    p:"g",col:"r"
};
rk = {
    p:"k",col:"r"  
};
rb = {
    p:"b", col:"r"
};
rr = {
    p:"r", col:"r"
};
rp = {
    p:"p", col:"r"
};


InitPosition = [[bl,bn,bs,bg,bk,bg,bs,bn,bl],
                [0,br,0,0,0,0,0,bb,0],
                [bp,bp,bp,bp,bp,bp,bp,bp,bp],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [rp,rp,rp,rp,rp,rp,rp,rp,rp],
                [0,rb,0,0,0,0,0,rr,0],
                [rl,rn,rs,rg,rk,rg,rs,rn,rl]];

ToDrop = {
    b:{p:0,l:0,n:0,s:0,g:0,b:0,r:0},
    r:{p:0,l:0,n:0,s:0,g:0,b:0,r:0}
};

//tells whether a piece *has* to promote
function hasToPromote(piece, to) {
    if(!inArray(OneDirPieces,piece.p)) {
        console.log("not a one direction piece...");
        return false;
    }
    if(inArray(["p","l"],piece.p) && to.y === lastRow(piece.col)) {
        return true;
    }
    if(piece.p === "n" && inArray(lastRows(piece.col,2))) {
        return true;
    }
    return false;
}

//tells whether a piece can promote
function canPromote(piece, from, to) {
    if(!inArray(PromotablePieces,piece.p)) {
        return false;
    }
    var promotionZone = lastRows(piece.col, 3);
    return inArray(promotionZone,to.y) || inArray(promotionZone, from.y);
}

//return the promoted version of a piece
function promote(piece) {
    var p = piece.p;
    var col = piece.col;
    var promoted;
    if(p === "p") {
        promoted = "t";
    }
    if(p === "l") {
        promoted = "pl";
    }
    if(p === "n") {
        promoted = "pn";
    }
    if(p === "s") {
        promoted = "ps";
    }
    if(p === "b") {
        promoted = "h";
    }
    if(p === "r") {
        promoted = "d";
    }
    return {
      p:promoted, col:col  
    };
}

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
function add(v1,v2) {
    var res = {
        x:v1.x + v2.x,
        y:v1.y+v2.y
    };
    return res;
}

//tells if two squares are the same or not
function eq(v1, v2) {
    return v1.x === v2.x && v1.y === v2.y;
}

//tells if a square (represented by the coordinates [x,y]) belongs to the board
function isInBoard(square) {
    var x,y;
    x = square.x;
    y = square.y;
    return 0<x && x < nSquares && 0<y && y<nSquares;
}

function getPiece(position,square) {
    var x = square.x;
    var y = square.y;
    console.log("x = " + x, " y = " + y);
    return position[y][x];
}

//returns all the square from where a piece "piece" of color "color" controls the square [x][y] (on an empty board).
function reverseMove(x,y,piece,color) {
    var dir;
    var initSquare = {x:x,y:y};
    var bishopDir = [{x:-1,y:1},{x:-1,y:-1},{x:1,y:1},{x:1,y:-1}];
    var rookDir = [{x:-1,y:0},{x:1,y:0},{x:0,y:-1},{x:0,y:1}];
    if(color === "b") {
        dir = 1;
    }
    else {
        dir = -1;
    }
    if(piece === "p") {
        var newY = y-dir;
        if(newY > 0 && newY < nSquares) {
            return [[{x:x,y:newY}]];
        }
        return [];
    } else if(piece === "l") {
        var res = [];
        var k = 1;
        while(y+k*dir>0 && y+k*dir<nSquares) {
            res.push({x:x,y:y+k*dir});
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
            d1.push({x:x+1,y:newY});
        }
        if(x-1>0) {
            d2.push({x:x-1,y:newY});
        }
        return [d1,d2];
    } else if (piece === "s") {
        var silverDirs = [{x:-1,y:-dir},{x:1,y:-dir},{x:-1,y:dir},{x:0,y:dir},{x:1,y:dir}];
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
        var goldDir = [{x:0,y:-dir},{x:-1,y:0},{x:1,y:0},{x:-1,y:dir},{x:0,y:dir},{x:1,y:dir}];
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
        //var bishopDir = [[-1,1],[-1,-1],[1,1],[1,-1]];
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
        var horseDir = [{x:-1,y:0},{x:1,y:0},{x:0,y:-1},{x:0,y:1}];
        for(hd in horseDir) {
            newSquare = add(initSquare,hd);
            if(isInBoard(newSquare)) {
                res.push([newSquare]);
            }
        }
        return res;
    } else if(piece === "d") {

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
        var dragonDir = [{x:-1,y:-1},{x:-1,y:1},{x:1,y:-1},{x:1,y:1}];
        for(dd in dragonDir) {
            newSquare = add(initSquare, dd);
            if(isInBoard(newSquare)) {
                res.push([newSquare]);
            }
        }
        return res;
    } else if(piece === "k") {
        var kingDir = [{x:-1,y:-1},{x:-1,y:0},{x:-1,y:1},{x:0,y:1},{x:1,y:1},{x:1,y:0},{x:1,y:-1},{x:0,y:-1}];
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

//ensures there is no piece between the squares "from" and "to"
function checkNoGoThrough(from,to) {
    var dir = {
        x:sign(to.x-from.x),
        y:sign(to.y-from.y)
    };
//    var tmpX = from.x, tmpY =from.y;
    var tmp = add(from,dir);
    //alert("tmpX = " + tmpX + ", tmpY = " + tmpY + " , nx = "+ nx + " , ny = "+ny );
    //document.getElementById("debugInfo").innerHTML = "ox = "+ ox+ ", dir = "+dir;
    //var ex = to.x  - dir.x, ey = ny - dir[1];
    while(!eq(tmp,to)) {
        if(position[tmp.y][tmp.x] !== 0) {
            return false;
        }
        tmp = add(tmp,dir);
    }
    return true;//checkNotSameColorPiece(piece, nx,ny);
}

function lastRow(color) {
    if(color === "b") {
        return 8;
    }
    return 0;
}

function lastRows(color,n) {
    var init, step;
    if(color === "r" ) {
        init = 0;
        step = 1;
    } else {
        init = 8;
        step = -1;
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

//given the position initPosition, ensure that droping the piece "piece" on the square "to" is legal
function checkDropValidity(initPosition,to,color,toDrop,piece) {
    if(initPosition[to.y][to.x] !== 0) {
        return false;
    }
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
        //ensure there is no pawn of the same color on the column of the drop
        var k,tmp; 
        for(k=0;k<nSquares;k++) {
            tmp = InitPosition[k][to.x];
            if(tmp === 0) {
                continue;
            }
            if(tmp.col === piece.col && tmp.p === "p") {
                return false;
            }
        }
        return !checkMating();
    }
    return true;
}

function getDirection(color) {
    if(color === "r") {
        return -1;
    }
    return 1;
}

//return true if a move is legal, false otherwise
function checkMoveValidity(initPosition, from, to) {
    console.log("checkMoveValidity: from = " + from + " to = " + to);
    var  piece;
    piece = getPiece(initPosition, from);
    var dir = getDirection(piece.col);
    if(piece.col !== Color) {
        alert("not your turn");
        return false;
    }
    //if(piece.col === "r" ) {
       // dir = -1;
    //}
    if(initPosition[to.y][to.x] === Color) {
        return false;
    }
    if(piece.p === "p") {
        return (from.x === to.x )&& ((to.y-from.y) === dir);
    }
    if(piece.p === "l") {
        return (from.x === to.x) && (sign(to.y - from.y) === dir) && checkNoGoThrough(from, to);
    }
    if(piece.p ==="n") {
        console.log("from.x= " + from.x+ " from.y = "+ from.y + " to.x " + to.x + " to.y = " + to.y + " dir = " + dir);
        var res = (abs(from.x - to.x)===1) && ((to.y-from.y)===2*dir);
        var r1, r2;
        r1 = (to.y-from.y)===2*dir;
        r2 = abs(from.x - to.x)===dir;
        console.log("(to.y-from.y)===2*dir: " + r1);
        console.log("abs(from.x - to.x)===dir: " + r2);
        console.log("res = " + res);
        return res;
    }
    if(piece.p === "s") {
        return ((abs(to.x-from.x)===1 && abs(to.y-from.y)===1) || (to.y-from-y===dir && to.x===from.x));
    }
    if(inArray(["g","ps","t","pn","pl"],piece.p)) {
        return (abs(to.x-from.x) + abs(to.y-from.y) === 1) || (abs(to.x-from.x)===1 && to.y-from.y===dir);
    }
    if(piece.p=== "r") {
        return (from.x === to.x || from.y === to.y) && checkNoGoThrough(from, to);
    }
    if(piece.p === "b") {
        console.log("checking for bishop move");
        console.log("to = " + to + " from = " + from);
        console.log("to.x = " + to.x );
        var moveOK = abs(to.x - from.x) === abs(to.y - from.y);
        if(!moveOK) {
            alert("illegal move!");
        }
        return moveOK && checkNoGoThrough(from, to);
    }
    if(piece.p === "k") {
        return abs(to.x - from.x) <= 1 && abs(to.y-from.y)<=1;
    }
    if(piece.p === "h") {
        return (abs(to.x - from.x) <= 1 && abs(to.y-from.y)<=1)||((abs(to.x - from.x) === abs(to.y - from.y)) && checkNoGoThrough(from, to));
    }
    if(piece.p === "d") {
        return (abs(to.x - from.x) <= 1 && abs(to.y-from.y)<=1)||((from.x === to.x || from.y === to.y) && checkNoGoThrough(from,to));
    }
    return false;
}

//returns the non-promoted version of a piece
function getOriginalPiece(piece) {
    if(inArray(["p","l","n","s","g","r","b"],piece)) {
        return piece;
    }
    if(piece === "t") {
        return "p";
    }
    if(piece === "pl") {
        return "l";
    }
    if(piece === "pn") {
        return "n";
    }
    if(piece === "ps") {
        return "s";
    }
    if(piece === "h") {
        return "b";
    }
    if(piece === "d") {
        return "r";
    }
    return undefined;
}

//just makes a move, without worrying about its legality
function makeMove(initPosition, toDrop, from, to, drop, piece) {
    var newPosition = initPosition;
    var newToDrop = toDrop;
//    var color = piece.col;
    console.log("makeMove: piece = " + piece);
    if(drop === undefined) {
        //in this case: no drop
        piece = initPosition[from.y][from.x];
        color = piece.col;
        if(hasToPromote(piece, to)) {
            piece = promote(piece);
        } else if(canPromote(piece, from, to)) {
            var promotion = confirm("Promote piece?");
            if(promotion) {
                piece = promote(piece);
            }
        }
        if(initPosition[to.y][to.x] !==0) {
            //in this case a piece is been captured...
            var captured = initPosition[to.y][to.x].p;
            var newPiece = getOriginalPiece(captured);
            newToDrop[color][newPiece]++;
        }
        newPosition[from.y][from.x] = 0;
    } else {
        console.log("makeMove: piece = " + piece);
        newToDrop[Color][piece.p]--;
        newPosition[to.y][to.x] = piece;
    }
    newPosition[to.y][to.x] = piece;    
    console.log("initPosition[to.y][to.x] = " + initPosition[to.y][to.x]);
//    if(initPosition[to.y][to.x] !== 0) {
//        var captured = initPosition[to.y][to.x];
//        newToDrop[color][captured.p]++;
//    }
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

//given a move (from square "from" to square "to") or a drop (of piece "piece"), update the current position.
function updatePosition(from, to, drop, piece) {
    var res = makeMove(position, ToDrop, from, to, drop, piece);
    position = res.position;
    ToDrop = res.toDrop;
}