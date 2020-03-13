// --- FUNCTIONS --- //
// - Gets mouse postion x and y relative to the canvas - //
function getMouseXY(e) {
  var canvas = document.getElementById('game_canvas');
  var boundingRect = canvas.getBoundingClientRect();
  var offsetX = boundingRect.left;
  var offsetY = boundingRect.top;
  var w = (boundingRect.width-canvas.width)/2;
  var h = (boundingRect.height-canvas.height)/2;
  offsetX += w;
  offsetY += h;
  // use clientX and clientY as getBoundingClientRect is used above
  var mx = Math.round(e.clientX-offsetX);
  var my = Math.round(e.clientY-offsetY);
  return {x: mx, y: my};
}
// - Chooses start coordinates for cutting image from value in grid array - //
function gridFill(v) {
    var sx;
    var sy;
    if (v == 1) {
        sx = 0;
        sy = 0;
    }
    else if (v == 2){
        sx = 0;
        sy = 120;
    }
    else if (v == 3){
        sx = 0;
        sy = 240;
    }
    else if (v == 4){
        sx = 120;
        sy = 0;
    }
    else if (v == 5){
        sx = 120;
        sy = 120;
    }
    else if (v == 6){
        sx = 120;
        sy = 240;
    }
    else if (v == 7){
        sx = 240;
        sy = 0;
    }
    else if (v == 8){
        sx = 240;
        sy = 120;
    }
    else if (v == 0){
        sx = 240;
        sy = 240;
    }
    return [sx, sy]
}
// - Draws the grid of tiles - //
function drawGrid(context, grid, displayAll) {
        for (var i=0; i<NUM_CELLS; i++) {
            for (var j=0; j<NUM_CELLS; j++) {
                var x = i*CELL_WIDTH;
                var y = j*CELL_HEIGHT;
                context.moveTo(x,y);
                if (!displayAll && grid[i][j] == 0) {
                    context.fillStyle = "rgb(255, 255, 255)";
                    context.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
                }
                else {
                    var coords = gridFill(grid[i][j]);
                    context.drawImage(img, coords[0], coords[1], 120, 120, x, y, CELL_WIDTH, CELL_HEIGHT);
                }
            }
        } 
}
// - Determines which tile the mouse is in - //
function whichGridCell(x, y) {
  if (x<0) x = 0;
  if (y<0) y = 0;
  if (x>=CANVAS_WIDTH) x = CANVAS_WIDTH-1;
  if (y>=CANVAS_HEIGHT) y = CANVAS_HEIGHT-1;
  var gx = Math.floor(x/CELL_WIDTH);
  var gy = Math.floor(y/CELL_HEIGHT);
  // need to be careful here
  // x, y on screen is j,i in grid
  return {j: gx, i: gy};
}
// - Checks too see if player grid matches the target - //
function checkWin (grid, grid_win){
    var win = true;
    for (var i=0; i<NUM_CELLS; i++) {
        for (var j=0; j<NUM_CELLS; j++) {
            if (grid[i][j] != grid_win[i][j]){
                win = false;
                break;
            }
        }
    }
    if (win == true) {
        drawGrid(game_context, grid, true);
        alert("You have won");
    }
}
// - Moves the tiles when the mouse is clicked - //
function doSomething(evt) {
    var pos = getMouseXY(evt);
    var gridCell = whichGridCell(pos.x, pos.y);
    // Finds postion of the '0' in the grid
    var index_a;
    var index_b;
    for (var a = 0; a<NUM_CELLS; a++){
        for (var b = 0; b<NUM_CELLS; b++){
            if (grid[a][b] == 0){
                index_a = a;
                index_b = b;
            }
        }
    }
    // Checks to see if the '0' is next to the tile that was clicked
    var swap;
    if (index_a == gridCell.j + 1 && index_b == gridCell.i)
        swap = true;
    else if (index_a == gridCell.j - 1  && index_b == gridCell.i)
        swap = true;
    else if (index_a == gridCell.j&& index_b == gridCell.i + 1)
        swap = true;
    else if (index_a == gridCell.j && index_b == gridCell.i - 1)
        swap = true;
    else
        swap = false;
    // If the tile is next to the '0' swap the tiles
    if (swap == true){
        var temp = grid[gridCell.j][gridCell.i];
        grid[gridCell.j][gridCell.i] = 0;
        grid[index_a][index_b] = temp;
    }
    drawGrid(game_context, grid, false);
    checkWin(grid, grid_win);
}
// - Resets the game by randomising the tile positions - //
function new_game() {
    var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (var i = 0; i<NUM_CELLS; i++){
        for (var j = 0; j<NUM_CELLS; j++){
            var num = Math.floor(Math.random() * numbers.length);
            grid[i][j] = numbers[num];
            numbers.splice(num, 1);
        }
    }
    drawGrid(game_context, grid, false);
}

// main program
var game_canvas = document.getElementById('game_canvas');
var game_context = game_canvas.getContext('2d');
var win_canvas = document.getElementById('win_canvas');
var win_context = win_canvas.getContext('2d');
const CANVAS_WIDTH = game_canvas.width;
const CANVAS_HEIGHT = game_canvas.height;

var newGame = document.getElementById('new_game');

var grid = [[1, 2, 3], [4, 5, 6], [7, 0, 8]];
var grid_win = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
const NUM_CELLS = 3;
const CELL_WIDTH = CANVAS_WIDTH/NUM_CELLS;
const CELL_HEIGHT = CANVAS_HEIGHT/NUM_CELLS;
// divide canvas into 3x3 grid
var img = new Image();
img.src = '../Images/partypentagon_full.jpg';
img.onload = function(){
	// new_game();
	drawGrid(game_context, grid, false);
	drawGrid(win_context, grid_win, true);

	game_canvas.addEventListener('click', doSomething);
	newGame.addEventListener('click', new_game);
};