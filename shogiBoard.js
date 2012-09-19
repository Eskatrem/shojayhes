Pieces = {"k": "k",
	  "r": "r",
	  "b": "b",
	  "g": "g",
	  "s": "s",
	  "n": "n",
	  "l": "l",
	  "p": "p",
	  "d": "d",
	  "h": "h",
	  "ps": "ps",
	  "pn": "pn",
	  "pl": "pl",
	  "t": "t"}; //a tokin is a promoted pawn...

Colors = {"b": -1,
	  "r": 1};

Color = -1;

ToDrop = {b:{g:0,s:0,l:0,n:0,r:0,b:0,p:0},
	  r:{g:0,s:0,l:0,n:0,r:0,b:0,p:0}};

width = 60;

init = 50;

textH = 20;

startX= 50;
startY= 50;


//tells if y is the last row (depends on the color) - rows go from 0 to 8
function isLastRow(y, color) {
    if(color === "b") {
        return y === 0;
    }
    return y === 8;
}

//deletes all the pieces to drop (depends on the color)
function eraseToDrop(color) {
    var y = 600;
    if(color === "b") {
        y = 20;
    }
    var i = 0;
    var tmpPiece;
    var tmpText;
    while(paper.getElementsByPoint(init+i*width,y).length > 0) {
        tmpPiece = paper.getElementsByPoint(init+i*width,y)[0];
        tmpText = paper.getElementsByPoint(init+i*width,y+textH)[0];
        tmpPiece.remove();
        tmpText.remove();
        i++;
    }
}

//creates a function that will handle a drop event
function makeDrop(piece,color) {
    var res = function() {
        console.log("inside drop!");        
	if(this.attr("x") === NaN || this.attr("y") === NaN) {
            return;
        }
        squareX = coordToSquare(this.attr("x"));
	squareY = coordToSquare(this.attr("y"));
    
        console.log("squareX = " + squareX + " squareY = " + squareY);
        var col=1;
        if(color === "b") {
            col = -1;
        }
        var dropCorrect = true;
        //ensure the square is empty
        if(!(0<=squareX && squareX < 9 && 0 <= squareY && squareY<9)) {
            dropCorrect = false;
        }
        else if(board[squareY][squareX]!==0) {
            dropCorrect = false;
        } else if(piece === "p" || piece === "l") {
            if(isLastRow(squareY,color)) {
                dropCorrect = false;
            } else if(piece === "p") {
                //ensure that there is no pawn on the same column
                for(i = 0; i <9;i++) {
                    if(board[i][squareX]=== ["p",col]) {
                        dropCorrect = false;
                        break;
                    }
                }
                //TODO: ensure we are not checkmating the king with that pawwn drop
            }
        }
        if(dropCorrect) {
            board[squareY][squareX] = [piece,Color];
            //this.attr({x:sqToCoord(squareX), y:sqToCoord(squareY)});
            makePiece([piece,Color],paper,sqToCoord(squareX),sqToCoord(squareY));
            ToDrop[color][piece]--;
            eraseToDrop(color);
            drawToDrop(toDrop[color],color);
            
        }
    };
    return res;
}

//puts a piece in the "toDrop" zone, and produces the UI functionnalities associated (function to handle a drop, etc.)
function makePieceToDrop(color,piece, count,n,paper) {
//    alert("piece to drop: " + piece);
    var h;
    //var init = 50;
    if(color === "b") {
        h=20;
    }else {
        h = 600;
    }
    var y = h;
    var x = init+n*width;
    console.log("h = " +h +"x = " + x);
    var drop = makeDrop(piece);
    var startDrop = makeStartDrop(x,y);
    var p = paper.text(x,y,"text").attr({text:piece, cursor:"move"});
    p.drag(startDrop, move, drop);
    paper.text(x,y+20,"text").attr({text:count});
}

//draws the pieces that are to be dropped on the board
function drawToDrop(toDrop,color){
    var count = 0;
    for(piece in toDrop) {
        if(toDrop[piece]!==0) {
            makePieceToDrop(color,piece,toDrop[piece],count,paper);
            count++;
        }
    }
}

//returns the sign of x
function sign(x) {
    var res = x? x<0? -1:1:0;
    return res;
}

//draw the board. paper is a Raphael canvas
function drawBoard(paper) {
    //var paper = Raphael(10,50,700,700);
    //var width = 60;
    //var length = 60;
     //draw 9*9 squares...
    //var i,j;
    for(i=0; i<9;i++) {
	for(j=0; j<9;j++) {
	    paper.rect(startX+i*width, startY+j*width,width,width);
	}
    }
}

