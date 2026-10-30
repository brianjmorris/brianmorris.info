/* © Brian Morris 2026 | http://brianmorris.info
 * Interactive canvas starfield with pointer tracking and twinkling animation
 */

// Configuration
const CANVAS_SCALE = 2;
const LINE_COLOUR = "#555555";
const NUM_CONNECTED_STARS = 5;
const STAR_COLOUR = "#FFFFFF";
const TWINKLE_INTERVAL_TIME = 300;
const TWINKLE_LENGTH = 200;
const FOREGROUND_ELEMENT_ID = "trees";

const LINES_LENGTH = {
	min: 60,
	max: 200
};
const STAR_SIZE = {
	min: 0.3,
	max: 1
};
const STAR_SPACING = {
	min: 50,
	max: 4000
};

const RESIZE_DELAY = 1000;
const FADE_LINES_DELAY = 2000;
const STARS_INIT_DELAY = 2000;
const CONNECTED_STARS_UPDATE_INTERVAL = 80;
const STAR_DRAW_MIN_DELAY = 100;
const STAR_DRAW_MAX_DELAY = 2000;
const TWINKLE_RATIO_INCREMENT = 0.1;
const MAX_CANVAS_WIDTH = 3840;
const MAX_CANVAS_HEIGHT = 2160;
const ROW_SPACING = 3;

// State
let twinkleRatio = 0.10;

// Canvas & DOM
let starsCanvas;
let starsContext;
let lineCanvases = [];
let lineContexts = [];

// Star data
let stars = [];
let connectedStars = [];
let nearbyStars = [];
let currentLine = 0;

// Timers & timeouts
let fadeLinesTimeout;
let resizeTimeout;

// Animation
let animationFrameId;
let lastTwinkleTime = 0;
let lastConnectedStarsTime = 0;

// Flags
let starsInitialized = false;
let pointerListenerAttached = false;

const animationLoop = (currentTime) => {
	if (currentTime - lastTwinkleTime >= TWINKLE_INTERVAL_TIME) {
		twinkle();
		lastTwinkleTime = currentTime;
	}

	if (currentTime - lastConnectedStarsTime >= CONNECTED_STARS_UPDATE_INTERVAL) {
		setConnectedStars();
		lastConnectedStarsTime = currentTime;
	}

	animationFrameId = requestAnimationFrame(animationLoop);
};

const stopAnimationLoop = () => {
	if (animationFrameId) {
		cancelAnimationFrame(animationFrameId);
		animationFrameId = null;
	}
};

const startAnimationLoop = () => {
	stopAnimationLoop();
	lastTwinkleTime = performance.now();
	lastConnectedStarsTime = performance.now();
	animationFrameId = requestAnimationFrame(animationLoop);
};

const attachMouseListener = () => {
	if (!pointerListenerAttached) {
		window.addEventListener("pointermove", handlePointerMove);
		pointerListenerAttached = true;
	}
};

const detachMouseListener = () => {
	if (pointerListenerAttached) {
		window.removeEventListener("pointermove", handlePointerMove);
		pointerListenerAttached = false;
	}
};

const initStars = () => {
	if(!starsInitialized) {
		starsInitialized = true;

		const linesContainer = document.getElementById("lines");
		for (let i = 0; i < NUM_CONNECTED_STARS; i++) {
			const canvas = document.createElement("canvas");
			canvas.id = `line-${i}`;
			canvas.className = "full-screen line";
			canvas.style.animation = `fade ${4 + i}s infinite`;
			canvas.width = "100%";
			canvas.height = "100%";
			canvas.alt = "";
			linesContainer.appendChild(canvas);
		}
	
		setCanvases();
		drawStars();
	
		window.addEventListener("resize", resizeCanvases, false);
		document.getElementById(FOREGROUND_ELEMENT_ID).style.opacity = 1;
	}
};

const setCanvases = () => {
	let canvasWidth = window.innerWidth * CANVAS_SCALE;
	let canvasHeight = window.innerHeight * CANVAS_SCALE;

	canvasWidth = Math.min(canvasWidth, MAX_CANVAS_WIDTH);
	canvasHeight = Math.min(canvasHeight, MAX_CANVAS_HEIGHT);

	starsCanvas = document.getElementById("stars");
	starsCanvas.width = canvasWidth;
	starsCanvas.height = canvasHeight;
	starsContext = starsCanvas.getContext("2d");

	for (let i = 0; i < NUM_CONNECTED_STARS; i++) {
		lineCanvases[i] = document.getElementById("line-" + i);
		lineCanvases[i].width = starsCanvas.width;
		lineCanvases[i].height = starsCanvas.height;
		lineContexts[i] = lineCanvases[i].getContext("2d");
	}
};

