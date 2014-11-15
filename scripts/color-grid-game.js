var grid = [];
var NUMBER_OF_COLORS = 6;
var COLOR_MAPPING = ['green', 'orange', 'red', 'blue', 'grey', 'purple'];

// Initialize
// grid[0] = [0, 1, 2, 1, 2, 3, 4, 2];
// grid[1] = [1, 0, 3, 1, 3, 2, 1, 4];
// grid[2] = [2, 4, 1, 2, 4, 3, 0, 3];
// grid[3] = [4, 2, 2, 0, 3, 0, 0, 2];
// grid[4] = [4, 3, 0, 2, 3, 2, 1, 4];
// grid[5] = [2, 1, 2, 4, 1, 2, 0, 0];
// grid[6] = [1, 4, 2, 2, 1, 4, 1, 3];
// grid[7] = [2, 1, 1, 2, 0, 2, 3, 4];

function fillGridWithRandomNumbers(width, height) {
	for (var i = 0; i < height; i ++) {
		grid[i] = [];
		for (var j = 0; j < width; j ++) {
			grid[i][j] = Math.floor((Math.random() * NUMBER_OF_COLORS));
		}
	}
}

function printGrid() {
	for (var i = 0; i < grid.length; i ++) {
		if (grid[i] == null) break;
		var line = "";
		for (var j = 0; j < grid[i].length; j ++) {
			line += grid[i][j] + ' ';
		}
		console.log(line);
	}
}

function changeColor(newColor) {
	var oldColor = grid[0][0];
	if (oldColor == newColor) return console.log('Color not changed.');
	grid[0][0] = newColor;
	var gridsChanged = 1 + recursivelyChangeColor(oldColor, newColor, 1, 0)
						 + recursivelyChangeColor(oldColor, newColor, 0, 1);
	printGrid();
	console.log('Number of cells changed: ' + gridsChanged);

}

function recursivelyChangeColor(oldColor, newColor, x, y) {
	if (oldColor == newColor) return 0;
	if (grid[x] == null) return 0;
	if (grid[x][y] == null) return 0;
	if (grid[x][y] != oldColor) return 0;
	grid[x][y] = newColor;
	return 1 + recursivelyChangeColor(oldColor, newColor, x+1, y)
			 + recursivelyChangeColor(oldColor, newColor, x, y+1)
			 + recursivelyChangeColor(oldColor, newColor, x-1, y)
			 + recursivelyChangeColor(oldColor, newColor, x, y-1);
}
