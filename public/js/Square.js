/**
 * Created by Hieu on 1/19/14.
 */
// each square represents a square block in the game
// naturally it would make sense to have each square carrying
// information on its position, but it is not needed because
// the position information is stored in Game.grid array indices
// where the squares will be stored
var SQUARE_SIZE = 20;

var Square = function(t) {
    var type = t;

    var draw = function(ctx, x, y, size, screenOrigin) {
        // convert game coordinates into pixel coordinates
        var pixelX = screenOrigin.x + x*size;
        var pixelY = screenOrigin.y + y*size;

        ctx.fillStyle = TETROMINOS[this.type].color;
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = '#ffffff';
        ctx.fillRect(pixelX, pixelY, SQUARE_SIZE, SQUARE_SIZE);
        ctx.strokeRect(pixelX, pixelY, SQUARE_SIZE, SQUARE_SIZE);
    };

    return {
        type: type,
        draw: draw
    };
};
