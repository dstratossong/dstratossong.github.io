
var color_g = 0;
var COLOR_INCREMENT = 10;

var generatedWheel = false;
var colorwheel = [];
var rgbwheel = [];
var wheelLength = 0;

// Starting coloring
var R = 255;
var G = 0;
var B = 0;


// Get a hex digit from a number between 0-15 inclusive
function hexOneDigit (num) {
	switch (num) {
	case 0:
	case 1:
	case 2:
	case 3:
	case 4:
	case 5:
	case 6:
	case 7:
	case 8:
	case 9:
		return num;
	case 10:
		return 'A';
	case 11:
		return 'B';
	case 12:
		return 'C';
	case 13:
		return 'D';
	case 14:
		return 'E';
	case 15:
		return 'F';
	default:
		return '0';
	}
}

// Gets a hex 2-digit number from a number between 0-255 inclusive
function convertToHex (num) {
	if (num < 0 || num > 255) {
		return 0;
	} else {
		return hexOneDigit(parseInt(num/16)).toString() + hexOneDigit(num%16).toString();
	}
}


// Generates both the coloring wheel with hexa-notation colors, and the rgb(r, g, b) notation
function generateWheel () {
	while (B < 255) {
		colorwheel.push('#' + convertToHex(R) + convertToHex(G) + convertToHex(B));
		rgbwheel.push('rgb(' + R + ',' + G + ',' + B + ')');
		B++;
	}
	while (R > 0) {
		colorwheel.push('#' + convertToHex(R) + convertToHex(G) + convertToHex(B));
		rgbwheel.push('rgb(' + R + ',' + G + ',' + B + ')');
		R--;
	}
	while (G < 255) {
		colorwheel.push('#' + convertToHex(R) + convertToHex(G) + convertToHex(B));
		rgbwheel.push('rgb(' + R + ',' + G + ',' + B + ')');
		G++;
	}
	while (B > 0) {
		colorwheel.push('#' + convertToHex(R) + convertToHex(G) + convertToHex(B));
		rgbwheel.push('rgb(' + R + ',' + G + ',' + B + ')');
		B--;
	}
	while (R < 255) {
		colorwheel.push('#' + convertToHex(R) + convertToHex(G) + convertToHex(B));
		rgbwheel.push('rgb(' + R + ',' + G + ',' + B + ')');
		R++;
	}
	while (G > 0) {
		colorwheel.push('#' + convertToHex(R) + convertToHex(G) + convertToHex(B));
		rgbwheel.push('rgb(' + R + ',' + G + ',' + B + ')');
		G--;
	}
	wheelLength = colorwheel.length;
}

// Gives the color based on the next increment on the wheel
function increment () {
	if (!generatedWheel) {
		generateWheel();
		generatedWheel = true;
	}
	color_g += COLOR_INCREMENT;
	if (color_g >= wheelLength) color_g = 0;
	// var color = colorwheel[color_g];
	var color = rgbwheel[color_g];
	console.debug("color: " + color);
	return color;
}
