disableFriendlyErrors = true;

var deck = [2, 3, 4, 5, 6, 7, 8, 9, 10, 2, 3, 4, 5, 6, 7, 8, 9, 10, 2, 3, 4, 5, 6, 7, 8, 9, 10, 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A", "J", "Q", "K", "A", "J", "Q", "K", "A", "J", "Q", "K", "A"];
var playingDeck = [2, 3, 4, 5, 6, 7, 8, 9, 10, 2, 3, 4, 5, 6, 7, 8, 9, 10, 2, 3, 4, 5, 6, 7, 8, 9, 10, 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A", "J", "Q", "K", "A", "J", "Q", "K", "A", "J", "Q", "K", "A"];
var hand = [];
var dealer = [];
var playerHit = true;
var dealerHit = true;

var currentPrompt = ""; // Stores the current text being displayed
var promptIndex = 0; // Index of the current character to be added
var typingTimer; // Timer to control the typing effect

var preAWindowWidth;
var preWindowHeight;
var scaleResolution;

var gameStarted = false;

var messageFlags = {};

var dealerImg;

var aWindowWidth = 1366;

function preload() {
  dealerImg = loadImage('https://m.media-amazon.com/images/I/71lj9cp80dL.jpg');
}

var translateCenter = {
	x: 0,
	y: 0
}
var speedDecay = 0.05;

// Level, 1 = intro, 2 = Menu (depreciated), 3 = CarJack!!
var stage = 1;

var money = 100;
var bet = 0;

//Locked in bet for the game
var gameBet = 0;

var introVar = {
	cubeRotate: 0,
	tankY: 300,
	tankRotate: 0,
	turretRotate: 0,
	bulletX: 454,
	textCover: 0,
	bulletTransparency: 0,
	soundTransparency: 0,
}

var pulse = {
	var: 200,
	rate: 5,
}

var fade = {
	intro: 255,
	out: 0
}

var aTank = {
	x:2000,
	y:600,
	bulletX: 600,
	bulletY: 600,
	speed: 0,
	acceleration: 0.75,
	rotate: 90,
	turretRotateCopy: 0,
	turretRotate: 0,
	control: "wasd",
	aimControl: "mouse",
	firing: true,
	speedMultipler: 0.75,
	speedCost: 200,
	speedLevel: 1,
	reloadRate: 10,
	reloadMax: 60,
	reloadVar: 100,
	type: 1,
	deaths: 0,
	armor: 100,
	armorMax: 100,
	armorLevel: 1,
	armorCost: 200,
	hotCircleSize: 0
};

var tankHover = false;

var keys = [];
var bullets = [];
var treads = [];
var collisions = [];

var keyAim = {
	x: 0,
	y: 0
}

var viewport = {
	x: 0,
	y: -440
}

function bullet(x, y, tankType) {
	this.x = x;
	this.y = y;
	this.rotate = -aTank.turretRotate+90;
	this.life = 0;
	this.tankType = tankType;
};

bullet.prototype.draw = function() {
	fill(255,0,0);
	push();
	translate(this.x,this.y);
	rotate(this.rotate);
	fill(100, 100, 100, 50);
	triangle(-7.5, 9, 7.5, 0, -7.5, -9);
	fill(158, 60, 14);
	triangle(-4.5, 3, 10, 0, -4.5, -3);
	pop();
	this.x += cos(this.rotate) * 25;
	this.y += sin(this.rotate) * 25;
	this.tankType.bulletX += cos(this.tankType.turretRotate) * 25;
	this.tankType.bulletY += sin(this.tankType.turretRotate) * 25;
	this.life += 1;
	if (this.life > 50) {
    //if (this.x < 0 || this.x > aWindowWidth || this.y < 0 || this.y > windowHeight) {
        // Remove the bullet from the bullets array
        let index = bullets.indexOf(this);
        if (index !== -1) {
            bullets.splice(index, 1);
        }
    } else {
        // Check for collision with enemies or other objects if needed
    }
};

function tread(x, y, rotate) {
	this.x = x;
	this.y = y;
	this.rotate = rotate;
	this.a = true;
	this.life = 0;
};

tread.prototype.draw = function() {
	push();
	translate(this.x,this.y);
	rotate(this.rotate+90);
	fill(112, 84, 62);
	rect(-30,0,12.5,87.5,12.5);
	rect(30,0,12.5,87.5,12.5);
	pop();
	this.life += 1;
	if (this.life > 500) {
        let index = treads.indexOf(this);
        if (index !== -1) {
            treads.splice(index, 1);
        }
    }
};

function message(offsetX, offsetY, width, height, curve, tankVar, sentence, func) {
	rect(aWindowWidth/2 + offsetX, windowHeight/2 + offsetY, width, height, curve);
	fill(255);
	text(sentence, aWindowWidth/2 + offsetX, windowHeight/2 + offsetY);

	//Store this message's coords in the messageFlags object to differentiate between messages for collision detection
	var key = offsetX + ',' + offsetY;
    if (messageFlags[key] === undefined) {
		messageFlags[key] = false;
	}

	// Check if the viewport is within the bounds of the message rectangle
	if ((viewport.x < (offsetX + width/2)) && (viewport.x > (offsetX -width/2)) && (viewport.y > -offsetY + -(height/2)) && (viewport.y < -offsetY + (height/2))) {
		if (!messageFlags[key]) {
			func();
			messageFlags[key] = true;
		}
	} else {
		messageFlags[key] = false;
	}
}


function setup() {
	//var canvas = createCanvas(1366, 768);
	createCanvas(windowWidth, windowHeight);
	var canvas = document.querySelector("canvas");
	canvas.style.margin = 'auto';
	document.getElementById("script-holder").appendChild(canvas);
	windowResized();
	
	commsHeight = windowHeight/2 + ((windowHeight/2)/2);
	commsWidth = aWindowWidth/2;
	rectMode(CENTER);
	textAlign(CENTER, CENTER);
	angleMode(DEGREES);
	textStyle(BOLD);
	imageMode(CENTER);
	noStroke();
}

//For a keyCode (I know, I should change it since it's deprecated), set the key to true in an array
function keyPressed() {
	keys[keyCode] = true;
}
function keyReleased() {
	keys[keyCode] = false;
}

//Smooth pulse effect
function pulseMath() {
	pulse.var -= pulse.rate;
	if(pulse.var<125){pulse.rate = -1;}
	if(pulse.var>225){pulse.rate = 1;}
}


//Initialization and game logic
function randomize(arr) {
	for (var i = arr.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
  	}
  	return arr;
}
playingDeck = randomize(playingDeck);

function deal(arr) {
	let card = playingDeck[0];
	arr.push(card);
	playingDeck.splice(0, 1);
}

function score(arr) {
	let total = 0;
	let aces = 0;
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] === "A") {
			total += 11;
			aces++;
		} else if (arr[i] === "J" || arr[i] === "Q" || arr[i] === "K") {
			total += 10;
		} else {
			total += arr[i];
		}
	}
	while (total > 21 && aces > 0) {
		total -= 10;
		aces--;
	}
	return total;
}