//returns the initial position
function initBoard() {
    //initial position
    var board = [[[Pieces.l,Colors.r],[Pieces.n, Colors.r],[Pieces.s,Colors.r],[Pieces.g,Colors.r],[Pieces.k,Colors.r],[Pieces.g,Colors.r],[Pieces.s,Colors.r],[Pieces.n,Colors.r],[Pieces.l,Colors.r]],
		 [0,[Pieces.r,Colors.r],0,0,0,0,0,[Pieces.b,Colors.r],0],
		 [[Pieces.p,Colors.r],[Pieces.p,Colors.r],[Pieces.p,Colors.r],[Pieces.p,Colors.r],[Pieces.p,Colors.r],[Pieces.p,Colors.r],[Pieces.p,Colors.r],[Pieces.p,Colors.r],[Pieces.p,Colors.r]],
		 [0,0,0,0,0,0,0,0,0],
		 [0,0,0,0,0,0,0,0,0],
		 [0,0,0,0,0,0,0,0,0],
		 [[Pieces.p,Colors.b],[Pieces.p,Colors.b],[Pieces.p,Colors.b],[Pieces.p,Colors.b],[Pieces.p,Colors.b],[Pieces.p,Colors.b],[Pieces.p,Colors.b],[Pieces.p,Colors.b],[Pieces.p,Colors.b]],
		 [0,[Pieces.b,Colors.b],0,0,0,0,0,[Pieces.r,Colors.b],0],
		 [[Pieces.l,Colors.b],[Pieces.n, Colors.b],[Pieces.s,Colors.b],[Pieces.g,Colors.b],[Pieces.k,Colors.b],[Pieces.g,Colors.b],[Pieces.s,Colors.b],[Pieces.n,Colors.b],[Pieces.l,Colors.b]]
		];
    return board;
}


//converts a square to coordinates
function sqToCoord(x) {
    var forCenter = 0;
    var start = 80;
    return forCenter + start + x*width;
}

//converts coordinate into square
function coordToSquare(x) {
    //var start = 50;
    //var width = 60;
    return Math.floor((x-init)/width);
}

//when a piece is captured, this function adds it into the ToDrop variable
function updateToDrop(col, capturedPiece) {
	if(capturedPiece === Pieces.p || capturedPiece === Pieces.t) {
	    ToDrop[col].p++; 
	} else if(capturedPiece === Pieces.s || capturedPiece === Pieces.ps) {
	    ToDrop[col].s++;
	} else if(capturedPiece === Pieces.n || capturedPiece === Pieces.pn) {
	    ToDrop[col].n++;
	} else if(capturedPiece === Pieces.l || capturedPiece === Pieces.pl) {
	    ToDrop[col].l++;
	} else if(capturedPiece === Pieces.g) {
	    ToDrop[col].g++;
	} else if(capturedPiece === Pieces.r || capturedPiece === Pieces.d) {
	    ToDrop[col].r++;
	} else if(capturedPiece === Pieces.b || capturedPiece === Pieces.h) {
	    ToDrop[col].b++;
	}
    
}

//after a move is played, update the variable "board" accordingly
function updateBoard(ox, oy, nx, ny) {
    var piece = board[oy][ox];
    console.log("  ");
    console.log("piece =" + piece);
    //alert(piece);
    //document.getElementById("debugInfo").innerHTML = 
    //alert("sqToCoord(nx) = " + sqToCoord(nx)+ ", sqToCoord(ny) = " + sqToCoord(ny));
    var elts = paper.getElementsByPoint(sqToCoord(nx),sqToCoord(ny));
    var tmp = null;
    //alert(elts.length);
    console.log("elts.length ==="+ elts.length);
    if(elts.length === 2) {   
        
	tmp = elts[1];
        
    }
    
    if(tmp !== null) {
        console.log("tmp !== null");
	if(piece[1] === 1) {
	    var col = "b";
	} else {
	    var col = "r";
	}
	//handle promotion here: add the piece corresponding to tmp to the toDrop list
	var capturedPiece = board[ny][nx][0];
        var capturedColor = board[ny][nx][1];
	console.log("capturedPiece = " +capturedPiece);
        updateToDrop(col,capturedPiece);
        eraseToDrop(col);
        drawToDrop(ToDrop[col],col);
        //alert("color = " + piece[1]);
        //alert("about to remove a piece...");
        console.log("capturedColor = " + capturedColor);
        if(capturedColor===-Color) {
            //alert("removing captured piece...");
            tmp.remove();    
        }
	
    }
    board[ny][nx] = piece;
    board[oy][ox]=0;
}

