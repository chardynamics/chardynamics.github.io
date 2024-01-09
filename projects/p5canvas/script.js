let canvasHeight = 60;
let canvasWidth = 50;
let code;
let inputValue;

function setup() {
	var canvas = createCanvas(canvasHeight, canvasWidth);
	canvas.style('margin', 'auto');
	canvas.parent('script-holder');
	
	rectMode(CENTER);
	angleMode(DEGREES);
	noStroke();
	
	var privacyBanner = document.querySelectorAll("[data-gg-privacy-banner-anchor]");
	for (var i = 0; i < privacyBanner.length; i++) {
		privacyBanner[i].parentNode.removeChild(privacyBanner[i]);
	}
}

function draw() {
	clear();
	eval(code);
}

function update() {
	inputValue = document.getElementById("input").value;
	code = inputValue;
}

function changeHeight(newHeight) {
	canvasHeight = newHeight;
	resizeCanvas(canvasHeight, canvasWidth);
}

function changeWidth(newWidth) {
	canvasWidth = newWidth;
	resizeCanvas(canvasHeight, canvasWidth);
}

function windowResized() {
	resizeCanvas(canvasHeight, canvasWidth);
}
 
