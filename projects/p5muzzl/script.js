function setup() {
	var canvas = createCanvas(1366, 768);
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

var stage = 1;

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

function tankSpawn(tankVar) {
	if (tankVar.aimControl === "mouse") {
		tankVar.turretRotateCopy = atan2(mouseX-tankVar.x,mouseY-tankVar.y);
		Math.round(tankVar.turretRotateCopy);
		if (tankVar.turretRotate != tankVar.turretRotateCopy) {
			if (tankVar.turretRotate < tankVar.turretRotateCopy) {
				tankVar.turretRotate += 1;
			}
			if (tankVar.turretRotate > tankVar.turretRotateCopy) {
				tankVar.turretRotate -= 1;
			}
		}
	} else {
		tankVar.turretRotateCopy = atan2(keyX-tankVar.x,keyY-tankVar.y);
		Math.round(tankVar.turretRotateCopy);
		if (tankVar.turretRotate != tankVar.turretRotateCopy) {
			if (tankVar.turretRotate < tankVar.turretRotateCopy) {
				tankVar.turretRotate += 1;
			}
			if (tankVar.turretRotate > tankVar.turretRotateCopy) {
				tankVar.turretRotate -= 1;
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
			if(keyAim.x < p5WindowWidth) {
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
					if(tankVar.speed > (-1.5 * tankVar.speedMultipler)) {
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
				if(tankVar.speed >= (0 * tankVar.speedMultipler)) {
					tankVar.speed -= 0.05 * tankVar.speedMultipler;
				} else {
					tankVar.speed += 0.05 * tankVar.speedMultipler;
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
					if(tankVar.speed >= (-1.5 * tankVar.speedMultipler)) {
						tankVar.speed -= tankVar.acceleration * tankVar.speedMultipler;
					}
				}
				if(!keys[38] && !keys[40]) {
					if(tankVar.speed >= 0) {
						tankVar.speed -= 0.05 * tankVar.speedMultipler;
					} else if (tankVar.speed <= 0) {
						tankVar.speed += 0.05 * tankVar.speedMultipler;
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
 
	viewport.x += (cos(tankMenu.rotate) * tankMenu.speed);
	viewport.y += (sin(tankMenu.rotate) * tankMenu.speed);

	tankVar.bulletX -= cos(tankVar.rotate)*tankVar.speed;
	tankVar.bulletY -= sin(tankVar.rotate)*tankVar.speed;
		
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

	//Tank skins
   if (tankVar.type == 1) {
		noStroke();
		push();
		translate(tankVar.x, tankVar.y);
		rotate(tankVar.rotate+90);
		fill(0, 120, 0);
		rect(0,0,50,100,12.5);
		fill(50);
		rect(-30,0,12.5,87.5,12.5);
		rect(30,0,12.5,87.5,12.5);
		pop();

		push();
		translate(tankVar.x, tankVar.y);
		rotate(-tankVar.turretRotate-180);
		fill(0, 100, 0);
		rect(0,0,37.5,37.5,12.5);
		rect(0,-40,12.5,50,0);
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
	fill(255, 255, 255);
	textSize(800); //I'm just using this as a general scale/ratio factor, although it only works with appropriate ratios
	text("DP", 675, 350.5);
	textSize(75);
	text("roductions", 1075, 550.5);
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
	
	if (fade.intro > 0) {
		fill(0, 0, 0, fade.intro);
		rect(windowWidth/2, windowHeight/2, windowWidth, windowHeight);
		fade.intro -= 2.5;
	}

	fill(0, 0, 0, fade.out);
	rect(windowWidth/2, windowHeight/2, windowWidth, windowHeight);
	
	if (fade.out >= 255) {
		scene = 2;
		fade.intro = 255;
	}
}

function level1() {
  
}

function draw() {
  if (stage = 1) {
    intro();
  } else if (stage = 2) {
    level1();
  }
}