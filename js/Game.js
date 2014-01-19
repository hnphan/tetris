/**
 * Created by Hieu on 1/18/14.
 */
/**
 *
 * @param width
 * @param height
 * @param tetrominos holding data of tetrominos design (see Tetrominos.js)
 * @constructor
 */
function Game(width, height, tetrominos) {
    // game state grid is a 2D array holding information of each grid location
    this.grid = new Array(height);
    for (var i = 0; i < width; i++) {
        this.grid[i] = new Array(width);
        for (var j = 0; j < height; j++)
            this.grid[i][j] = null;
    }
    this.score = 0;
    // offset values to draw on the canvas
    this.offsetX = 0;
    this.offsetY = 0;
    this.tetrominos = tetrominos;
}

// draw a tetromino of a specified type at location x,y
// x and y are in game coordinates
Game.prototype.drawTetromino = function(x,y,type) {
    if (this.tetrominos[type]) {

    }
}
