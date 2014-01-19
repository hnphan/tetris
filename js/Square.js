/**
 * Created by Hieu on 1/19/14.
 */
// each square represents a square block in the game
// naturally it would make sense to have each square carrying
// information on its position, but it is not needed because
// the position information is stored in Game.grid array indices
// where the squares will be stored
var SQUARE_SIZE = 20;
function Square(t) {
    this.type = t;
}

// draw the square at a given coordinates
Square.prototype.draw = function(ctx, x,y) {
    // convert game coordinates into pixel coordinates
    var pixelX = x*SQUARE_SIZE;
    var pixelY = y*SQUARE_SIZE;

    ctx.fillStyle = TETROMINOS[this.c].color;
    ctx.fillRect(pixelX, pixelY, SQUARE_SIZE, SQUARE_SIZE);
}