//functions here should purely focus on the UI side.

var paper; //global variable, the raphael object where everything will be drawn

//global variables, graphic settings
width = 60;
length = 60;
startX = 50;
startY = 50;
YtoDropB = 5;
YtoDropR = 650;


//variables related to the state of the game (current position, color to play, list of pieces to drop)
position = InitPosition;
Color = "r";
pieces = ["p","l","n","s","g","b","r"];

function switchColor() {
    if(Color === "b") {
        Color = "r";
    } else {
        Color = "b";    
    }
    
}

//graphically deletes all the pieces on the board
function eraseBoard() {
    var x,y;
    var tmp,elt,nElts,k, coords;
    for(y = 0; y < Nsquares; y++) {
        for(x = 0; x < Nsquares; x++) {
            coords = squareToCoord({x:x,y:y});
//            console.log("coords.x = " + coords.x + " coords.y = " + coords.y);
            tmp = paper.getElementsByPoint(coords[0] , coords[1]);
            nElts = tmp.length;
            for(k = 1; k <nElts;k++) {
                elt = tmp[k];
                elt.remove();
            }
            
            
            
        }
    }
}

//erases the graphical representation of the list of the pieces to drop, for a given color.
function eraseToDrop(toDrop, color) {
    console.log(toDrop);
    //var pieces = ["p","l","n","s","g","b","r"];//keys(toDrop[color]);
    var y = YtoDropR;
    if(color === "b") {
        y = YtoDropB;
    }
    var x = 50;
    var dy = 40;
    var dx = 50;
    var tmp1, tmp2;
    for(piece in pieces) {
        if(toDrop[color][piece] >0) {
            tmp1 = paper.getElementsByPoint(x,y)[0];
            tmp1.remove();
            tmp2 = paper.getElementsByPoint(x,y+dy)[0];
            tmp2.remove();
            x = x + dx;
        }
    }
}

function putPieceOnBoard(square, piece) {
    var textAttr = piece.p;
    if(piece.col === "r") {
        textAttr = textAttr.toUpperCase();
    }
    var coords = squareToCoord(square);
    var x = coords[0];
    var y = coords[1];
    var p = paper.text(x,y,"text").attr({text: textAttr, cursor:"move"});
    p.drag(move,start,upMove);
}

function drawPiece(x,y,piece) {
    var p,col;
    p=piece.p;
    col=piece.col;
    putPieceOnBoard({x:x,y:y},piece);
    //var pieceObj = paper.text("text").attr();
}

function start() {
    console.log("start: x = " + this.attr("x"));
    this.ox = this.attr("x");
    this.oy = this.attr("y");    
    console.log("this.ox = " + this.ox);
}

function move(dx,dy) {
    this.attr({x:this.ox+dx, y: this.oy + dy});
}

function coordToSquare(coords) {
    console.log("coords = " + coords);
    var x = coords[0];
    var y = coords[1];
    return {x:Math.floor((x-startX)/width),y:Math.floor((y-startY)/length)};
}

function squareToCoord(square) {
    var x = square.x;
    var y = square.y;
    return [startX + x * width + width/2, startY + y * length+ length/2];
}

function upMove() {
    var startSquare, endSquare;
    startSquare = coordToSquare([this.ox,this.oy]);
    console.log("startSquare = " + startSquare);
    console.log("upMove: x = " + this.attr("x") + "y = " +  this.attr("y"));
    var x,y;
    x =this.attr("x");
    y = this.attr("y");
    endSquare = coordToSquare([x, y]);
    console.log("endSquare = " + endSquare);
    var moveOK = checkMoveValidity(position, startSquare, endSquare);//, col, p);
    if(moveOK) {
        //this.attr({x:this.ox+this.dx,y:this.oy+this.dy});
        var centeredCoords = squareToCoord(endSquare);
        this.attr({x:centeredCoords[0],y:centeredCoords[1]});
        eraseBoard();
        eraseToDrop(ToDrop,Color);
        updatePosition(startSquare, endSquare);
        drawPosition(position);
        drawToDrop(ToDrop,Color);
        switchColor();
    }
    else {
        this.attr({x:this.ox,y:this.oy});
    }
}

function upDrop() {
    var endSquare;
    var x,y;
    x =this.attr("x");
    y = this.attr("y");
    endSquare = coordToSquare([x, y]);
    var centeredCoords = coordToSquare(endSquare);
    console.log("upMove: this = " + this);
    this.attr({x:centeredCoords.x,y:centeredCoords.y});
    var piece = {p:this.attr("text"),col:Color};
    var dropOK = checkDropValidity(position,endSquare,Color,ToDrop[Color],piece);
    if(dropOK) {
        eraseBoard();
        eraseToDrop(ToDrop[Color],Color);
        updatePosition(undefined,endSquare,true,piece);
        drawPosition(position);
        drawToDrop(ToDrop,Color);
        switchColor();
    } else {
        this.attr({x:ox,y:oy});
    }
}

//puts the pieces given in position on the board. position has to be a 9*9 array containing some pieces
function drawPosition(position) {
    var row, square;
    var i,j;
    for(j=0;j<Nsquares;j++) {
        for(i=0;i<Nsquares;i++) {
            square = position[j][i];
            if(square === 0) {
                continue;
            }
            //console.log("x = " + x + " y = " + y);
            //console.log("test1");
            //console.log("square = " + square);
            //console.log("test2");
            drawPiece(i,j,square);
            
        }
    }
}

//draws the pieces that are to drop.
//toDrop has to be a hash map of the form: {r:1, p:3}
function drawToDrop(toDrop,color) {
    //var pieces = keys(toDrop);
    var y = YtoDropR;
    var x = 50;
    var n;
    var dy = 20;
    var dx = 50;
    var p;
    if(color === "b") {
        y = YtoDropB;
    }
    for(piece in pieces) {
        n = toDrop[color][pieces[piece]];
        if(n>0) {
            p = paper.text(x,y,"text").attr({text:pieces[piece],cursor:"move"});
            p.drag(move,start,upDrop);
            paper.text(x,y+dy,"text").attr({text: n});
            x = x +dx;    
        }
        
    }
}

//draw the board. paper is a Raphael canvas
function drawBoard() {
    //var paper = Raphael(10,50,700,700);
    //var width = 60;
    //var length = 60;
     //draw 9*9 squares...
    //var i,j;
    for(i=0; i<Nsquares;i++) {
	for(j=0; j<Nsquares;j++) {
	    paper.rect(startX+i*width, startY+j*width,width,width);
	}
    }
}


function load() {
    //alert(Nsquares);
    paper = Raphael(10,50,700,700);
    drawBoard();
    drawPosition(InitPosition);
}
