/**
 * Created by Hieu on 1/18/14.
 */
/**
 *
 * @param width, height: size of grid matrix
 * @param tetrominos holding data of tetrominos design (see Tetrominos.js)
 * @constructor
 */
function Game(width, height, ctx) {
    // game state grid is a 2D array holding information of each grid location
    this.grid = new Array(height);
    for (var i = 0; i < height; i++) {
        this.grid[i] = new Array(width);
        for (var j = 0; j < width; j++)
            this.grid[i][j] = null;
    }
    this.score = 0;
    // offset values to draw on the canvas
    this.curTetro = null;
    this.ctx = ctx;
    this.height = height;
    this.width = width;
    this.blockSize = 20;
}

Game.prototype.drawGrid = function() {
    console.log("drawing..................");
    this.ctx.clearRect(0,0,200,400);
    for (var i = 0; i < this.height; i++) {
        for (var j = 0; j < this.width; j++) {
            if (this.grid[i][j] != null) {
                this.grid[i][j].draw(this.ctx, j, i, this.blockSize);
            }
        }
    }
}

function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
            result = prop;
    return result;
}

Game.prototype.spawn = function() {
    var randomType = pickRandomProperty(TETROMINOS);
    this.curTetro = new Tetromino(randomType, 0, 0);
    this.curTetro.drawIntoGrid(this.grid);
}
