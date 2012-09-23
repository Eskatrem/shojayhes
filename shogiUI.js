//functions here should purely focus on the UI side.

var paper; //global variable, the raphael object where everything will be drawn
width = 60;
length = 60;
startX = 50;
startY = 50;

position = InitPosition;

function drawPiece(x,y,piece) {
    var p,col;
    p=piece.p;
    col=piece.col;
}


function start() {
    this.ox = this.attr("x");
    this.oy = this.attr("y");    
}

function move(dx,dy) {
    this.attr({x:this.ox+dx, y: this.oy + dy});
}

function coordToSquare(coords) {
    var x = coords[0];
    var y = coords[1];
    return [Math.floor((x-startX)/width),Math.floor((y-startY)/length)];
}

function squareToCoord(square) {
    var x = square[0];
    var y = square[1];
    return [startX + x * width, startY + y * length];
}

function upMove() {
    var startSquare, endSquare;
    startSquare = coordToSquare([this.ox,this.oy]);
    endSquare = coordToSquare([this.x, this.y]);
    var moveOK = checkMoveValidity(position, startSquare, endSquare, col, p);
}

function upDrop() {
    
}

//puts the pieces given in position on the board. position has to be a 9*9 array containing some pieces
function drawPosition(position) {
    var row, square;
    for(y=0;y<Nsquares;y++) {
        for(x=0;x<Nsquares;x++) {
            square = position[y][x];
            if(square === 0) {
                continue;
            }
            drawPiece(x,y,square);
            
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
}

