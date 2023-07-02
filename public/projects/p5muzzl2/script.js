disableFriendlyErrors = true;

var aWindowWidth = 1366;

var preAWindowWidth;
var preWindowHeight;

var translateCenter = {
	x: 0,
	y: 0
}
var speedDecay = 0.05;

var stage = 2;

var paused = false;

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
	x:600,
	y:600,
	bulletX: 600,
	bulletY: 600,
	speed: 0,
	acceleration: 0.75,
	rotate: 90,
	turretRotateCopy: 0,
	turretRotate: 0,
	rightW: false,
	leftW: false,
	control: "wasd",
	aimControl: "mouse",
	firing: true,
	speedMultipler: 0.75,
	speedCost: 200,
	speedLevel: 1,
	reloadRate: 5,
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

var keyAim = {
	x: 0,
	y: 0
}

var viewport = {
	x: 0,
	y: -350
}

function bullet(x, y) {
	this.x = x;
	this.y = y;
	this.rotate = -aTank.turretRotate+90;
	this.a = true;
};

bullet.prototype.draw = function() {
	if(this.a){
		fill(255,0,0);
		push();
		translate(this.x,this.y);
		rotate(this.rotate);
		scale(2.5);
		fill(100, 100, 100, 50);
		triangle(-7.5, 9, 7.5, 0, -7.5, -9);
		fill(158, 60, 14);
		triangle(-4.5, 3, 10, 0, -4.5, -3);
		pop();
		this.x += cos(this.rotate) * 25;
		this.y += sin(this.rotate) * 25;
	}
};

function message(offsetX, offsetY, width, height, curve, tankVar) {
	rect(aWindowWidth/2 + offsetX, windowHeight/2 + offsetY, width, height, curve);
	if ((viewport.x < (offsetX + width/2)) && (viewport.x > (offsetX -width/2)) && (viewport.y > -offsetY + -(height/2)) && (viewport.y < -offsetY + (height/2))) {
		tankVar.armor = 50;
	} else {
		tankVar.armor = 100;
	}
}


function setup() {
	windowResized();
	//var canvas = createCanvas(1366, 768);
	var canvas = createCanvas(aWindowWidth, windowHeight);
	canvas.style('margin', 'auto');
	canvas.parent('script-holder');
	
	rectMode(CENTER);
	textAlign(CENTER, CENTER);
	angleMode(DEGREES);
	textStyle(BOLD);
	noStroke();
	
	var privacyBanner = document.querySelectorAll("[data-gg-privacy-banner-anchor]");
	for (var i = 0; i < privacyBanner.length; i++) {
		privacyBanner[i].parentNode.removeChild(privacyBanner[i]);
	}
}

function keyPressed() {
	keys[keyCode] = true;
}

function keyReleased() {
	keys[keyCode] = false;
}

function pulseMath() {
	pulse.var -= pulse.rate;
	if(pulse.var<125){pulse.rate = -1;}
	if(pulse.var>225){pulse.rate = 1;}
}

