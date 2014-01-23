/**
 * Created by Hieu on 1/19/14.
 */
var DARK_BLUE = '#2f858d';
var YELLOW = '#c2be48';
var PURPLE = '#54c65e';
var RED = '#8a312e';
var LIGHT_BLUE = '#5367c6';
var ORANGE = '#cba063';

var TETROMINOS = {
    i: {
        shapes: [ [ [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]],
                  [ [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0]],
                  [ [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]],
                  [ [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0]]],
        color: DARK_BLUE
    },
    o: {
        shapes: [ [ [1, 1, 0, 0],
                    [1, 1, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]],
                  [ [1, 1, 0, 0],
                    [1, 1, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]],
                  [ [1, 1, 0, 0],
                    [1, 1, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]],
                  [ [1, 1, 0, 0],
                    [1, 1, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]]],
        color: YELLOW
    }
};

// constructor
/**
 *
 * @param type: type of tetromino, such as 'i', 'o', etc
 * @param shapeMap: a 4x4 matrix containing 0's and 1's specifying
 * the shape of the tetromino
 * @param orientation: number in [0..3] specifying the orientation
 * @constructor
 */
function Tetromino(type,x,y) {
    this.type = type;
    this.shapeMap = TETROMINOS[this.type].shapes;
    this.orientation = Math.floor(Math.random()*4);
    this.x = x;
    this.y = y;
}

Tetromino.prototype.rotate = function(i) {
    this.orientation = (this.orientation + i) % 4;
}

Tetromino.prototype.getShape = function() {
    return this.shapeMap[this.orientation];
}

// draw the tetromino into a grid by modifying data
// in the grid
Tetromino.prototype.drawIntoGrid = function(grid) {
    var drawable = true;
    for (var i=0; i<4; i++)
        for (var j=0; j<4; j++) {
            if (this.getShape()[i][j] == 1) {
                if (((this.y+j) >= grid.length) || ((this.x+i) >= grid[0].length) || grid[this.y+j][this.x+i] != null) {
                    drawable = false;
                    return -1;
                }
            }
        }

    // if no collision detected
    for (var i=0; i<4; i++)
        for (var j=0; j<4; j++) {
            if (this.getShape()[i][j] == 1) {
                grid[this.y+j][this.x+i] = new Square(this.type);
            }

        }
}

Tetromino.prototype.eraseFromGrid = function(grid) {
    for (var i=0; i<4; i++)
        for (var j=0; j<4; j++) {
            if (this.getShape()[i][j] == 1) {
                if (((this.y+j) < grid.length) && ((this.x+i) < grid[0].length))
                    grid[this.y+j][this.x+i] = null;
            }
        }
}

