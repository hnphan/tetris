/**
 * Created by hieu on 1/25/14.
 */
/**************************************************
 ** GAME CONTROL CLASS
 **************************************************/
var Control = function(game) {

    var onKeyDown = function(e) {
        var that = this,
            c = e.keyCode;
        switch (c) {
            // Controls
            case 37: // Left
                console.log("Leftyyy");
                game.curTetro.eraseFromGrid(game.grid);
                game.curTetro.x -=1;
                var status = game.curTetro.drawIntoGrid(game.grid);
                if ( status == -1) {
                    game.curTetro.x +=1;
                    game.curTetro.drawIntoGrid(game.grid);
                }
                break;
            case 38: // Up
                game.curTetro.eraseFromGrid(game.grid);
                game.curTetro.rotate(1);
                var status = game.curTetro.drawIntoGrid(game.grid);
                if ( status == -1) {
                    game.curTetro.rotate(-1);
                    game.curTetro.drawIntoGrid(game.grid);
                }
                break;
            case 39: // Right
                game.curTetro.eraseFromGrid(game.grid);
                game.curTetro.x +=1;
                var status = game.curTetro.drawIntoGrid(game.grid);
                if ( status == -1) {
                    game.curTetro.x -=1;
                    game.curTetro.drawIntoGrid(game.grid);
                }
                break;
            case 40: // Down
                console.log("down arrow");
                game.curTetro.eraseFromGrid(game.grid);
                game.curTetro.y +=1;
                var status = game.curTetro.drawIntoGrid(game.grid);
                if (status == -1) {
                    game.curTetro.y -= 1;
                    game.curTetro.drawIntoGrid(game.grid);
                }
                 break;
            /*case 1: //testing
                console.log("emitting attack");*/
        };
        // Redraw grid
        game.drawGrid();
    };


    return {
        onKeyDown: onKeyDown
    };
};