function tankSpawn(tankVar) {
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
	
	if(!paused){
		if (tankVar.control == "wasd") {
			if (keyIsPressed) {
				if(keys[65]) {
					if(tankVar.speed > (-2 * tankVar.speedMultipler)) {
						tankVar.rotate -= 3;
						tankVar.rightW = false;
						tankVar.leftW = true;
					}
				}
				if(keys[68]) {
					if(tankVar.speed > (-2 * tankVar.speedMultipler)) {
						tankVar.rotate +=3;
						tankVar.rightW = true;
						tankVar.leftW = false;
					}
				}
				if(keys[87]) {
					if(tankVar.speed <= (3 * tankVar.speedMultipler)) {
						tankVar.speed += tankVar.acceleration * tankVar.speedMultipler;
					}
				}
				if(keys[83]) {
					if(tankVar.speed > (-3 * tankVar.speedMultipler)) {
						tankVar.speed -= tankVar.acceleration * tankVar.speedMultipler;
					}
				}
				if(tankVar.speed === (3 * tankVar.speedMultipler)) {
					tankVar.speed = 3 * tankVar.speedMultipler;
				} else if (tankVar.speed === (-3 * tankVar.speedMultipler)) {
					tankVar.speed = 3 * tankVar.speedMultipler;
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
						tankVar.rightW = false;
						tankVar.leftW = true;
					}
				}
				if(keys[39]) {
					if(tankVar.speed > (-2 * tankVar.speedMultipler)) {
						tankVar.rotate +=3;
						tankVar.rightW = true;
						tankVar.leftW = false;
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
	}

	viewport.x += (cos(tankVar.rotate) * tankVar.speed);
	viewport.y += (sin(tankVar.rotate) * tankVar.speed);

aTank.bulletX = (aWindowWidth/2) - viewport.x;
aTank.bulletY = (windowHeight/2) - viewport.y;
		
	if (tankVar.firing) {
	if ((!tankHover)) {
			if(mouseIsPressed){
				if(tankVar.reloadVar == 0){
						bullets.push(new bullet(tankVar.bulletX,tankVar.bulletY));
						tankVar.reloadVar = tankVar.reloadMax;
				}
			}
			if(keys[32]){
				if(tankVar.reloadVar == 0){
						bullets.push(new bullet(tankVar.bulletX,tankVar.bulletY));
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
		text("Level", aWindowWidth/2, windowHeight/2 - 100);
		textSize(30);
		text("Tutorial", aWindowWidth/2, windowHeight/2 - 70);
		pop();
		
		if (tankVar.hotCircleSize < 250) {
			tankVar.hotCircleSize += 125;
		}
		} else {
		tankVar.hotCircleSize = 0;
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

function intro() {
	introVar.cubeRotate += 5;
	
	if (introVar.tankY > 195) {
		introVar.tankY -= 1;
	}
	if ((introVar.tankY == 195) && (introVar.tankRotate < 25)) {
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
	fill(255, 255, 255);
	textSize(800); //I'm just using this as a general scale/ratio factor, although it only works with appropriate ratios
	text("DP", 675, 350.5);
	textSize(75);
	text("roductions", 1070, 550.5);
	push();
	translate(150, 675);
	rotate(introVar.cubeRotate);
	fill(-pulse.var, pulse.var, pulse.var + 100);
	rect(0, 0, 125, 125, 15);
	pop();
	textSize(75);
	text("X", 150, 680);
	push();
	scale(3.5);
	translate(110, introVar.tankY);
	fill(50, 0, 0);
	rect(-12,0,5,35,5);
	rect(12,0,5,35,5);
	fill(0, 120, 0);
	rect(0,0,20,40,5);
	pop();
	textSize(125);
	text("...and more", 900, 700);
	rectMode(CORNER);
	fill(0);
	//rect(1445, 670, bullet.textCover, 122);
	rect(575, 625, introVar.textCover, 122);
	push();
	translate(introVar.bulletX, 663.5);
	fill(100, 100, 100, introVar.soundTransparency);
	triangle(-7.5, 45, 40, 17.5, -7.5, -9);
	fill(158, 60, 14, introVar.bulletTransparency);
	triangle(2, 27.5, 45, 17.5, 2, 10);
	pop();
	rectMode(CENTER);
	push();
	scale(3.5);
	translate(110, introVar.tankY);
	rotate(introVar.turretRotate);
	fill(0, 100, 0);
	rect(0,0,15,15,5);
	rect(0,-20,5,25,0);
	pop();
	pop();
	
	if (fade.intro > 0) {
		fill(0, 0, 0, fade.intro);
		rect(aWindowWidth/2, windowHeight/2, aWindowWidth, windowHeight);
		fade.intro -= 2.5;
	}

	fill(0, 0, 0, fade.out);
	rect(aWindowWidth/2, windowHeight/2, aWindowWidth, windowHeight);
	
	if (fade.out >= 255) {
		fade.intro = 255;
		stage = 2;
	}
}

function level1() {
	background(-pulse.var, pulse.var - 25, pulse.var + 200);
	push();
	translate(viewport.x, viewport.y);
	fill(255, 245, 190);
	rect(aWindowWidth/2, windowHeight/2, 1000, 1000, 20);
	fill(52, 140, 49);
	rect(aWindowWidth/2, windowHeight/2, 900, 900, 20);
	fill(100, 100, 100);
	message(0, 250, 850, 350, 20, aTank);
	fill(255);
	textSize(30);
	text("Welcome to Muzzl!\nThis game is a top down 'shooter' where you liberate\nislands as apart of your military campaign.\nTo start, use WASD to move around.\nTransparency on your tank usually represents your\ndamage, but it also happens when above a message.\nMove up the island to the next area.", aWindowWidth/2, windowHeight/2 + 250);
	if (aTank.firing) {
		for (let i = 0; i < bullets.length; i++) {
				bullets[i].draw();
		} 
	}
	pop();
	tankSpawn(aTank);

		
	if (fade.intro > 0) {
		fill(0, 0, 0, fade.intro);
		rect(aWindowWidth/2, windowHeight/2, aWindowWidth, windowHeight);
		fade.intro -= 2.5;
	}
}

function debug() {
	fill(255, 0, 0);
	textSize(25);
	text(viewport.x, mouseX + 125, mouseY);
	text(viewport.y, mouseX + 125, mouseY + 20);
	text(aTank.speed, mouseX + 125, mouseY + 45);
	text(aTank.turretRotateCopy, mouseX + 125, mouseY + 60);

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
}

function windowResized() {
	aWindowWidth = Math.floor(windowHeight * (16/9));
	preAWindowWidth = aWindowWidth;
	preWindowHeight = windowHeight;
	aTank.x = Math.floor(aWindowWidth/2);
	aTank.y = Math.floor(windowHeight/2);
	aTank.bulletX = (aWindowWidth/2) - viewport.x;
	aTank.bulletY = (windowHeight/2) - viewport.y;
	viewport.x *= (preAWindowWidth/aWindowWidth);
	viewport.y *= (preWindowHeight/windowHeight);
	translateCenter.x = (aWindowWidth - 1366)/2;
	translateCenter.y = (windowHeight - 768)/2;
	resizeCanvas(aWindowWidth, windowHeight);
}

function draw() {
	if (stage == 1) {
		intro();
	} else if (stage == 2) {
		level1();
	}
	pulseMath();
	debug();
}  