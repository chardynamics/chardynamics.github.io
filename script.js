disableFriendlyErrors = true;

// Level, 1 = intro, 2 = Menu, 3 = TankJack!!
var stage = 2;
var money = 100;
var bet = 0;
var gameBet = 0;
// Blackjack game variables
var blackjack = {
	masterDeck: [2, 3, 4, 5, 6, 7, 8, 9, 10, 2, 3, 4, 5, 6, 7, 8, 9, 10, 2, 3, 4, 5, 6, 7, 8, 9, 10, 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A", "J", "Q", "K", "A", "J", "Q", "K", "A", "J", "Q", "K", "A"],
	playingDeck: [2, 3, 4, 5, 6, 7, 8, 9, 10, 2, 3, 4, 5, 6, 7, 8, 9, 10, 2, 3, 4, 5, 6, 7, 8, 9, 10, 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A", "J", "Q", "K", "A", "J", "Q", "K", "A", "J", "Q", "K", "A"],
	hand: [],
	dealer: []
}
//Dealer image
var dealerImg;
var tellerImg;
function preload() {
  dealerImg = loadImage('https://m.media-amazon.com/images/I/71lj9cp80dL.jpg');
  tellerImg = loadImage('https://thumbs.dreamstime.com/b/bank-teller-wearing-glasses-white-shirt-smiling-assisting-customer-handing-currency-over-counter-office-bank-371626367.jpg');
}

var debtTime;
var totalDebts = 3;
var repayDebt = 0;
var borrowAmount = 0;
var canBorrow = true;
//Borrow or Repayment
var debtSelection = "Borrow";

var currentPrompt = ""; // Stores the current text being displayed
var promptIndex = 0; // Index of the current character to be added
var typingTimer; // Timer to control the typing effect

var gameStarted = false;

//Button activated coords
var messageFlags = {};

//Scaling resolution variables
var scaleResolution = 1;
var aWindowWidth = 1366;
var translateCenter = {
	x: 0,
	y: 0
}
var center = {
	x: 0,
	y: 0
}
var viewport = {
	x: 0,
	y: -440
}

//Game-wide variables
var pulse = {
	var: 200,
	rate: 5,
}
var fade = {
	intro: 255,
	out: 0
}

var introVar = {
	cubeRotate: 0,
	tankY: 800,
	tankRotate: 0,
	turretRotate: 0,
	bulletX: 454,
	textCover: 0,
	bulletTransparency: 0,
	soundTransparency: 0,
}

var aTank = {
	x:2000,
	y:600,
	bulletX: 600,
	bulletY: 600,
	speed: 0,
	speedDecay: 0.05,
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

var keys = [];
var bullets = [];
var treads = [];
var collisions = [];
var boards = [];
var trees = [];
var bushes = [];

var keyAim = {
	x: 0,
	y: 0
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

function tread(centerX, centerY, bulletX, bulletY, rotate, color) {
    // Store offset from center at creation
    this.offsetX = bulletX - centerX;
    this.offsetY = bulletY - centerY;
    this.rotate = rotate;
    this.a = true;
    this.life = 0;
    this.color = color || [112, 84, 62];
}

tread.prototype.draw = function() {
    push();
    // Draw at the correct world position, regardless of center/viewport changes
    let drawX = center.x + this.offsetX;
    let drawY = center.y + this.offsetY;
    translate(drawX, drawY);
    rotate(this.rotate + 90);
    fill(this.color[0], this.color[1], this.color[2], 255 * (1 - (this.life / 500)));
    rect(-30, 0, 12.5, 87.5, 12.5);
    rect(30, 0, 12.5, 87.5, 12.5);
    pop();
    this.life += 1;
    if (this.life > 500) {
        let index = treads.indexOf(this);
        if (index !== -1) {
            treads.splice(index, 1);
        }
    }
};

function board(x, y) {
	this.x = x;
	this.y = y;
	this.color = [60 + 28*Math.random(),  57, 39];
};

board.prototype.draw = function() {
	push();
	translate(this.x,this.y);
	fill(this.color[0], this.color[1], this.color[2]);
	rect(0, 0, 150, 25, 20);
	pop();
};

function message(offsetX, offsetY, width, height, curve, tankVar, sentence, func) {
	rect(((center.x) + offsetX), ((center.y) + offsetY), width, height, curve);
	fill(255);
	text(sentence, center.x + offsetX, center.y + offsetY);

	//Store this message's coords in the messageFlags object to differentiate between messages for collision detection
	var key = offsetX + ',' + offsetY;
    if (messageFlags[key] === undefined) {
		messageFlags[key] = false;
	}

	// Check if the viewport is within the bounds of the message rectangle
	if ((viewport.x > (-offsetX - width/2)) && (viewport.x < (-offsetX +width/2)) && (viewport.y > -offsetY + -(height/2)) && (viewport.y < -offsetY + (height/2))) {
		if (!messageFlags[key]) {
			func();
			messageFlags[key] = true;
		}
	} else {
		messageFlags[key] = false;
	}
}

function setup() {
	//createCanvas(1366, 768);
	createCanvas(windowWidth, windowHeight);
	var canvas = document.querySelector("canvas");
	canvas.style.margin = 'auto';
	document.getElementById("script-holder").appendChild(canvas);
	windowResized();
	
	commsHeight = center.y + ((center.y)/2);
	commsWidth = center.x;
	rectMode(CENTER);
	textAlign(CENTER, CENTER);
	angleMode(DEGREES);
	textStyle(BOLD);
	imageMode(CENTER);
	noStroke();
}

function keyPressed() {
	keys[event.key.toLowerCase()] = true;
}
function keyReleased() {
	keys[event.key.toLowerCase()] = false;
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
blackjack.playingDeck = randomize(blackjack.playingDeck);

function deal(arr) {
	let card = blackjack.playingDeck[0];
	arr.push(card);
	blackjack.playingDeck.splice(0, 1);
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

var points = [];



function bush(x, y) {
    this.x = x;
    this.y = y;
    this.rotate = Math.random() * 360;
	this.leafColor = random(-10, 10);
	this.type = "" || "Bush";
	
	if (random() >= 0.75) {
		this.type = "Rock";
	}

    // Generate leaf points once
    this.leafPoints = [];
    let r = 20;
    let bumps = 5;
    for (let i = 0; i < bumps; i++) {
        let angle = 360 * i / bumps;
        let pointR = (r - 2) + 2 * random();
        let px = pointR * cos(angle);
        let py = pointR * sin(angle);
        this.leafPoints.push([px, py]);
    }
}

bush.prototype.draw = function() {
    push();
    translate(this.x, this.y);
    rotate(this.rotate);

    // Draw leaves with a more saturated, lighter green and a dark outline
    for (let i = 0; i < this.leafPoints.length; i++) {
        // Lighter, more yellow-green fill for contrast
        fill(40 + this.leafColor, 70 + this.leafColor, 20 + this.leafColor, 180);
        ellipse(this.leafPoints[i][0], this.leafPoints[i][1], 50, 50);
    }
    pop();
};


function tree(x, y) {
    this.x = x;
    this.y = y;
    this.rotate = Math.random() * 360;
    this.trunkX = random(-5, 5);
    this.trunkY = random(-5, 5);
	this.trunkColor = random(-5, 5);
	this.leafColor = random(-10, 10);

    // Generate leaf points once
    this.leafPoints = [];
    let r = 100;
    let bumps = 5;
    for (let i = 0; i < bumps; i++) {
        let angle = 360 * i / bumps;
        let pointR = (r - 25) + 25 * random();
        let px = pointR * cos(angle);
        let py = pointR * sin(angle);
        this.leafPoints.push([px, py]);
    }
}

tree.prototype.draw = function() {
    push();
    translate(this.x, this.y);
    rotate(this.rotate);

    fill(194 + this.trunkColor, 100 + this.trunkColor, 98 + this.trunkColor);
    ellipse(this.trunkX, this.trunkY, 75, 75);

    // Draw leaves with a more saturated, lighter green and a dark outline
    for (let i = 0; i < this.leafPoints.length; i++) {
        // Lighter, more yellow-green fill for contrast
        fill(120 + this.leafColor, 200 + this.leafColor, 80 + this.leafColor, 100);
        ellipse(this.leafPoints[i][0], this.leafPoints[i][1], 200, 200);
    }
    pop();
};

function island(cx, cy) {
    let r = (1000 / 2) - 200;
    let bumps = 11;
    var irregularBump = Math.round(Math.random() * bumps);
    var irregularBump2 = Math.round(Math.random() * bumps);
    // Store bumps and the original center offset from center.x/center.y
    let islandPoints = [irregularBump, irregularBump2, cx - center.x, cy - center.y];
    for (let i = 0; i < bumps; i++) {
        let angle = 360 * i / bumps;
        let pointX = ((r - 50) + 50 * Math.random()) * cos(angle);
        let pointY = ((r - 50) + 50 * Math.random()) * sin(angle);
        islandPoints.push([pointX, pointY]);
    }
    points.push(islandPoints);
}

function islandDraw(idx) {
    let island = points[idx];
    if (!island) return;
    let irregularBump = island[0];
    let irregularBump2 = island[1];
    // Use current center.x and center.y
    let cx = center.x + island[2];
    let cy = center.y + island[3];
    for (let i = 4; i < island.length; i++) {
        let px = cx + island[i][0];
        let py = cy + island[i][1];
        if (i - 4 === irregularBump || i - 4 === irregularBump2) {
            fill(255, 220, 120);
            ellipse(px, py, 750, 750);
        } else {
            fill(255, 220, 120);
            ellipse(px, py, 650, 650);
        }
    }
    for (let i = 4; i < island.length; i++) {
        let px = cx + island[i][0];
        let py = cy + island[i][1];
        if (i - 4 === irregularBump || i - 4 === irregularBump2) {
            fill(52, 140, 49);
            ellipse(px, py, 650, 650);
        } else {
            fill(52, 140, 49);
            ellipse(px, py, 550, 550);
        }
    }
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
				if(keys["a"]) {
					if(tankVar.speed > (-2 * tankVar.speedMultipler)) {
						tankVar.rotate -= 3;
					}
				}
				if(keys["d"]) {
					if(tankVar.speed > (-2 * tankVar.speedMultipler)) {
						tankVar.rotate +=3;
					}
				}
				if(keys["w"]) { // "W" key for forward movement
					if(tankVar.speed <= (3 * tankVar.speedMultipler)) {
						tankVar.speed += tankVar.acceleration * tankVar.speedMultipler;
					}
				}
				if (keys["s"]) { // "S" key for backward movement
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
			if((!keys["w"]) && (!keys["s"])) {
				if (Math.abs(tankVar.speed) <= tankVar.speedDecay) {
					tankVar.speed = 0;
				} else {
					tankVar.speed -= Math.sign(tankVar.speed) * tankVar.speedDecay;
				}				  
			}
		} else {
			if (keyIsPressed) {
				if(keys["arrowleft"]) {
					if(tankVar.speed > (-2 * tankVar.speedMultipler)) {
						tankVar.rotate -=3;
					}
				}
				if(keys["arrowright"]) {
					if(tankVar.speed > (-2 * tankVar.speedMultipler)) {
						tankVar.rotate +=3;
					}
				}
				if(keys["arrowup"]) {
					if(tankVar.speed <= (3 * tankVar.speedMultipler)) {
						tankVar.speed += tankVar.acceleration * tankVar.speedMultipler;
					}
				}
				if(keys["arrowdown"]) {
					if(tankVar.speed >= (-3 * tankVar.speedMultipler)) {
						tankVar.speed -= tankVar.acceleration * tankVar.speedMultipler;
					}
				}
				if(!keys["arrowup"] && !keys["arrowdown"]) {
					if (Math.abs(tankVar.speed) <= tankVar.speedDecay) {
						tankVar.speed = 0;
					} else {
						tankVar.speed -= Math.sign(tankVar.speed) * tankVar.speedDecay;
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
		if (Math.abs(tankVar.speed) <= tankVar.speedDecay) {
			tankVar.speed = 0;
		} else {
			tankVar.speed -= Math.sign(tankVar.speed) * tankVar.speedDecay;
		}	
	}*/

	viewport.x += (cos(tankVar.rotate) * tankVar.speed);
	viewport.y += (sin(tankVar.rotate) * tankVar.speed);

	aTank.bulletX = (center.x) - viewport.x;
	aTank.bulletY = (center.y) - viewport.y;

	treads.push(new tread(center.x, center.y, tankVar.bulletX, tankVar.bulletY, tankVar.rotate, [(90 + pulse.var * 0.15), (60 + pulse.var * 0.08), (30 + pulse.var * 0.04)]));
		
	if (tankVar.firing) {
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
	if(keys["c"]){
		fill(0, 0, 0, 100);
		ellipse(tankVar.x, tankVar.y, tankVar.hotCircleSize, tankVar.hotCircleSize);

		fill(255,0,0);
		push();
		fill(255);
		textSize(20);
		text("Money", center.x, center.y - 100);
		textSize(30);
		text("$" + money, center.x, center.y - 70);
		if ((stage === 3)) {
			textSize(20);
			text("Bet", center.x - 75, center.y - 25);
			text("Adjust", center.x + 75, center.y - 25);
			textSize(30);
			text("Start!", center.x, center.y + 80);
			text("$" + bet, center.x - 75, center.y + 5);
			text("-   +", center.x + 75, center.y);
		}

		if (stage === 2) {
			if (debtSelection === "Repayment") {
				fill(255);
				textSize(15);
				text("Repayment", center.x - 75, center.y - 25);
				textSize(20);
				text("Adjust", center.x + 75, center.y - 25);
				textSize(30);
				text("Repay", center.x, center.y + 80);
				text("$" + repayDebt, center.x - 75, center.y + 5);
				text("-   +", center.x + 75, center.y);
			} else {
				fill(255);
				textSize(15);
				text("Borrow", center.x - 75, center.y - 25);
				textSize(20);
				text("Adjust", center.x + 75, center.y - 25);
				textSize(30);
				text("Borrow", center.x, center.y + 80);
				text("$" + borrowAmount, center.x - 75, center.y + 5);
				text("-   +", center.x + 75, center.y);
			}
		}
		
		if (tankVar.hotCircleSize < 250) {
			tankVar.hotCircleSize += 125;
		}
		} else {
			tankVar.hotCircleSize = 0;
		}

		if (stage === 3) {
			if (mouseIsPressed &&
				((mouseX - (center.x) < 65)) &&
				((mouseX - (center.x) > 45)) &&
				((mouseY - (center.y) < 15)) &&
				((mouseY - (center.y) > -10))
			) {
				if ((bet - 5) >= 0) {
					bet -= 5;
				}
			}

			if (mouseIsPressed &&
				((mouseX - (center.x) < 105)) &&
				((mouseX - (center.x) > 80)) &&
				((mouseY - (center.y) < 15)) &&
				((mouseY - (center.y) > -10))
			) {
				if ((bet + 5) <= money) {
					bet += 5;
				}
			}

			if (mouseIsPressed &&
				((mouseX - (center.x) < 45)) &&
				((mouseX - (center.x) > -40)) &&
				((mouseY - (center.y) < 95)) &&
				((mouseY - (center.y) > 65))
			) {
				if (!gameStarted && stage === 3) {
					if (money - bet >= 0) {
						prompts[0] = "";
						gameBet = bet;
						gameStarted = true;
						money = money - bet;
						// Reset the dealer and player hands
						blackjack.playingDeck = randomize(blackjack.masterDeck.slice());
						blackjack.dealer = [];
						blackjack.hand = [];
						// Deal initial cards to both dealer and player
						deal(blackjack.dealer);
						deal(blackjack.dealer);
						deal(blackjack.hand);
						deal(blackjack.hand);
					}
				}
			}
		}

		if (stage === 2) {
			//Repayment logic
			if (debtSelection === "Repayment") {
				if (mouseIsPressed &&
					((mouseX - (center.x) < -33)) &&
					((mouseX - (center.x) > -115)) &&
					((mouseY - (center.y) < -15)) &&
					((mouseY - (center.y) > -33))
				) {
					debtSelection = "Borrow";
					borrowAmount = 0;
				}

				if (mouseIsPressed &&
					((mouseX - (center.x) < 65)) &&
					((mouseX - (center.x) > 45)) &&
					((mouseY - (center.y) < 15)) &&
					((mouseY - (center.y) > -10))
				) {
					if ((repayDebt - 1) >= 0) {
						repayDebt -= 1;
					}
				}

				if (mouseIsPressed &&
					((mouseX - (center.x) < 105)) &&
					((mouseX - (center.x) > 80)) &&
					((mouseY - (center.y) < 15)) &&
					((mouseY - (center.y) > -10))
				) {
					if ((repayDebt + 1) <= totalDebts) {
						repayDebt += 1;
					}
				}

				if (mouseIsPressed &&
					((mouseX - (center.x) < 45)) &&
					((mouseX - (center.x) > -40)) &&
					((mouseY - (center.y) < 95)) &&
					((mouseY - (center.y) > 65))
				) {
					if (((money - repayDebt) >= 0) && (totalDebts > 0)) {
						money -= repayDebt;
						totalDebts -= repayDebt;
					}
				}
			} else {
				//Borrow logic
				if (mouseIsPressed &&
					((mouseX - (center.x) < -33)) &&
					((mouseX - (center.x) > -115)) &&
					((mouseY - (center.y) < -15)) &&
					((mouseY - (center.y) > -33))
				) {
					debtSelection = "Repayment";
					repayDebt = 0;
				}

				if (mouseIsPressed &&
					((mouseX - (center.x) < 65)) &&
					((mouseX - (center.x) > 45)) &&
					((mouseY - (center.y) < 15)) &&
					((mouseY - (center.y) > -10))
				) {
					if ((borrowAmount - 1) >= 0) {
						repayDebt -= 1;
					}
				}

				if (mouseIsPressed &&
					((mouseX - (center.x) < 105)) &&
					((mouseX - (center.x) > 80)) &&
					((mouseY - (center.y) < 15)) &&
					((mouseY - (center.y) > -10))
				) {
					if (canBorrow) {
						borrowAmount += 1;
					}
				}

				if (mouseIsPressed &&
					((mouseX - (center.x) < 45)) &&
					((mouseX - (center.x) > -40)) &&
					((mouseY - (center.y) < 95)) &&
					((mouseY - (center.y) > 65))
				) {
					//TODO: change canBorrow to false if debtTime is past a certain amount - say 7 days
					money += borrowAmount;
					if (debtTime === undefined) {
						debtTime = new Date();
					}
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
	"Welcome to TankJack! Test your wits and intelligent wagering abilities\nin dealing with your skill and risk management.\nBeat the bank and make millions at the same time.\nDrive over floor buttons to interact and C for a hotmenu!",
	"Welcome to TankJack!\nUse your WASD keys to tranverse around the world, drive over the\nfloor buttons to hit or stand, and press C to interact with your bet.\nFill out your bet and press start to begin!!"
];

function intro() {
	introVar.cubeRotate += 5;
	if (introVar.tankY > 682.5) {
		introVar.tankY -= 1.25;
	}
	if ((introVar.tankY == 682.5) && (introVar.tankRotate < 25)) {
		introVar.tankRotate += 1;
		introVar.turretRotate = introVar.tankRotate;
	}
	if (introVar.tankRotate == 25 && introVar.turretRotate < 90) {
		introVar.turretRotate += 1;
	}
	if (introVar.turretRotate == 90) {
		if (introVar.bulletX <= 1525) {
			introVar.bulletX += 8;
		}
		if ((introVar.bulletX >= 497)) {
			introVar.bulletTransparency = 255;
			introVar.soundTransparency = 50;
		}
	}
	if ((introVar.bulletX >= 536)) {
		introVar.textCover += 8;
	}
	if ((introVar.bulletX >= 1525) && (fade.out < 255)) {
		fade.out += 2.5;
	}
	
	background(0);
	push();
	translate(translateCenter.x, translateCenter.y);
	scale(scaleResolution);
	//Logo texts
	fill(255, 255, 255);
	textSize(725);
	text("DP", 625, 347.5);
	textSize(75);
	text("roductions", 1010, 550.5);
	//Cube
	push();
	translate(150, 675);
	rotate(introVar.cubeRotate);
	fill(-pulse.var, pulse.var, pulse.var + 100);
	rect(0, 0, 125, 125, 15);
	pop();
	textSize(75);
	text("X", 150, 680);

	//Tank & turret
	push();
	translate(400, introVar.tankY);
	fill(50, 0, 0);
	push();
	scale(3);
	rect(-12,0,5,35,5);
	rect(12,0,5,35,5);
	fill(0, 120, 0);
	rect(0,0,20,40,5);
	pop();
	pop();
	push();
	translate(400, introVar.tankY);
	rotate(introVar.turretRotate);
	fill(0, 100, 0);
	push();
	scale(3);
	rect(0,0,15,15,5);
	rect(0,-20,5,25,0);
	pop();
	pop();
	//...and more text & bullet
	textSize(125);
	text("...and more", 900, 700);
	rectMode(CORNER);
	fill(0);
	rect(570, 625, introVar.textCover, 122);
	push();
	translate(introVar.bulletX, 662.5);
	fill(100, 100, 100, introVar.soundTransparency);
	triangle(-7.5, 45, 40, 17.5, -7.5, -9);
	fill(158, 60, 14, introVar.bulletTransparency);
	triangle(2, 27.5, 45, 17.5, 2, 10);
	pop();
	rectMode(CENTER);
	pop();
	
	if (fade.intro > 0) {
		fill(0, 0, 0, fade.intro);
		rect(center.x, center.y, aWindowWidth, windowHeight);
		fade.intro -= 2.5;
	}

	fill(0, 0, 0, fade.out);
	rect(center.x, center.y, aWindowWidth, windowHeight);
	
	if (fade.out >= 255) {
		fade.intro = 255;
		stage = 2;
	}
}

function menu() {
	if (boards.length < 30) {
		for (let i = 0; i < 30; i++) {
			boards.push(new board(0, i * 25));
		}
	}

	if (points.length < 5) {
		island(center.x, center.y);
		island(center.x - 1100, center.y - 1100);
		island(center.x + 1100, center.y - 1100);
		island(center.x - 1100, center.y + 1100);
		island(center.x + 1100, center.y + 1100);
	}

	if (bushes.length < points.length * 5) {
		let r = (1000 / 2); // Use the same radius as your island
		for (let i = 0; i < points.length; i++) {
			let cx = center.x + points[i][2];
			let cy = center.y + points[i][3];
			let usedAngles = [];
			for (let j = 0; j < 15; j++) {
				let angle;
				let valid;
				do {
					angle = random(0, 360);
					valid = true;
					for (let k = 0; k < usedAngles.length; k++) {
						// Check if angle is within 10 degrees of any used angle (account for wrap-around)
						let diff = Math.abs(angle - usedAngles[k]);
						if (diff > 180) diff = 360 - diff;
						if (diff < 10) {
							valid = false;
							break;
						}
					}
					// Also check forbidden ranges
					if (
						(angle > 35 && angle < 55) ||
						(angle > 125 && angle < 155) ||
						(angle > 215 && angle < 235) ||
						(angle > 305 && angle < 325)
					) {
						valid = false;
					}
				} while (!valid);
				usedAngles.push(angle);
				let dist = random(r * 0.70, r);
				let bx = cx + dist * cos(angle);
				let by = cy + dist * sin(angle);
				bushes.push(new bush(bx, by));
			}
		}
	}

	if (trees.length < points.length) {
		let r = (1000 / 2); // Use the same radius as your island
		for (let i = 0; i < points.length; i++) {
			let cx = center.x + points[i][2];
			let cy = center.y + points[i][3];
			let usedAngles = [];
			for (let j = 0; j < 4; j++) {
				let angle;
				let valid;
				do {
					angle = random(0, 360);
					valid = true;
					// Check for minimum angle spacing
					for (let k = 0; k < usedAngles.length; k++) {
						let diff = Math.abs(angle - usedAngles[k]);
						if (diff > 180) diff = 360 - diff;
						if (diff < 25) {
							valid = false;
							break;
						}
					}
					// Check forbidden angle ranges
					if (
						(angle > 35 && angle < 55) ||
						(angle > 125 && angle < 155) ||
						(angle > 215 && angle < 235) ||
						(angle > 305 && angle < 325)
					) {
						valid = false;
					}
				} while (!valid);
				usedAngles.push(angle);
				let dist = random(r * 0.70, r);
				let bx = cx + dist * cos(angle);
				let by = cy + dist * sin(angle);
				trees.push(new tree(bx, by));
			}
		}
	}
	pulseMath();
	background(-pulse.var, pulse.var - 25, pulse.var + 200);
	push();
	translate(viewport.x, viewport.y);
	islandDraw(0);
	fill(255, 245, 190);
	textSize(50);
	rect(center.x, center.y, 625, 375, 20);
	fill(255);
	textSize(100);
	text("TankJack", center.x, center.y - 250);
	push();
	fill(255);
	stroke(0);
	strokeWeight(4);
	textSize(30);
	text("Version 0.0.1\n- Menu selection screen added\nPlans:\n- Add Wordle clone (Tankle)\n- Add a collision system\n- Add a racing game\n- Add dynamic island drawing mechanism", center.x, center.y);
	pop();

	//Gambling
	islandDraw(1);
	fill(255);
	textSize(100);
	text("Speculation 🎰", center.x- 1100, center.y - 1400);
	fill(100);
	textSize(75);
	message(-1350, -1200, 400, 175, 20, aTank, "TankJack", function() {
		currentPrompt = "";
		promptIndex = 0;
		stage = 3;
		treads.length = 0;
		viewport.x = 0;
		viewport.y = -440;
	});
	textSize(50);
	text("Closest to 21\nwins!", center.x - 950, center.y - 1200);
	islandDraw(2);
	fill(255);
	textSize(100);
	text("Morning ☀️", center.x + 1100, center.y - 1400);
	fill(100);
	textSize(75);
	message(850, -1200, 400, 175, 20, aTank, "Tankle", function() {
		currentPrompt = "";
		promptIndex = 0;
		stage = 3;
		treads.length = 0;
		viewport.x = 0;
		viewport.y = -440;
	});
	textSize(50);
	text("Can you guess\nthe word in\n6 tries?", center.x + 1250, center.y - 1200);
	islandDraw(3);
	fill(255);
	textSize(75);
	text("Bank of Tank", center.x - 1100, center.y + 700);
	image(tellerImg, center.x - 1100, center.y + 900);
	textSize(50);
	text("Total Debt: $" + totalDebts + " Due Date: ", center.x - 1100, center.y + 1100);
	textSize(50);
	text("Press C and click on Repayment/Borrow\nto deal with your liabilities", center.x - 1100, center.y + 1300);
	islandDraw(4);
	fill(255);
	textSize(100);
	text("Racing 🏎️", center.x + 1100, center.y + 700);
	fill(100);
	textSize(75);
	message(1200, 900, 400, 175, 20, aTank, "Rush", function() {
		currentPrompt = "";
		promptIndex = 0;
		stage = 3;
		treads.length = 0;
		viewport.x = 0;
		viewport.y = -440;
	});
	textSize(50);
	text("A racing game!", center.x + 800, center.y + 900);
	push();
	fill(255);
	stroke(0);
	strokeWeight(4);
	textSize(30);
	text("Version 0.0.1\n- Menu selection screen added\nPlans:\n- Add Wordle clone (Tankle)\n- Add a collision system\n- Add a racing game\n- Add dynamic island drawing mechanism", center.x, center.y);
	pop();
	//TankJack button
	/*
	message(-250, -150, 250, 200, 20, aTank, "TankJack", function() {
		stage = 3;
		treads.length = 0;
		viewport.x = 0;
		viewport.y = -440;
	});

	fill(100);
	textSize(50);
	//Freestyle drawing button
	message(250, -150, 250, 200, 20, aTank, "TreadDraw", function() {
		stage = 4;
		treads.length = 0;
		viewport.x = 0;
		viewport.y = -440;
	});

	fill(100);
	textSize(50);
	//Wordle clone button
	message(250, 100, 250, 200, 20, aTank, "Tankle (WIP)", function() {
		stage = 4;
		treads.length = 0;
		viewport.x = 0;
		viewport.y = -440;
	});

	fill(100);
	textSize(50);
	//Wordle clone button
	message(-250, 100, 250, 200, 20, aTank, "Bounty Hunting", function() {
		stage = 4;
		treads.length = 0;
		viewport.x = 0;
		viewport.y = -440;
	});
	*/
	//The docks
	push();
	translate(center.x, center.y + 450);
	for (let i = 0; i < 15; i++) {
		boards[i].draw();
	}
	pop();

	fill(255);
	text("Too far in debt?\n\nSurrender here", center.x, center.y + 900);
	push();
	translate(center.x, center.y);
	rotate(45);
	for (let i = 0; i<4; i++) {
		rotate(90 * i);
		translate(0, 400);
		for (let i = 0; i < boards.length; i++) {
			boards[i].draw();
		}
		translate(0, -400);
	}
	pop();
	for (let i = 0; i < bushes.length; i++) {
		bushes[i].draw();
	}
	for (let i = 0; i < bullets.length; i++) {
		bullets[i].draw();
	}
	for (let i = 0; i < treads.length; i++) {
		treads[i].draw();
	}
	for (let i = 0; i < trees.length; i++) {
		trees[i].draw();
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

	// Fade in the screen, or moreso fade out of the previous screen
	if (fade.intro > 0) {
		fill(0, 0, 0, fade.intro);
		rect(center.x, center.y, aWindowWidth, windowHeight);
		fade.intro -= 2.5;
	}
}

function treadDraw() {
	pulseMath();
	background(255);
	push();
	translate(viewport.x, viewport.y);
	fill(100);
	textSize(50);
	text("Press Escape to leave at any time",center.x, center.y);
	// Draw the tank and its treads
	for (let i = 0; i < bullets.length; i++) {
		bullets[i].draw();
	}
	for (let i = 0; i < treads.length; i++) {
		treads[i].draw();
	}
	pop();

	tankSpawn(aTank);


	if(keys["escape"]) {
		stage = 2;
		treads.length = 0;
		viewport.x = 0;
		viewport.y = -440;	
	}
	
	// Fade in the screen, or moreso fade out of the previous screen
	if (fade.intro > 0) {
		fill(0, 0, 0, fade.intro);
		rect(center.x, center.y, aWindowWidth, windowHeight);
		fade.intro -= 2.5;
	}
}

function tankJack() {	
	//Background pulse effect & island rendering
	pulseMath();
	background(-pulse.var, pulse.var - 25, pulse.var + 200);
	push();
	translate(viewport.x, viewport.y);
	fill(255, 245, 190);
	rect(center.x, center.y, 1000, 1000, 20);
	fill(52, 140, 49);
	rect(center.x, center.y, 900, 900, 20);
	fill(100, 100, 100);
	fill(150);
	translate(center.x, center.y - 250);
	push();
	scale(0.5);
	image(dealerImg, 0, 0);
	pop();
	translate(-center.x, -center.y + 250);

	fill(88, 57, 39);
	//The docks
	for (let i = 0; i < 10; i++) {
		rect(center.x, center.y + 375 + (i * 25), 150, 25, 20);
	}

	fill(255);
	textSize(50);
	text("Dealer: " + obfuscateHand(blackjack.dealer).join(", "), center.x, center.y);
	text("Tank: " + blackjack.hand.join(", ") + " Score: " + score(blackjack.hand), center.x, center.y + 50);

	fill(100);
	textSize(75);
	message(-250, 200, 250, 200, 20, aTank, "Stand", function() {
		if (gameStarted) {
			if (score(blackjack.dealer) > 16) {
				let playerScore = score(blackjack.hand);
				let dealerScore = score(blackjack.dealer);

				if (playerScore > 21 && dealerScore > 21) {
					currentPrompt = "";
					promptIndex = 0;
					prompts[1] = "Both busted! It's a tie! Dealer score: " + dealerScore + "\nReadjust your bet if needed\n and press Start in the betting menu to restart!";
					money = money + gameBet;
					gameStarted = false;
				} else if (playerScore === 21 && dealerScore !== 21) {
					currentPrompt = "";
					promptIndex = 0;
					prompts[1] = "Blackjack! You win! Dealer score: " + dealerScore + "\nReadjust your bet if needed\n and press Start in the betting menu to restart!";
					money = money + gameBet * 2;
					gameStarted = false;
				} else if (dealerScore === 21 && playerScore !== 21) {
					currentPrompt = "";
					promptIndex = 0;
					prompts[1] = "Dealer has blackjack! Dealer wins! Dealer score: " + dealerScore + "\nReadjust your bet if needed\n and press Start in the betting menu to restart!";
					gameStarted = false;
				} else if (playerScore === 21 && dealerScore === 21) {
					currentPrompt = "";
					promptIndex = 0;
					prompts[1] = "Both have blackjack! It's a tie! Dealer score: " + dealerScore + "\nReadjust your bet if needed\n and press Start in the betting menu to restart!";
					money = money + gameBet;
					gameStarted = false;
				} else if (playerScore > 21 && dealerScore <= 21) {
					currentPrompt = "";
					promptIndex = 0;
					prompts[1] = "You busted! Dealer wins! Dealer score: " + dealerScore + "\nReadjust your bet if needed\n and press Start in the betting menu to restart!";
					gameStarted = false;
				} else if (dealerScore > 21 && playerScore <= 21) {
					currentPrompt = "";
					promptIndex = 0;
					prompts[1] = "Dealer busted! You win! Dealer score: " + dealerScore + "\nReadjust your bet if needed\n and press Start in the betting menu to restart!";
					money = money + gameBet * 2;
					gameStarted = false;
				} else if (playerScore < dealerScore && dealerScore <= 21) {
					currentPrompt = "";
					promptIndex = 0;
					prompts[1] = "The dealer wins! Dealer score: " + dealerScore + "\nReadjust your bet if needed\n and press Start in the betting menu to restart!";
					gameStarted = false;
				} else if (playerScore > dealerScore && playerScore <= 21) {
					currentPrompt = "";
					promptIndex = 0;
					prompts[1] = "You win! Dealer score: " + dealerScore + "\nReadjust your bet if needed\n and press Start in the betting menu to restart!";
					money = money + gameBet * 2;
					gameStarted = false;
				} else if (playerScore === dealerScore) {
					currentPrompt = "";
					promptIndex = 0;
					prompts[1] = "It's a tie! Dealer score: " + dealerScore + "\nReadjust your bet if needed\n and press Start in the betting menu to restart!";
					money = money + gameBet;
					gameStarted = false;
				} else {
					currentPrompt = "";
					promptIndex = 0;
					prompts[1] = "Unexpected outcome! Dealer score: " + dealerScore + "\nReadjust your bet if needed\n and press Start in the betting menu to restart!";
					gameStarted = false;
				}
			} else {
				deal(blackjack.dealer);
			}
		}
	});

	fill(100);
	textSize(80);
	message(250, 200, 250, 200, 20, aTank, "Hit", function() {
		if (gameStarted) {
			deal(blackjack.hand);
			for(var i=0; i<blackjack.hand.length; i++) {
				if (((blackjack.hand[i] === "J") || (blackjack.hand[i] === "K") || (blackjack.hand[i] === "Q")) && (score(blackjack.hand) === 21) && (blackjack.hand.length === 2)) {
					currentPrompt = "";
					promptIndex = 0;
					prompts[1] = "Blackjack! Dealer score: " + score(blackjack.dealer) + "\nReadjust your bet if needed\n and press Start in the betting menu to restart!";
					money = money + gameBet * 2;
					gameStarted = false;
				}
			}
			if (score(blackjack.hand) > 21) {
					currentPrompt = "";
					promptIndex = 0;
				prompts[1] = "You busted! Dealer score: " + score(blackjack.dealer) + "\nReadjust your bet if needed\n and press Start in the betting menu to restart!";
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
	if (currentPrompt !== prompts[1]) {
		// Check if the prompt is fully displayed
		if (promptIndex < prompts[1].length) {
			// If not, continue adding characters to the currentPrompt
			currentPrompt += prompts[1].charAt(promptIndex);
			promptIndex++;
		} else {
			currentPrompt = prompts[1];
		}	
	}

	// Draw the current prompt text
	strokeWeight(4);
	stroke(0);
	fill(255);
	textSize(40);
	text(currentPrompt, commsWidth, commsHeight);
	strokeWeight(0);

	// Slow the tank if out of bounds
	if((viewport.x > 450) || (viewport.x < -450) || (viewport.y < -450) || (viewport.y > 450)) {
		aTank.speed = 0;
	}

	if(keys["escape"]) {
		currentPrompt = "";
		promptIndex = 0;
		stage = 2;
		treads.length = 0;
		viewport.x = 0;
		viewport.y = -440;	
	}

	// Fade in the screen, or moreso fade out of the previous screen
	if (fade.intro > 0) {
		fill(0, 0, 0, fade.intro);
		rect(center.x, center.y, aWindowWidth, windowHeight);
		fade.intro -= 2.5;
	}
}

//Outputs values to cursor position for debugging
function debug() {
	fill(255, 0, 0);
	textSize(25);
	//
	text(blackjack.playingDeck.length, mouseX + 40, mouseY - 30);
	text(blackjack.hand, mouseX + 40, mouseY + 5);
	text(blackjack.dealer, mouseX + 40, mouseY + 35);
	if (keyIsPressed) {
		if(keys["k"]) {	
			viewport.y -= 5;
		}
		if(keys["j"]) {
			viewport.x += 5;
		}
		if(keys["i"]) {
			viewport.y += 5;
		}
		if(keys["l"]) {
			viewport.x -= 5;
		}
	}
}

//Debug screen size: 1704, 959
//Called to set window parameters & whenever rescaled
function windowResized() {
	//Keep a consistent aspect ratio of 16:9, aWindowWidth is the actual width of the canvas
	aWindowWidth = Math.floor(windowHeight * (16/9));

	//Center constants
	center.x = aWindowWidth/2;
	center.y = windowHeight/2;

	//Coords to render the tank at the center of the screen
	aTank.x = Math.floor(center.x);
	aTank.y = Math.floor(center.y);
	aTank.bulletX = (center.x) - viewport.x;
	aTank.bulletY = (center.y) - viewport.y;
	//Half of the difference of the Chromebook res to native, in order to port over Chromebook-screen designed code
	translateCenter.x = Math.abs((aWindowWidth - 1366))/4;
	translateCenter.y = Math.abs((windowHeight - 768))/4;
	scaleResolution = windowHeight/853;

	//"Communications" text coords
	commsHeight = center.y + ((center.y)/2);
	commsWidth = center.x;

	resizeCanvas(aWindowWidth, windowHeight);
}

function draw() {
	switch(stage) {
		case 1:
			intro();
			break;
		case 2:
			menu();
			break;
		case 3:
			tankJack();
			break;
		case 4:
			treadDraw();
			break;
		default:
			tankJack();
			break;
	}
	debug();
}