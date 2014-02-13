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

    // initialize the grid
    this.init();

    // current tetromino
    this.curTetro = null;

    // canvas context object
    this.ctx = ctx;

    // size of each square block
    this.blockSize = 20;

    // screen origin, for drawing on canvas
    this.screenOrigin = {x:100, y:100};

    this.timer = 0;
    this.score = 0;
    this.roomId = null;
}


/**
 * Initialize the grid to a 2D array
 */
Game.prototype.init = function() {
    for (var i = 0; i < this.height; i++) {
        this.grid[i] = new Array(this.width);
        for (var j = 0; j < this.width; j++)
            this.grid[i][j] = null;
    }
}

Game.prototype.start = function() {
    that = this;
    this.spawn();
    this.drawGrid();
    clearInterval(this.timer);
    this.timer = setInterval(function(){updateState(that)}, 1000);
}


/**
 * Draw the grid based on the grid data
 */
Game.prototype.drawGrid = function() {
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


var drawSquare = function(ctx, x, y, size, screenOrigin, type) {
    // convert game coordinates into pixel coordinates
    var pixelX = screenOrigin.x + x*size;
    var pixelY = screenOrigin.y + y*size;

    ctx.fillStyle = TETROMINOS[type].color;
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = '#ffffff';
    ctx.fillRect(pixelX, pixelY, SQUARE_SIZE, SQUARE_SIZE);
    ctx.strokeRect(pixelX, pixelY, SQUARE_SIZE, SQUARE_SIZE);
};

/**
 * Draw the grid based on the grid data
 */
Game.prototype.drawGrid2 = function() {
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
                drawSquare(this.ctx, j, i, this.blockSize, this.screenOrigin, this.grid[i][j].type);
            }
        }
    }
}


// function to be called continuously to update game state
function updateState(game){
    console.log("updating state..... score is " + game.score)
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
            game.init();
        }

    }

    if ((this.score > 0) && (this.score % 2) == 0) {
        console.log("scored!!!!!!!!!1");
        socket.emit("scored", {data: "test data"});
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
            // increment score
            this.score += 10;
            socket.emit("attack", {roomId: this.roomId, data: "test data"});
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

/**
 * When a player is attacked, a new line of blocks is added at the bottom
 */
Game.prototype.isAttacked = function() {
    console.log("ATTACKED!!!!!!!!!!!!!! :(");
    // copy each line from the line below
    for (var i = this.curTetro.y; i < this.height-1; i++) {
        for (var j = 0; j < this.width; j++) {
            // make sure we are only copying the part without the falling tetro
            if ((i < this.curTetro.y + 4) && (j < 4) && (this.curTetro.shapeMap[i-this.curTetro.y][j] == 0)) {
                this.grid[i][j] = this.grid[i+1][j];
            }
            else if (i >= this.curTetro.y + 4) {
                this.grid[i][j] = this.grid[i+1][j];
            }
        }
    }
    // fill the bottom line with a random line
    for (var j = 0; j < this.width; j++) {
        if (Math.random() < 0.7) {
            this.grid[this.height-1][j] = new Square(pickRandomProperty(TETROMINOS));
        }
        else this.grid[this.height-1][j] = null;
    }
}