function obfuscateHand(arr) {
	var obfuscated = [];
	obfuscated.push(arr[0]);
	for (let i = 1; i < arr.length; i++) {
		obfuscated.push("?");
	}
	return obfuscated;
}

function tankSpawn(tankVar) {
	//Code to smoothly rotate the tank's turret towards the mouse or key aim
	if (tankVar.aimControl === "mouse") {
		tankVar.turretRotateCopy = atan2(mouseX-tankVar.x,mouseY-tankVar.y);
		if (Math.round(tankVar.turretRotateCopy) !== Math.round(tankVar.turretRotate)) {
			var shortestAngle = tankVar.turretRotateCopy - tankVar.turretRotate;
			shortestAngle -= Math.floor((shortestAngle + 180) / 360) * 360; // Ensure the angle is between -180 and 180
			var rotationStep = 1; // Adjust the rotation speed as needed
		
			if (shortestAngle < 0) {
			tankVar.turretRotate -= rotationStep;
			} else if (shortestAngle > 0) {
			tankVar.turretRotate += rotationStep;
			}
		
			if (tankVar.turretRotate < -180) {
			tankVar.turretRotate += 360;
			} else if (tankVar.turretRotate > 180) {
			tankVar.turretRotate -= 360;
			}
		}
	} else {
		tankVar.turretRotateCopy = atan2(keyX-tankVar.x,keyY-tankVar.y);
		if (Math.round(tankVar.turretRotateCopy) !== Math.round(tankVar.turretRotate)) {
			var shortestAngle = tankVar.turretRotateCopy - tankVar.turretRotate;
			shortestAngle -= Math.floor((shortestAngle + 180) / 360) * 360; // Ensure the angle is between -180 and 180
			var rotationStep = 1; // Adjust the rotation speed as needed
		
			if (shortestAngle < 0) {
			tankVar.turretRotate -= rotationStep;
			} else if (shortestAngle > 0) {
			tankVar.turretRotate += rotationStep;
			}
		
			if (tankVar.turretRotate < -180) {
			tankVar.turretRotate += 360;
			} else if (tankVar.turretRotate > 180) {
			tankVar.turretRotate -= 360;
			}
		}
		if(keys[84]) {
			if(keyAim.y > 0) {
				keyAim.y -= 5;
			}
		}
		if(keys[70]) {
			if(keyAim.x > 0) {
				keyAim.x -= 5;
			}
		}
		if(keys[71]) {
			if(keyAim.y < windowHeight) {
				keyAim.y += 5;
			}
		}
		if(keys[72]) {
			if(keyAim.x < aWindowWidth) {
				keyAim.x += 5;
			}
		}
		fill(0);
		rect(keyAim.x, keyAim.y, 5, 25);
		rect(keyAim.x, keyAim.y, 25, 5);
	}
	
		if (tankVar.control == "wasd") {
			if (keyIsPressed) {
				if(keys[65]) {
					if(tankVar.speed > (-2 * tankVar.speedMultipler)) {
						tankVar.rotate -= 3;
					}
				}
				if(keys[68]) {
					if(tankVar.speed > (-2 * tankVar.speedMultipler)) {
						tankVar.rotate +=3;
					}
				}
				if(keys[87]) {
					if(tankVar.speed <= (3 * tankVar.speedMultipler)) {
						tankVar.speed += tankVar.acceleration * tankVar.speedMultipler;
					}
				}
				if (keys[83]) { // "S" key for backward movement
					if (tankVar.speed >= (-3 * tankVar.speedMultipler)) {
						tankVar.speed -= tankVar.acceleration * tankVar.speedMultipler;
					}
				}
				if (tankVar.speed === (3 * tankVar.speedMultipler)) {
					tankVar.speed = 3 * tankVar.speedMultipler;
				} else if (tankVar.speed === (-3 * tankVar.speedMultipler)) {
					tankVar.speed = -3 * tankVar.speedMultipler;
				}
			}
			if((!keys[87]) && (!keys[83])) {
				if (Math.abs(tankVar.speed) <= speedDecay) {
					tankVar.speed = 0;
				} else {
					tankVar.speed -= Math.sign(tankVar.speed) * speedDecay;
				}				  
			}
		} else {
			if (keyIsPressed) {
				if(keys[37]) {
					if(tankVar.speed > (-2 * tankVar.speedMultipler)) {
						tankVar.rotate -=3;
					}
				}
				if(keys[39]) {
					if(tankVar.speed > (-2 * tankVar.speedMultipler)) {
						tankVar.rotate +=3;
					}
				}
				if(keys[38]) {
					if(tankVar.speed <= (3 * tankVar.speedMultipler)) {
						tankVar.speed += tankVar.acceleration * tankVar.speedMultipler;
					}
				}
				if(keys[40]) {
					if(tankVar.speed >= (-3 * tankVar.speedMultipler)) {
						tankVar.speed -= tankVar.acceleration * tankVar.speedMultipler;
					}
				}
				if(!keys[38] && !keys[40]) {
					if (Math.abs(tankVar.speed) <= speedDecay) {
						tankVar.speed = 0;
					} else {
						tankVar.speed -= Math.sign(tankVar.speed) * speedDecay;
					}					  
				}
				if(tankVar.speed === (3 * tankVar.speedMultipler)) {
					tankVar.speed = 3 * tankVar.speedMultipler;
				} else if (tankVar.speed === (-3 * tankVar.speedMultipler)) {
					tankVar.speed = 3 * tankVar.speedMultipler;
				}
			}
		}
	/*} else {
		if (Math.abs(tankVar.speed) <= speedDecay) {
			tankVar.speed = 0;
		} else {
			tankVar.speed -= Math.sign(tankVar.speed) * speedDecay;
		}	
	}*/

	viewport.x += (cos(tankVar.rotate) * tankVar.speed);
	viewport.y += (sin(tankVar.rotate) * tankVar.speed);

	aTank.bulletX = (aWindowWidth/2) - viewport.x;
	aTank.bulletY = (windowHeight/2) - viewport.y;

	treads.push(new tread(tankVar.bulletX, tankVar.bulletY, tankVar.rotate));
		
	if (tankVar.firing) {
		if ((!tankHover)) {
			if(mouseIsPressed){
				if(tankVar.reloadVar == 0){
					bullets.push(new bullet(tankVar.bulletX, tankVar.bulletY, tankVar));
					tankVar.reloadVar = tankVar.reloadMax;
				}
			}
			if(keys[32]){
				if(tankVar.reloadVar == 0){
					bullets.push(new bullet(tankVar.bulletX, tankVar.bulletY, tankVar));
					tankVar.reloadVar = reload.max;
				}
			}
		}
	}
	
	if (tankVar.reloadVar > 0) {
		if ((tankVar.reloadVar - tankVar.reloadRate) >= 0) {
			tankVar.reloadVar -= tankVar.reloadRate;
		}
	}

	if (tankVar.armor < 0) {
		tankVar.deaths += 1;
		tankVar.armor = tankVar.armorMax;
	}

	//Circle bar
	if(keys[67]){
		fill(0, 0, 0, 100);
		ellipse(tankVar.x, tankVar.y, tankVar.hotCircleSize, tankVar.hotCircleSize);

		fill(255,0,0);
		push();
		fill(255);
		textSize(20);
		text("Money", aWindowWidth/2, windowHeight/2 - 100);
		text("Bet", aWindowWidth/2 - 75, windowHeight/2 - 25);
		text("Adjust", aWindowWidth/2 + 75, windowHeight/2 - 25);
		textSize(30);
		text("Start!", aWindowWidth/2, windowHeight/2 + 80);
		text("$" + bet, aWindowWidth/2 - 80, windowHeight/2 + 5);
		text("$" + money, aWindowWidth/2, windowHeight/2 - 70);
		text("-   +", aWindowWidth/2 + 75, windowHeight/2);
		pop();
		
		if (tankVar.hotCircleSize < 250) {
			tankVar.hotCircleSize += 125;
		}
		} else {
			tankVar.hotCircleSize = 0;
		}

		if (mouseIsPressed &&
			((mouseX - (aWindowWidth/2) < 65)) &&
			((mouseX - (aWindowWidth/2) > 45)) &&
			((mouseY - (windowHeight/2) < 15)) &&
			((mouseY - (windowHeight/2) > -10))
		) {
			if ((bet - 5) >= 0) {
				bet -= 5;
			}
		}

		if (mouseIsPressed &&
			((mouseX - (aWindowWidth/2) < 105)) &&
			((mouseX - (aWindowWidth/2) > 80)) &&
			((mouseY - (windowHeight/2) < 15)) &&
			((mouseY - (windowHeight/2) > -10))
		) {
			if ((bet + 5) <= money) {
				bet += 5;
			}
		}

		if (mouseIsPressed &&
			((mouseX - (aWindowWidth/2) < 45)) &&
			((mouseX - (aWindowWidth/2) > -40)) &&
			((mouseY - (windowHeight/2) < 95)) &&
			((mouseY - (windowHeight/2) > 65))
		) {
			if (!gameStarted) {
				if (money - bet >= 0) {
					gameBet = bet;
					gameStarted = true;
					money = money - bet;
					// Reset the dealer and player hands
					dealer = [];
					hand = [];
					// Deal initial cards to both dealer and player
					deal(dealer);
					deal(dealer);
					deal(hand);
					deal(hand);
				}
			}
		}


	//Tank skins
	if (tankVar.type == 1) {
		noStroke();
		push();
		translate(tankVar.x, tankVar.y);
		rotate(tankVar.rotate+90);
		//fill(0, 0, 0, 245);
		//rect(0, -500, 2000, -1000);
		fill(50, 50, 50, 255 * (tankVar.armor/tankVar.armorMax));
		rect(-30,0,12.5,87.5,12.5);
		rect(30,0,12.5,87.5,12.5);
		fill(0, 120, 0, 255 * (tankVar.armor/tankVar.armorMax));
		rect(0,0,50,100,12.5);
		pop();

		push();
		translate(tankVar.x, tankVar.y);
		rotate(-tankVar.turretRotate-180);
		fill(0, 100, 0);
		rect(0,0,37.5,37.5,12.5);
		rect(0,-40,12.5,50 ,0);
		pop();
	}
};

