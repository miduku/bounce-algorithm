var h = 263,
		s = 60,
		b = 50,
		a = 10;

var h2 = 12,
		s2 = 4,
		b2 = 23,
		a2 = 100;

var h3 = 360,
		s3 = 10,
		b3 = 90,
		a3 = 2,
		a3Wipe = 40;

// vars for line
var eX, eY, // position
		eX2, eY2,
		eW = 2; // width

// for bounces on wall
var bounces = 0,
		bouncesMax,
		bouncesTotal = 0; // current total amount of bounces

// for conversion from polar to cartesian coordinates.
// basically getting x and y from an angle and a radius.
// angle: 0 to 360 ... duh
var angle,
		radius ; // sets the speed

var quadrant;

var wall;	// which wall? t,r,b,l?

// for Dot
var dot = [];

// for filling whole document
var w = window,
		wX = w.innerWidth,
		wY = w.innerHeight;


/*
* only executed once
*/
function setup(){
	createCanvas(wX, wY);
	// createCanvas(1600/2, 900/2);

	// change color mode to hsl
	colorMode(HSL, 360, 100, 100, 100);

	// start line at...
	eX = random(0,width);
	eY = 0;
	angle = radians(random(0,180));
	radius = 10;
	bouncesMax = 7;

	// rectangle/background
	background(h3, s3, b3);
}


/*
* this will be executed all the time
*/
function draw(){
	// translate from angle: polar to cartesian coordianates
	eX += cartesianX(radius,angle);
	eY += cartesianY(radius,angle);

	
	// DRAW LINE
	stroke(h2,s2,b2,5);
	// stroke(h,s,b,a);
	strokeWeight(eW);
	line(eX,eY, eX2,eY2);


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

	// wall sides
	if (eY < 0) {
		wall = 1;
	}
	else if (eX > width) {
		wall = 2;
	}
	else if (eY > height) {
		wall = 3;
	}
	else if (eX < 0) {
		wall = 4;
	}

	// if bounce from specific wall from specific angle
	// 0° - 90°
	if (quadrant === 1 && wall === 2) { // right
		angle += radians(90);
		bounces++;
		eX = width;
	}
	else if (quadrant === 1 && wall === 3) { // bottom
		angle -= radians(90);
		bounces++;
		eY = height;
	}
	// 90° - 180°
	else if (quadrant === 2 && wall === 3) { // bottom
		angle += radians(90);
		bounces++;
		eY = height;
	}
	else if (quadrant === 2 && wall === 4) { // left
		angle -= radians(90);
		bounces++;
		eX = 0;
	}
	// 180° - 270°
	else if (quadrant === 3 && wall === 4) { // left
		angle += radians(90);
		bounces++;
		eX = 0;
	}
	else if (quadrant === 3 && wall === 1) { // top
		angle -= radians(90);
		bounces++;
		eY = 0;
	}
	// 270° - 360°
	else if (quadrant === 4 && wall === 1) { // top
		angle += radians(90);
		bounces++;
		eY = 0;
	}
	else if (quadrant === 4 && wall === 2) { // right
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
		bounces = 0; // reset bounces counter
	}
	// if at wall-bounce, add thing
	else if (eX === width || eY === height || eX === 0 || eY === 0) {

		// create new Dot at wall
		dot[bouncesTotal] = new Dot();

		// draw triangle, start at third bounce
		if (bouncesTotal >= 2) {
			stroke(360,100,100,10);
			// noStroke();
			fill(h2,s2,b2,10);
			triangle(
				dot[bouncesTotal].x,dot[bouncesTotal].y, 
				dot[bouncesTotal-1].x,dot[bouncesTotal-1].y,
				dot[bouncesTotal-2].x,dot[bouncesTotal-2].y
			);

		// dot[bouncesTotal].show();
		// dot[bouncesTotal-1].show();
		// dot[bouncesTotal-2].show();

		}

		bouncesTotal++;
	}
	// fadeOut effect
	// fill(h3,s3,b3,1);
	// rect(0,0, width, height);


	// get last coordinate for drawing a line
	eX2 = eX;
	eY2 = eY;

	// console.log(bouncesTotal);
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
	this.color = color(h2,s2,b2,a2);
	// this.color = color(h2,50,50,50);
};

// show method
Dot.prototype.show = function() {
	noStroke();
	fill(this.color);
	ellipse(this.x,this.y, this.width*10,this.width*10);
};