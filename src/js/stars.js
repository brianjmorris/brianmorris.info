/* © Brian Morris 2019 | http://brianmorris.info */

// TODO make lines brighter on click?
// 	- set to bright white and use opacity & transition in css to change colour

var canvasScale = 2; // update to scale canvas size
var lineColour = "#555555"; // colour of lines
var numConnectedStars = 5; // # of stars to draw lines between
var starColour = "#FFFFFF"; // colour of stars
var twinkleIntervalTime = 300; // # ms between twinkling stars
var twinkleLength = 200; // # of ms before stars return to normal size
var twinkleRatio = 0.10; // ratio to increase star size

var linesLength = { // range of distance from star to mouse to draw lines
	min: 60,
	max: 200
}
var starSize = { // range of star radius
	min: 0.3,
	max: 1
}
var starSpacing = { // range of possible space between stars on x axis
	min: 50,
	max: 4000
}

/* Global Vars */
var connectedStars = []; // stars to draw lines between
var currentLine = 0; // index of line moving to a new star
var fadeLinesTimeout;
var lineCanvases = [];
var lineContexts = [];
var nearbyStars = []; // stars near cursor
var resizeTimeout;
var setConnectedStarsInterval;
var stars = []; 
var starsCanvas;
var starsContext;
var starsInitialized = false; // referenced in initStars() to prevent multiple executions
var twinkleInterval;

if(!window.onload) {
	// if no onload function is defined, initialize the stars
	window.onload = initStars;
}

function initStars() {
	if(!starsInitialized) {
		starsInitialized = true;

		// print canvases for each star lines will be drawn to
		for (var i = 0; i < numConnectedStars; i++) {
			document.getElementById("lines").innerHTML += "<canvas id='line-" +
				i + "' class='full-screen line' " + "style='animation: fade " +
				(4+i) + "s infinite;' width='100%' height='100%' alt=''>" + 
				"</canvas>";
		}
	
		setCanvases();
		drawStars();
	
		window.addEventListener("resize", resizeCanvases, false);

		// fade in trees
		document.getElementById("trees").style.opacity = 1;
	}
}

function setCanvases() {
	// TODO limit actual canvas resolution

	// set the resolution of the canvases
	starsCanvas = document.getElementById("stars");
	starsCanvas.width = window.innerWidth * canvasScale;
	starsCanvas.height = window.innerHeight * canvasScale;
	starsContext = starsCanvas.getContext("2d");

	for (var i = 0; i < numConnectedStars; i++) {
		lineCanvases[i] = document.getElementById("line-" + i);
		lineCanvases[i].width = starsCanvas.width;
		lineCanvases[i].height = starsCanvas.height;
		lineContexts[i] = lineCanvases[i].getContext("2d");
	}
}

function resizeCanvases() {
	// wait 1 second after window stops resizing
	// then reset, adjust canvas resolutions and redraw
	clearTimeout(resizeTimeout);

	stars = [];
	connectedStars = [];
	document.getElementById("lines").style.opacity = 0;
	document.getElementById("stars").style.opacity = 0;

	resizeTimeout = setTimeout(function () {
		document.getElementById("stars").style.opacity = 1;
		setCanvases();
		drawStars();
	}, 1000);
}

function setConnectedStars() {
	// select a new, nearby star for currentLine to connect to
	// this function is called in fast intervals (<100ms)

	connectedStars[currentLine] = nearbyStars[randomInt(0, nearbyStars.length - 1)];
	currentLine++;

	if (numConnectedStars <= currentLine) {
		currentLine = 0;
	}
}

function drawLinesToMouse(e) {
	drawLines((e.clientX * canvasScale), (e.clientY * canvasScale));
}

function drawLinesToFinger(e) {
	var lastTouch = e.changedTouches[e.changedTouches.length - 1];
	
	drawLines((lastTouch.pageX * canvasScale), 
		(lastTouch.pageY * canvasScale));
}