var prompts = [
	"Welcome to CarJack, WMAA's finest blackjack game featuring a tank to\ninteract. Use your WASD keys to tranverse around the world, C for the betting menu,\nand the floor buttons to hit or stand. Fill out your bet and press start to begin!!"
];

function level2() {	
	//Background pulse effect & island rendering
	pulseMath();
	background(-pulse.var, pulse.var - 25, pulse.var + 200);
	push();
	translate(viewport.x, viewport.y);
	fill(255, 245, 190);
	rect(aWindowWidth/2, windowHeight/2, 1000, 1000, 20);
	fill(52, 140, 49);
	rect(aWindowWidth/2, windowHeight/2, 900, 900, 20);
	fill(100, 100, 100);
	fill(150);
	translate(aWindowWidth/2, windowHeight/2 - 250);
	push();
	scale(0.5);
	image(dealerImg, 0, 0);
	pop();
	translate(-aWindowWidth/2, -windowHeight/2 + 250);

	fill(88, 57, 39);

	//The docks
	for (let i = 0; i < 10; i++) {
		rect(aWindowWidth/2, windowHeight/2 + 375 + (i * 25), 150, 25, 20);
	}

	fill(255);
	textSize(50);
	text("Dealer: " + obfuscateHand(dealer).join(", "), aWindowWidth/2, windowHeight/2);
	text("Tank: " + hand.join(", ") + " Score: " + score(hand), aWindowWidth/2, windowHeight/2 + 50);

	//Weird bug where the text "Hit" and "Stand" are on opposite buttons I think
	fill(100);
	textSize(100);
	message(-250, 200, 250, 200, 20, aTank, "Hit", function() {
		if (gameStarted) {}
			if (score(dealer) > 16) {
				let playerScore = score(hand);
				let dealerScore = score(dealer);

				if (playerScore > 21 && dealerScore > 21) {
					prompts[0] = "Both busted! It's a tie! Dealer score: " + dealerScore + "\nPress Start in the betting menu to restart!";
					money = money + gameBet;
					gameStarted = false;
				} else if (playerScore === 21 && dealerScore !== 21) {
					prompts[0] = "Blackjack! You win! Dealer score: " + dealerScore + "\nPress Start in the betting menu to restart!";
					money = money + gameBet * 2;
					gameStarted = false;
				} else if (dealerScore === 21 && playerScore !== 21) {
					prompts[0] = "Dealer has blackjack! Dealer wins! Dealer score: " + dealerScore + "\nPress Start in the betting menu to restart!";
					gameStarted = false;
				} else if (playerScore === 21 && dealerScore === 21) {
					prompts[0] = "Both have blackjack! It's a tie! Dealer score: " + dealerScore + "\nPress Start in the betting menu to restart!";
					money = money + gameBet;
					gameStarted = false;
				} else if (playerScore > 21 && dealerScore <= 21) {
					prompts[0] = "You busted! Dealer wins! Dealer score: " + dealerScore + "\nPress Start in the betting menu to restart!";
					gameStarted = false;
				} else if (dealerScore > 21 && playerScore <= 21) {
					prompts[0] = "Dealer busted! You win! Dealer score: " + dealerScore + "\nPress Start in the betting menu to restart!";
					money = money + gameBet * 2;
					gameStarted = false;
				} else if (playerScore < dealerScore && dealerScore <= 21) {
					prompts[0] = "The dealer wins! Dealer score: " + dealerScore + "\nPress Start in the betting menu to restart!";
					gameStarted = false;
				} else if (playerScore > dealerScore && playerScore <= 21) {
					prompts[0] = "You win! Dealer score: " + dealerScore + "\nPress Start in the betting menu to restart!";
					money = money + gameBet * 2;
					gameStarted = false;
				} else if (playerScore === dealerScore) {
					prompts[0] = "It's a tie! Dealer score: " + dealerScore + "\nPress Start in the betting menu to restart!";
					money = money + gameBet;
					gameStarted = false;
				} else {
					prompts[0] = "Unexpected outcome! Dealer score: " + dealerScore + "\nPress Start in the betting menu to restart!";
					gameStarted = false;
				}
			} else {
				deal(dealer);
			}
		
	});

	fill(100);
	textSize(80);
	message(250, 200, 250, 200, 20, aTank, "Stand", function() {
		if (gameStarted) {
			deal(hand);
			if (score(hand) > 21) {
				prompts[0] = "You busted! Dealer score: " + score(dealer) + "\nPress Start in the betting menu to restart!";
				gameStarted = false;
			}
		}
	});

	// Draw the tank and its treads
	for (let i = 0; i < bullets.length; i++) {
		bullets[i].draw();
	}
	for (let i = 0; i < treads.length; i++) {
		treads[i].draw();
	}
	pop();

	tankSpawn(aTank);

	// Start the typing effect when the currentPrompt is not equal to prompts[0]
	if (currentPrompt !== prompts[0]) {
		// Check if the prompt is fully displayed
		if (promptIndex < prompts[0].length) {
			// If not, continue adding characters to the currentPrompt
			currentPrompt += prompts[0].charAt(promptIndex);
			promptIndex++;
		} else {
			currentPrompt = prompts[0];
		}	
	}

	// Draw the current prompt text
	strokeWeight(4);
	stroke(0);
	fill(255);
	textSize(40);
	text(currentPrompt, commsWidth, commsHeight);
	strokeWeight(0);
	stroke(255, 204, 100);

	// Slow the tank if out of bounds
	if((viewport.x > 450) || (viewport.x < -450) || (viewport.y < -450) || (viewport.y > 450)) {
		aTank.speed = 0;
	}

	// Fade in the screen, or moreso fade out of the previous screen
	if (fade.intro > 0) {
		fill(0, 0, 0, fade.intro);
		rect(aWindowWidth/2, windowHeight/2, aWindowWidth, windowHeight);
		fade.intro -= 2.5;
	}
}

