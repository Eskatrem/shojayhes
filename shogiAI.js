//functions for the AI of the shogi


//given a position, lists all the legal moves the piece on square "from" can do
function getLegalMoves(position, from) {
    var piece = position[from.y][from.x];
    if(piece === 0) {
        return [];
    }
    var col = piece.col;
    var p = piece.p;
    var dir = getDirection(col);
    var res = [];
    if(piece === "p") {
        var newY = from.y+dir;
        if(newY<0 || newY >=Nsquares) {
            return [];
        }
        var to = {x:from.x, y:newY};
        var target = position[to.y][to.x];
        if(target === 0 || target.col !== col) {
            res.push(to);
        }
    }
    if(piece === "n") {
        var newY = from.y + 2*dir;
        
    }
    return res;
}

//given a position and a list of pieces to drop, gives all the legal drops
function getAllLegalDrops(position, toDrop) {
    
}

//given a position, list all the legal moves that the color "colorToMove" can play
function getAllLegalMoves(position, toDrop,  colorToMove){
    
}