function drawLines(posX, posY) {
	clearTimeout(fadeLinesTimeout);
	document.getElementById("lines").style.opacity = 0.4;

	fadeLinesTimeout = setTimeout(function () {
		document.getElementById("lines").style.opacity = 0;
	}, 2000);

	nearbyStars = stars.filter(function (star) {
		xDistance = Math.abs(star.x - posX);
		yDistance = Math.abs(star.y - posY);
		distance = Math.sqrt(xDistance * xDistance + yDistance *
			yDistance);
		return linesLength.min <= distance && distance <= linesLength
			.max;
	});

	for (var i = 0; i < numConnectedStars; i++) {
		if (connectedStars[i] && connectedStars[i].x && connectedStars[i].y) {
			lineContexts[i].clearRect(0, 0, lineCanvases[i].width, lineCanvases[
				i].height);
			lineContexts[i].beginPath();
			lineContexts[i].moveTo(connectedStars[i].x, connectedStars[i].y);
			lineContexts[i].lineTo(posX, posY);
			lineContexts[i].strokeStyle = lineColour;
			lineContexts[i].stroke();

			for (var j = 0; j < numConnectedStars; j++) {
				if (connectedStars[j] && connectedStars[j].x && connectedStars[j].y) {
					lineContexts[i].beginPath();
					lineContexts[i].moveTo(connectedStars[i].x, connectedStars[i].y);
					lineContexts[i].lineTo(connectedStars[j].x, connectedStars[j].y);
					lineContexts[i].strokeStyle = lineColour;
					lineContexts[i].stroke();
				}
			}
		}
	}
}

function drawStars() {
	window.removeEventListener("mousemove", drawLinesToMouse);
	// window.removeEventListener("touchmove", drawLinesToFinger);

	for (var i = 0; i < starsCanvas.height; i++) {
		drawStarRow(i);
	}

	setTimeout(function () {
		window.addEventListener("mousemove", drawLinesToMouse);
		// window.addEventListener("touchmove", drawLinesToFinger);

		clearInterval(twinkleInterval);
		twinkleInterval = setInterval(function () {
			twinkle();
		}, twinkleIntervalTime);
		clearInterval(setConnectedStarsInterval);
		setConnectedStarsInterval = setInterval(function () {
			setConnectedStars();
		}, 80);
	}, 2000);
}

function drawStarRow(y) {
	var x = 0;

	while (x < starsCanvas.width) {
		x = randomInt(x + starSpacing.min, x + starSpacing.max);
		var radius = randomInt(starSize.min * 10, starSize.max * 10) / 10;
		drawStar(x, y, radius);
	}
}

function drawStar(x, y, r) {
	// TODO: add fading stars?
	setTimeout(function () {
		var newStar = {
			x: x,
			y: y,
			r: r
		}
		starsContext.beginPath();
		starsContext.arc(newStar.x, newStar.y, newStar.r, 0, 2 * Math
			.PI);
		starsContext.fillStyle = starColour;
		starsContext.fill();
		stars.push(newStar);
	}, randomInt(100, 2000));
}

function twinkle() {
	var twinkleStar = stars[randomInt(0, stars.length - 1)];

	if (twinkleStar && twinkleStar.x && twinkleStar.y && twinkleStar.r) {
		var newRadius = twinkleStar.r * twinkleRatio;

		if (twinkleRatio < 0) {
			twinkleRatio *= -1;
		} else if (1 < twinkleRatio) {
			twinkleRatio = twinkleRatio - Math.floor(twinkleRatio);
		}

		twinkleRatio += 1;
		var newRadius = twinkleStar.r * (1 + twinkleRatio);
		starsContext.beginPath();
		starsContext.arc(twinkleStar.x, twinkleStar.y, newRadius, 0, 2 * Math
			.PI);
		starsContext.fillStyle = starColour;
		starsContext.fill();

		setTimeout(function () {
			starsContext.save();
			starsContext.beginPath();
			starsContext.arc(twinkleStar.x, twinkleStar.y, newRadius +
				0.5, 0, 2 * Math.PI);
			starsContext.clip();
			starsContext.clearRect(0, 0, starsCanvas.width, starsCanvas
				.height);
			starsContext.restore();
			starsContext.beginPath();
			starsContext.arc(twinkleStar.x, twinkleStar.y, twinkleStar
				.r, 0, 2 * Math.PI);
			starsContext.fillStyle = starColour;
			starsContext.fill();
		}, twinkleLength);
	}
}

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}