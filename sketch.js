var h = 263,
		s = 60,
		b = 50,
		a = 10;

// vars for line
var eX, eY,
		eX2, eY2,
		eW = 1;

// for ripple effect
var rX, rY,
		rWStart = 1,
		rW = rWStart,
		rInterval,
		rRange;

var h2, 
		a2Start =71;
		a2 = a2Start;

// for bounces on wall
var bounces = 0,
		bouncesMax,
		bouncesTotal = 0;

// for conversion from polar to cartesian coordinates.
// basically getting x and y from an angle and a radius.
// angle: 0 to 360 ... duh
var angle,
		radius ; // sets the speed

var quadrant;

// for Dot
var dot = [];

/*
* only executed once
*/
function setup(){
	createCanvas(1600, 900);

	// change color mode to hsl
	colorMode(HSL, 360, 100, 100, 100);

	// start line at...
	eX = random(0,width);
	eY = 0;
	angle = radians(random(0,180));
	radius = 8;
	bouncesMax = 9;

	// ripple effect setup
	rInterval = 6;
	rRange = 2; //less = bigger range

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

	
	// DRAW LINE
	stroke(h,s,b,a);
	strokeWeight(eW);
	line(eX,eY, eX2,eY2);


	// DRAW RIPPLE EFFECT
	rW = rW + Math.pow(rInterval,2);
	if (a2 >= 2) {
		a2 = a2 - rRange;
	}
	else {
		a2 = 0.1;
	}
	noFill();
	stroke(h2,60,50,a2);
	ellipse(rX,rY, rW,rW);


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

	// if specific amount of bouncing, reset position
	if (bounces > bouncesMax) {
		noStroke();
		eX = random(0,width);
		eY = 0;	
		angle = radians(random(0,180));
		bounces = 0;
	}
	// if at wall-bounce, add thing
	else if (eX === width || eY === height || eX === 0 || eY === 0) {
		h2 = random(0,360);

		// create new Dot at wall
		dot[bouncesTotal] = new Dot();
		dot[bouncesTotal].show();

		// get coordinates from last Dot for starting point of the ripple effect
		rX = dot[bouncesTotal].x;
		rY = dot[bouncesTotal].y;
		rW = rWStart;

		a2 = a2Start;

		bouncesTotal++;
	}

	// get last coordinate for drawing a line
	eX2 = eX;
	eY2 = eY;

	// nice fadeOut effect
	// noStroke();
	// fill(h2, 50, 90, 50);
	// rect(0,0, width, height);

	// console.log(bouncesTotal);
	// console.log(bounces);
	console.log(a2);
	// console.log(quadrant);
	// console.log(angle * (180 / Math.PI));
	// console.log('X: ' + eX + '| Y: ' + eY);
}


/*
* Class Dot
*/
// Dot constructor
var Dot = function(x,y) {
	this.x = eX;
	this.y = eY;
	this.width = eW;
	this.color = color(h2,50,50,50);
};

// show method
Dot.prototype.show = function() {
	noStroke();
	fill(this.color);
	ellipse(this.x,this.y, this.width*6,this.width*6);
};