//checks if the piece in square (nx,ny) is of the color 'color'
function checkNotSameColorPiece(color, nx, ny) {
    var end = board[ny][nx];
    return !end || (color  !== end[1]);
}

//checks that there is no pieces between the squares (ox,oy) and (nx,ny)
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


//returns a function that validates the moves of a piece
function makeValidMoveFct(piece, color) {
    if(piece === Pieces.p) {
	var res = function(ox,oy,nx,ny) {
	    //alert(board[0][0]);
            console.log("ox = " + ox +" oy = " + oy + "nx = " + nx +" +ny = " + ny);
            console.log(" ny - oy = " +(ny-oy));
            console.log("color = " + color);
	    var moveOK = (ny-oy)===color&&nx===ox;
	    return moveOK && checkNotSameColorPiece(color, nx, ny);
	};
    }else if(piece ===Pieces.l) {
	var res = function(ox,oy,nx,ny) {
	    var moveOK = (nx===ox && (ny-oy)*color > 0);
	    return moveOK && checkNoGoThrough(ox,oy,nx,ny) && checkNotSameColorPiece(color, nx, ny);
	};
    }else if(piece === Pieces.n) {
	var res = function(ox,oy,nx,ny) {
	    var moveOK = Math.abs(nx-ox)===1 && (ny-oy)*color === 2;
	    return moveOK && checkNotSameColorPiece(color, nx, ny);
	};
    } else if(piece === Pieces.s) {
	var res = function(ox,oy,nx,ny) {
	    var moveOK = ((Math.abs(ox - nx) === 1) && (Math.abs(oy-ny) ===1))
		   ||(nx === ox && ny - oy === color);
	    return moveOK && checkNotSameColorPiece(color, nx, ny);
	};
    } else if(piece === Pieces.g || piece === Pieces.ps || piece === Pieces.pn || piece === Pieces.pl || piece === Pieces.t) {
	var res = function(ox,oy,nx,ny) {
	    var moveOK = (Math.abs(ox-nx)+Math.abs(oy-ny)===1) || (Math.abs(nx-ox)===1 && ny-oy === color);
	    return moveOK && checkNotSameColorPiece(color, nx, ny);
	};
    } else if(piece === Pieces.k) {
	var res = function(ox,oy,nx,ny) {
	    var moveOK = Math.abs(nx-ox)<=1&&Math.abs(ny-oy)<=1;
	    return moveOK && checkNotSameColorPiece(color, nx, ny);
	};
    } else if(piece === Pieces.b) {
	var res = function(ox,oy,nx,ny) {
	    var moveOK = (Math.abs(nx-ox) === Math.abs(ny-oy));
	    return moveOK && checkNoGoThrough(ox,oy,nx,ny) && checkNotSameColorPiece(color, nx, ny);
	};
    } else if(piece === Pieces.r) {
	var res = function(ox,oy,nx,ny) {
	    var moveOK = (nx === ox || ny === oy);
	    return moveOK && checkNoGoThrough(ox,oy,nx,ny) && checkNotSameColorPiece(color, nx, ny);
	};
    } else if(piece === Pieces.d) {
	var res = function(ox,oy,nx,ny) {
	    var moveOK = (Math.abs(nx-ox)<=1 && Math.abs(ny-oy) <=1) || nx === ox || ny === oy;
	    return moveOK && checkNoGoThrough(ox,oy,nx,ny) && checkNotSameColorPiece(color, nx, ny);
	};
    } else if(piece === Pieces.h) {
	var res = function(ox,oy,nx,ny) {
	    var moveOK = (Math.abs(nx-ox)<=1 && Math.abs(ny-oy) <=1) || (Math.abs(ox-nx) === Math.abs(oy-ny));
	    return moveOK && checkNoGoThrough(ox,oy,nx,ny) && checkNotSameColorPiece(color, nx, ny);
	};
    }
    else {
	var res = function(ox,oy,nx,ny) {
	    return true;
	};
    }
    return res;
}

function inPromotionZone(y) {
    if(Color === 1) {
	return y>=6;
    }else {
	return y<=2;
    }
}

