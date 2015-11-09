var h = 263,
		s = 60,
		b = 50,
		a = 10;

var h2, 
		a2Start = 71,
		a2 = a2Start;

var h3 = 360,
		s3 = 60,
		b3 = 25,
		a3 = 2,
		a3Wipe = 40;

// vars for line
var eX, eY, // position
		eX2, eY2,
		eW = 2; // width

// for ripple effect
var rippleX, rippleY, // position
		rippleWStart = 1,
		rippleW = rippleWStart,
		rDistance,
		rRange;

// for bounces on wall
var bounces = 0,
		bouncesMax = 5,
		bouncesTotal = 0;

// for conversion from polar to cartesian coordinates.
// basically getting x and y from an angle and a radius.
// angle: 0 to 360 ... duh
var angle,
		radius = 4; // sets the speed

var quadrant;

var canvasW = 500,
		canvasH = 500;

// for Dot
var dot = [];

/*
* only executed once
*/
function setup(){
	createCanvas(canvasW, canvasH);

	// change color mode to hsl
	colorMode(HSL, 360, 100, 100, 100);

	// start line at...
	eX = random(0,width);
	eY = 0;

	angle = radians(random(0,180));

	// rectangle/background
	background(360, 100, 100);
}


/*
* this will be executed all the time
*/
function draw(){

	// translate from angle: polar to cartesian coordianates
	eY += radius*sin(angle);
	eX += radius*cos(angle);

	// quadrants:
	// 1: 0° - 90°
	// 2: 90° - 180°
	// 3: 180° - 270°
	// 4: 270° - 360°
	if (angle >= radians(0) && angle < radians(90)) {
		quadrant = 1;
	}
	else if (angle >= radians(90) && angle < radians(180)) {
		quadrant = 2;
	}
	else if (angle >= radians(180) && angle < radians(270)) {
		quadrant = 3;
	}
	else if (angle >= radians(270) && angle < radians(360)) {
		quadrant = 4;
	}

	// bounce from walls
	// 0° - 90°
	if (quadrant === 1 && eX > width) { // right
		angle += radians(90);
		bounces++;
		eX = width;
	}
	else if (quadrant === 1 && eY > height) { // bottom
		angle -= radians(90);
		bounces++;
		eY = height;
	}
	// 90° - 180°
	else if (quadrant === 2 && eY > height) { // bottom
		angle += radians(90);
		bounces++;
		eY = height;
	}
	else if (quadrant === 2 && eX < 0) { // left
		angle -= radians(90);
		bounces++;
		eX = 0;
	}
	// 180° - 270°
	else if (quadrant === 3 && eX < 0) { // left
		angle += radians(90);
		bounces++;
		eX = 0;
	}
	else if (quadrant === 3 && eY < 0) { // top
		angle -= radians(90);
		bounces++;
		eY = 0;
	}
	// 270° - 360°
	else if (quadrant === 4 && eY < 0) { // top
		angle += radians(90);
		bounces++;
		eY = 0;
	}
	else if (quadrant === 4 && eX > width) { // right
		angle -= radians(90);
		bounces++;
		eX = width;
	}

	// stay in 360°
	if (angle >= radians(360)) {
		angle -= radians(360);
	}
	else if (angle < radians(0)) {
		angle += radians(360);
	}
	
	// draw line
	stroke(359,50,50);
	strokeWeight(eW);
	line(eX,eY, eX2,eY2);


	if (bounces > bouncesMax) {
		// reset position after a specific amount of bounces
		noStroke();
		eX = random(0,width);
		eY = 0;	
		angle = radians(random(0,180));
		bounces = 0;
	}
	else if (eX === width || eY === height || eX === 0 || eY === 0) {
		// at wall-bounce, add thing
		dot[bouncesTotal] = new Dot();
		dot[bouncesTotal].show();
		bouncesTotal++;
	}

	// get last coordinate for drawing a line
	eX2 = eX;
	eY2 = eY;

	// nice fadeOut effect
	// noStroke();
	// fill(360, 100, 100, 0.8);
	// rect(0,0, width, height);


	// console.log(bounces);
	console.log(quadrant);
	// console.log(angle * (180 / Math.PI));
	// console.log('X: ' + eX + '| Y: ' + eY);
}


/*
* custom functions
*/
// create cartesian coordinates
function cartesianX(radius,angle) {
	var x = radius*cos(angle);

	return x;
}

function cartesianY(radius,angle) {
	var y = radius*sin(angle);

	return y;
}



/*
* Class Dot
*/
// Dot constructor
var Dot = function() {
	this.x = eX;
	this.y = eY;
	this.width = eW;
	this.color = color(360,0,0);
};

// show method
Dot.prototype.show = function() {
	noStroke();
	fill(this.color);
	ellipse(this.x,this.y, this.width*6,this.width*6);
};