const resizeCanvases = () => {
	clearTimeout(resizeTimeout);
	stopAnimationLoop();

	stars = [];
	connectedStars = [];
	document.getElementById("lines").style.opacity = 0;
	document.getElementById("stars").style.opacity = 0;

	resizeTimeout = setTimeout(() => {
		document.getElementById("stars").style.opacity = 1;
		setCanvases();
		drawStars();
	}, RESIZE_DELAY);
};

const setConnectedStars = () => {
	connectedStars[currentLine] = nearbyStars[randomInt(0, nearbyStars.length - 1)];
	currentLine++;

	if (NUM_CONNECTED_STARS <= currentLine) {
		currentLine = 0;
	}
};

const handlePointerMove = (e) => {
	drawLines((e.clientX * CANVAS_SCALE), (e.clientY * CANVAS_SCALE));
};

const drawLines = (posX, posY) => {
	clearTimeout(fadeLinesTimeout);
	document.getElementById("lines").style.opacity = 0.4;

	fadeLinesTimeout = setTimeout(() => {
		document.getElementById("lines").style.opacity = 0;
	}, FADE_LINES_DELAY);

	nearbyStars = stars.filter((star) => {
		const xDistance = Math.abs(star.x - posX);
		const yDistance = Math.abs(star.y - posY);
		const distance = Math.sqrt(xDistance * xDistance + yDistance *
			yDistance);
		return LINES_LENGTH.min <= distance && distance <= LINES_LENGTH
			.max;
	});

	for (let i = 0; i < NUM_CONNECTED_STARS; i++) {
		if (connectedStars[i] && connectedStars[i].x && connectedStars[i].y) {
			lineContexts[i].clearRect(0, 0, lineCanvases[i].width, lineCanvases[
				i].height);
			lineContexts[i].beginPath();
			lineContexts[i].moveTo(connectedStars[i].x, connectedStars[i].y);
			lineContexts[i].lineTo(posX, posY);
			lineContexts[i].strokeStyle = LINE_COLOUR;
			lineContexts[i].stroke();

			for (let j = 0; j < NUM_CONNECTED_STARS; j++) {
				if (connectedStars[j] && connectedStars[j].x && connectedStars[j].y) {
					lineContexts[i].beginPath();
					lineContexts[i].moveTo(connectedStars[i].x, connectedStars[i].y);
					lineContexts[i].lineTo(connectedStars[j].x, connectedStars[j].y);
					lineContexts[i].strokeStyle = LINE_COLOUR;
					lineContexts[i].stroke();
				}
			}
		}
	}
};

const drawStars = () => {
	detachMouseListener();

	for (let i = 0; i < starsCanvas.height; i += ROW_SPACING) {
		drawStarRow(i);
	}

	setTimeout(() => {
		attachMouseListener();
		startAnimationLoop();
	}, STARS_INIT_DELAY);
};

const drawStarRow = (y) => {
	let x = 0;

	while (x < starsCanvas.width) {
		x = randomInt(x + STAR_SPACING.min, x + STAR_SPACING.max);
		const radius = randomInt(STAR_SIZE.min * 10, STAR_SIZE.max * 10) / 10;
		drawStar(x, y, radius);
	}
};

const drawStar = (x, y, r) => {
	setTimeout(() => {
		const newStar = { x, y, r };
		starsContext.beginPath();
		starsContext.arc(newStar.x, newStar.y, newStar.r, 0, 2 * Math
			.PI);
		starsContext.fillStyle = STAR_COLOUR;
		starsContext.fill();
		stars.push(newStar);
	}, randomInt(STAR_DRAW_MIN_DELAY, STAR_DRAW_MAX_DELAY));
};

const twinkle = () => {
	const twinkleStar = stars[randomInt(0, stars.length - 1)];

	if (twinkleStar && twinkleStar.x && twinkleStar.y && twinkleStar.r) {
		twinkleRatio = (twinkleRatio + TWINKLE_RATIO_INCREMENT) % 1;
		const expandedRadius = twinkleStar.r * (1 + twinkleRatio);
		
		starsContext.beginPath();
		starsContext.arc(twinkleStar.x, twinkleStar.y, expandedRadius, 0, 2 * Math.PI);
		starsContext.fillStyle = STAR_COLOUR;
		starsContext.fill();

		setTimeout(() => {
			starsContext.beginPath();
			starsContext.arc(twinkleStar.x, twinkleStar.y, twinkleStar.r, 0, 2 * Math.PI);
			starsContext.fillStyle = STAR_COLOUR;
			starsContext.fill();
		}, TWINKLE_LENGTH);
	}
};

const randomInt = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

document.addEventListener("DOMContentLoaded", initStars);

document.addEventListener("visibilitychange", () => {
	if (document.hidden) {
		stopAnimationLoop();
	} else if (starsInitialized) {
		startAnimationLoop();
	}
});

window.addEventListener("beforeunload", () => {
	detachMouseListener();
	stopAnimationLoop();
});