//Outputs values to cursor position for debugging
function debug() {
	fill(255, 0, 0);
	textSize(25);
	text(mouseX - (aWindowWidth/2), mouseX + 40, mouseY + 5)
	text(mouseY - (windowHeight/2), mouseX + 40, mouseY + 35)
	/*
	if (keyIsPressed) {
		if(keys[73]) {
			viewport.y += 5;
		}
		if(keys[74]) {
			viewport.x += 5;
		}
		if(keys[75]) {
			viewport.y -= 5;
		}
		if(keys[76]) {
			viewport.x -= 5;
		}
		if(keys[89]) {
			aTank.armor += 5;
		}
		if(keys[72]) {
			aTank.armor -= 5;
		}
	}
	*/
}

//Debug screen size: 1704, 959
//Called to set window parameters & whenever rescaled
function windowResized() {
	//Keep a consistent aspect ratio of 16:9, aWindowWidth is the actual width of the canvas
	aWindowWidth = Math.floor(windowHeight * (16/9));

	//Coords to render the tank at the center of the screen
	aTank.x = Math.floor(aWindowWidth/2);
	aTank.y = Math.floor(windowHeight/2);
	aTank.bulletX = (aWindowWidth/2) - viewport.x;
	aTank.bulletY = (windowHeight/2) - viewport.y;
	//Half of the difference of the Chromebook res to native, in order to port over Chromebook-screen designed code
	translateCenter.x = (aWindowWidth - 1366)/2;
	translateCenter.y = (windowHeight - 768)/2;

	scaleResolution = windowHeight/853;
	//"Communications" text coords
	commsHeight = windowHeight/2 + ((windowHeight/2)/2);
	commsWidth = aWindowWidth/2;
	resizeCanvas(aWindowWidth, windowHeight);

	//Reset treads due to rescaling bug, bandage
	treads.length = 0;
}

function draw() {
	level2();
	//debug();
}