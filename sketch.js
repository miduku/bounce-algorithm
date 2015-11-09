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
		a3 = 5,
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
		bouncesMax,
		bouncesTotal = 0; // current total amount of bounces

// for conversion from polar to cartesian coordinates.
// basically getting x and y from an angle and a radius.
// angle: 0 to 360 ... duh
var angle,
		radius ; // sets the speed

var quadrant;

var wall,	// which wall? t,r,b,l?
		wallAStart, wallAStop; // e.g. from 0° to 180°

// vars for audio
var playing = true;

// for Dot
var dot = [];

// for vertices with frequence
var specChange = [],
		vertX = [], vertY = [], // position
		vertA = []; // angle



/*
* preload
*/
function preload(){
	// add audio
	sound = loadSound('assets/xKore-State-of-Confusion.mp3');
	// sound = loadSound('assets/koop-absolute-space-jazzanova-mix.mp3');
}


/*
* only executed once
*/
function setup(){
	createCanvas(800, 800);
	// createCanvas(1600/2, 900/2);

	// audio setup
	sound.loop();
	fft = new p5.FFT();

	// change color mode to hsl
	colorMode(HSL, 360, 100, 100, 100);

	// start line at...
	eX = random(0,width);
	eY = 0;
	angle = radians(random(0,180));
	radius = 8;
	bouncesMax = 9;

	// ripple effect setup
	rDistance = 4;
	rRange = 3; //less = bigger range

	// rectangle/background
	// background(360, 60, 50);
}


/*
* this will be executed all the time
*/
function draw(){
	// translate from angle: polar to cartesian coordianates
	eX += cartesianX(radius,angle);
	eY += cartesianY(radius,angle);

	
	// DRAW LINE
	stroke(360,100,100);
	// stroke(h,s,b,a);
	strokeWeight(eW);
	line(eX,eY, eX2,eY2);


	// set distance between ripples
	rippleW = rippleW + Math.pow(rDistance,2);
	if (a2 >= 2) {
		a2 = a2 - rRange;
	}
	else {
		a2 = 0.1;
	}
	noFill();
	stroke(360,100,100,a2);
	// stroke(h2,60,50,a2);
	// ellipse(rippleX,rippleY, rippleW,rippleW);


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
		h2 = random(0,360);

		// create new Dot at wall
		dot[bouncesTotal] = new Dot();
		dot[bouncesTotal].show();

		// get coordinates from last Dot for starting point of the ripple effect
		rippleX = dot[bouncesTotal].x;
		rippleY = dot[bouncesTotal].y;
		rippleW = rippleWStart;

		a2 = a2Start;

		// wipe trails a bit
		fill(h3,60,50,a3Wipe);
		// fill(h3,s3,b3,a3Wipe);
		rect(0,0, width, height);
		bouncesTotal++;
	}
	// fadeOut effect
	fill(h3,s3,b3,a3);
	rect(0,0, width, height);


	// "Which Wall is it Anyway"?
	switch(wall) {
		case 1:
			// 0° - 180°
			wallAStart = radians(0);
			wallAStop  = radians(180);
			break;
		case 2:
			// 90° - 270°
			wallAStart = radians(90);
			wallAStop  = radians(270);
			break;
		case 3:
			// 180° - 360°
			wallAStart = radians(180);
			wallAStop  = radians(360);
			break;
		case 4:
			// 270° - 90
			wallAStart = radians(-270); // needs negative value to turn direction of vertex-creation
			wallAStop  = radians(90);
			break;
	}


	// analyize spectrum in 1024 bits
	var spectrum = fft.analyze();
	// and draw vertices
	beginShape();
		for (var i = 0; i < spectrum.length/4; i++) {

			// remap the angles (e.g. 0° to 180°) to values between 0 and 1024 of the current vertA[]
			vertA[i] = map(i, 0,spectrum.length/4, wallAStart,wallAStop);

			// var ch = map(spectrum[i], 0,1000, rippleW,0);
			specChange[i] = map(spectrum[i], 0,spectrum.length, 0,255);

			vertX[i] = rippleX + cartesianX(specChange[i] + rippleW, vertA[i]);
			vertY[i] = rippleY + cartesianY(specChange[i] + rippleW, vertA[i]);

			curveVertex(vertX[i], vertY[i]);
		}
	endShape();


	// get last coordinate for drawing a line
	eX2 = eX;
	eY2 = eY;

	// console.log(bouncesTotal);
	// console.log(bounces);
	console.log(a2);
	// console.log(quadrant);
	// console.log(angle * (180 / Math.PI));
	// console.log('X: ' + eX + '| Y: ' + eY);
}


/*
* mouse functions
*/
function mouseClicked() {
	if (playing) {
		sound.amp(0);
		playing = false;
	} else {
		sound.amp(1);
		playing = true;
	}
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
var Dot = function(x,y) {
	this.x = eX;
	this.y = eY;
	this.width = eW;
	this.color = color(360,100,100,100);
	// this.color = color(h2,50,50,50);
};

// show method
Dot.prototype.show = function() {
	noStroke();
	fill(this.color);
	ellipse(this.x,this.y, this.width*6,this.width*6);
};