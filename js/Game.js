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
    this.height = height;
    this.width = width;
    // game state grid is a 2D array holding information of each grid location
    this.grid = new Array(this.height);
    this.reset();
    this.score = 0;
    // offset values to draw on the canvas
    this.curTetro = null;
    this.ctx = ctx;

    this.blockSize = 20;
    this.screenOrigin = {x:100, y:100};

}

Game.prototype.reset = function() {
    for (var i = 0; i < this.height; i++) {
        this.grid[i] = new Array(this.width);
        for (var j = 0; j < this.width; j++)
            this.grid[i][j] = null;
    }
}
Game.prototype.drawGrid = function() {
    console.log("drawing..................");
    // grid dimension in pixels
    var pixelWidth = this.width*this.blockSize;
    var pixelHeight = this.height*this.blockSize;

    // draw the background
    this.ctx.clearRect(this.screenOrigin.x, this.screenOrigin.y, pixelWidth, pixelHeight);
    this.ctx.fillStyle = "#444444";
    this.ctx.fillRect(this.screenOrigin.x, this.screenOrigin.y, pixelWidth, pixelHeight);

    // draw the blocks
    for (var i = 0; i < this.height; i++) {
        for (var j = 0; j < this.width; j++) {
            if (this.grid[i][j] != null) {
                this.grid[i][j].draw(this.ctx, j, i, this.blockSize, this.screenOrigin);
            }
        }
    }
}

// function to be called continuously to update game state
function updateState(game){
    console.log("updating state....")
    game.curTetro.eraseFromGrid(game.grid);
    // try to make the current tetro fall down by 1 step
    game.curTetro.y +=1;
    // check if it could actually go down
    var status = game.curTetro.drawIntoGrid(game.grid);

    if (status == -1) {
        // redraw last tetrimino
        game.curTetro.y -= 1;
        game.curTetro.drawIntoGrid(game.grid);
        game.checkLine();
        game.spawn();

        console.log("spawned a new tetro at y: " + game.curTetro.y);
        var status2 = game.curTetro.drawIntoGrid(game.grid);
        console.log("status 2 is " + status2);
        if (status2 == -1) {
            alert("game over!");
            game.reset();
        }

    }
    game.drawGrid();
}
Game.prototype.setScreenOrigin = function(x, y) {
    this.screenOrigin.x = x;
    this.screenOrigin.y = y;
}

Game.prototype.checkLine = function() {
    //Loop over each line in the grid
    for(var i = this.height-1; i > 0; i--) {

        //Check if the line is full
        var full = true;
        for(var j = 0; j < this.width; j++)
            if (this.grid[i][j] == null) {
                full = false;
                break;
            }

        if(full) {
            //Loop over the remaining lines
            for(var ii = i; ii > 1; ii--) {
                //Copy each line from the line above
                for(var j = 0; j < this.width; j++)
                    this.grid[ii][j] = this.grid[ii-1][j];
            }

            //Make sure the top line is clear
            for(var j = 0; j < this.width; j++)
                this.grid[0][j] = null;

            //Repeat the check for this line
            i++;
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
    this.curTetro = new Tetromino(randomType, Math.round(this.width/2), 0);
}