//returns a function that handle the 'up' interaction to move a piece on the board
function makeUpFct(piece, color) {
    var checkingValidity = makeValidMoveFct(piece, color);
    var res = function() {
        console.log("inside up function");
	startSquareX = coordToSquare(this.ox);
	startSquareY = coordToSquare(this.oy);
	newSquareX = coordToSquare(this.attr("x"));
	newSquareY = coordToSquare(this.attr("y"));
	validMove = checkingValidity(startSquareX,startSquareY, newSquareX, newSquareY);
        if(board[startSquareY][startSquareX][1] !== Color) { 
            alert("not your turn");
            this.attr({x: this.ox, y: this.oy});
        }else if(!validMove) {
            console.log("invalid move!");
	    //alert("fuck you, that move is illegal");
	    this.attr({x: this.ox, y: this.oy});
	}else {
            console.log("before"+paper.getElementsByPoint(sqToCoord(startSquareX),sqToCoord(startSquareY)).length);
	    //this.attr({x: 1, y: 1});//dirty hack to be able to remove the pieces that were just taken.
	    //handle promotion
	    //if(inPromotionZone(startSquareY) || inPromotionZone(newSquareY)) {
		
	    //}
            this.remove();
	    updateBoard(startSquareX, startSquareY, newSquareX, newSquareY);
            makePiece([piece,color],paper, sqToCoord(newSquareX), sqToCoord(newSquareY));
	    //this.attr({x:sqToCoord(newSquareX),y:sqToCoord(newSquareY)});
            console.log("old square: "+paper.getElementsByPoint(sqToCoord(startSquareX),sqToCoord(startSquareY)).length);
            console.log("new square: "+paper.getElementsByPoint(sqToCoord(newSquareX),sqToCoord(newSquareY)).length);
            Color *= -1;
            //console.log(this.attr());
	}
    };
    //drawToDrop();
    return res;
}

//function to move a piece. standard thing to move it with the mouse
function move(dx,dy) {
    //document.getElementById("xCoord").innerHTML = dx;
    //document.getElementById("yCoord").innerHTML = dy;
   // console.log("inside move");
    //console.log("dx = " + dx);
    console.log("move: ox = " + this.ox);
    // var startSquareX = coordToSquare(this.ox);
    // var startSquareY = coordToSquare(this.oy);
    // var newSquareX = coordToSquare(this.ox+dx);
    // var newSquareY = coordToSquare(this.oy+dy);
    // var deltaX = newSquareX - startSquareX;
    // var deltaY = newSquareY - startSquareY;       
    //if((deltaX*deltaX + deltaY*deltaY)===1) {
    this.attr({x: this.ox + dx, y: this.oy+ dy});	

}

function makeStartDrop(x,y) {
    //console.log("inside startDrop: x = " + this.attr("x")+ "y = " + this.attr("y"));
    var res = function() {
        console.log("start function: x = " + x, "y = " + y);
        this.attr({ox: x,oy:y});    
        //this.oy=y;
    };
    return res;
}

function start() {
    // storing original coordinates
    this.ox = this.attr("x");
    this.oy = this.attr("y");
    //document.getElementById("debugInfo").innerHTML = "ox = " + thix.ox + " oy = " + this.oy;
    //this.attr({opacity: 1});
    //if (this.attr("y") < 60 &&  this.attr("x") < 60)
    //this.attr({fill: "#000"});        
}

//produces a piece and puts it on paper. piece has to be of the form: [pieceName, colorCode]
function makePiece(piece,paper,x,y) {
    //alert(piece);
    //console.log("makePiece: piece = " + piece);
    p = paper.text(x,y,"text").attr({text: piece[0], cursor:"move"});
    up = makeUpFct(piece[0],piece[1]);
    p.drag(move,start,up);
    //return p;
}

//function that is loaded when opening the web page.
function load() {
    //alert("load event detected!");
    paper = Raphael(10,50,700,700);
    drawBoard(paper);
    board = initBoard();
    n = 9;//board.length;
    //alert(n);
    var i,j;
    for(i=0; i < n; i++) {
	for(j=0;j<n;j++) {
	    //document.write();
	    //alert("i="+i+" j="+j);
	    piece = board[i][j];
	    if(piece !==0) {
		makePiece(piece,paper,sqToCoord(j),sqToCoord(i));
	    }
	}
    }
}


                              