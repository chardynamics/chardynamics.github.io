new Q5("global");

var arialBold;

function preload() {
	arialBold = loadFont("/assets/fonts/arialbd.ttf");
}

//probably should find a better solution
var p5WindowWidth;
var scaleResolution;

function setup() {
	//probably should find a better solution
	p5WindowWidth = windowHeight * (16/9);
	Math.floor(p5WindowWidth);	
	scaleResolution = windowHeight/853;
    
    createCanvas(p5WindowWidth, windowHeight);
	
	rectMode(CENTER);
	textAlign(CENTER, CENTER);
	textFont(arialBold);
	noStroke();
  ellipseMode(CENTER);
	
	var privacyBanner = document.querySelectorAll("[data-gg-privacy-banner-anchor]");
	for (var i = 0; i < privacyBanner.length; i++) {
		privacyBanner[i].parentNode.removeChild(privacyBanner[i]);
	}
  
  carMenu.x = p5WindowWidth/2;
  carMenu.y = windowHeight/2;
  carMenu.gx = p5WindowWidth/2;
  carMenu.gy = windowHeight/2;
  
  car.x = p5WindowWidth/2;
  car.y = windowHeight/2;
  car.gx = p5WindowWidth/2;
  car.gy = windowHeight/2;
}

var keys = [];
var bSpeed = 10;
var zspeed = 0.2;
var bullets = [];
var bx = [];
var by = [];
var ba = [];
var zx = [];
var zy = [];
var za = [];
var zc = 100;
var bushes = [];
var zombies = [];
var brot = [];
var scene = 0;
var fade = 0;
var s = 0;
var td = 0;
var play = false;
var level = 1;
var d = 1;
var money = 0;

var fade = 0;
var oppFade = 255;
var time = 1;
var angle = 0;
var pulse = 130;
var pulseS = 1;
var paused = false;
var armorDebug = false;
var metalMode = false;
var reloadTime = 60;
var reloadTime2 = 60;
var timeAlpha = 0;
var timeIsDark = false;
var buttonIsPressed = false;
var buttonHover = false;
var initiatebulletUpgradeLogic = false;
var waitTilReloadResets = false;
var fadeIsDone = false;
var optionsHover = false;
var bushTrigger = true;

var options = {
    tree: false,
    treeOn: 3,
    respawn: true,
    respawnOn: false,
};

var health = {
    h: 490,
    max: 490,
    upgradeCost: 200
};

var speed = {
    speed: 0.75,
    cost: 200,
    level: 1
};

var bulletReload = {
    upgradeCost: 400,
    level: 1,  reloadRate: 5,
    max: false,
    asyncwait: false
};

var c = {
     x:0,
     y:0,
};

var car = {
    x:300,
    y:300,
    s:0,
    rot:-90,
    acc:0.1,
    gx:300,
    gy:300,
    grot:0,
    rightW:false,
    leftW:false,
    type:1,
    deaths:0
};

var carMenu = {
    x:300,
    y:350,
    s:0,
    rot:-90,
    acc:0.1,
    gx:300,
    gy:350,
    grot:0
};

function zombie(x,y) {
     this.x = x;
     this.y = y;
     this.a = true;
     this.d = true;
     this.xv = 0;
     this.yv = 0;
     this.mx = random(1,3);
     this.r = 0;
};

function bush(x,y) {
     this.x = x;
     this.y = y;
};

function bullet(x, y) {
     this.x = x;
     this.y = y;
     this.rot = 0;
     this.rot = -car.grot+90;
     this.a = true;
};

//}

//Functions
//{
function keyPressed() {
     keys[keyCode] = true;
}

function keyReleased() {
     keys[keyCode] = false;
}

zombie.prototype.draw = function() {
     if(play){     
     if(this.a){
     push();
     translate(this.x+c.x,this.y+c.y);
     stroke(0, 0, 0, 100);
    strokeWeight(3);
    line(0, 0, -15, 15);
    line(0, 0, 15, 15);
    line(0, 0, 15, -15);
    line(0, 0, -15, -15);
    noStroke();
    fill(30, 130, 123);
    rect(0,0,10,30,3);
    fill(0, 0, 0);
    stroke(0, 0, 0);
    strokeWeight(1);
    ellipse(-15, 15, 7.5, 7.5);
    ellipse(15, 15, 7.5, 7.5);
    ellipse(15, -15, 7.5, 7.5);
    ellipse(-15, -15, 7.5, 7.5);
    fill(100, 100, 100, 100);
    ellipse(-15, 15, 25, 25);
    ellipse(15, 15, 25, 25);
    ellipse(15, -15, 25, 25);
    ellipse(-15, -15, 25, 25);
    noStroke();
     pop();
     if (level === 1) {
        this.x+=this.xv;
        this.y+=this.yv;
     } else {
        this.x+= (this.xv * level/4);
        this.y+= (this.yv * level/4);
     }
     if(this.x+c.x<car.x&&this.xv>-1){this.xv+=zspeed;}
     if(this.x+c.x>car.x&&this.xv<1){this.xv-=zspeed;}
     if(this.y+c.y<car.y&&this.yv>-1){this.yv+=zspeed;}
     if(this.y+c.y>car.y&&this.yv<1){this.yv-=zspeed;}
     if(this.xv>0){this.xv-=0.05;}
     if(this.xv<0){this.xv+=0.05;}
     if(this.yv>0){this.yv-=0.05;}
     if(this.yv<0){this.yv+=0.05;}
     if(this.xv>this.mx){this.xv=this.mx;}
     if(this.xv<-this.mx){this.xv=-this.mx;}
     if(this.yv>this.mx){this.yv=this.mx;}
     if(this.yv<-this.mx){this.yv=-this.mx;}
     } else { if (this.d){
                fill(255, 0, 0,100);
                ellipse(this.x+c.x,this.y+c.y,this.r,this.r);
                this.r+=10;
                if(this.r>80){this.d = false;}
          }
     }
     }
     
};

bush.prototype.draw = function() {
     push();
     translate(this.x+c.x,this.y+c.y);
     scale(0.44);
     fill(0, 255, 0);
     ellipse(0, 0, 10, 10);
     pop();
};

bullet.prototype.draw = function() {
     if(this.a){
     fill(255,0,0);
     push();
     translate(this.x,this.y);
     rotate(this.rot);
     fill(100, 100, 100, 50);
     triangle(-7.5, 9, 7.5, 0, -7.5, -9);
     fill(158, 60, 14);
     triangle(-4.5, 3, 10, 0, -4.5, -3);
     pop();
     this.x += cos(this.rot)*bSpeed;
     this.y += sin(this.rot)*bSpeed;
     }
};

function bulletDraw(translateX, translateY, scaleFactor) {
    push();
    scale(scaleFactor);
    translate(translateX, translateY);
    fill(100, 100, 100, 50);
    triangle(-7.5, 9, 7.5, 0, -7.5, -9);
    fill(158, 60, 14);
    triangle(-4.5, 3, 10, 0, -4.5, -3);
    pop();
};

function tankSpawn(tankVar, firing) {
     tankVar.grot = atan2(mouseX-tankVar.x,mouseY-tankVar.y);
     
     if(!paused){
         if (keyIsPressed) {
              if(keys[65]) {
                    if(tankVar.s >  (-2 * speed.speed)) {
                         tankVar.rot -= 3;
                         tankVar.rightW = false;
                         tankVar.leftW = true;
                    }
              }
              if(keys[68]) {
                    if(tankVar.s > (-2 * speed.speed)) {
                         tankVar.rot +=3;
                         tankVar.rightW = true;
                         tankVar.leftW = false;
                    }
              }
              if(keys[87]) {
                    if(tankVar.s <= (3 * speed.speed)) {
                         tankVar.s += tankVar.acc * speed.speed;
                    }
              }
              if(keys[83]) {
                    if(tankVar.s > (-1.5 * speed.speed)) {
                         tankVar.s -= tankVar.acc * speed.speed;
                    }
              }
              if(!keys[87] && !keys[83]) {
                    if(tankVar.s >= (0 * speed.speed)) {
                         tankVar.s -= 0.02 * speed.speed;
                    }
              }
              if(keys[37]) {
                    if(tankVar.s > (-2 * speed.speed)) {
                         tankVar.rot -=3;
                         tankVar.rightW = false;
                         tankVar.leftW = true;
                    }
              }
              if(keys[39]) {
                    if(tankVar.s > (-2 * speed.speed)) {
                         tankVar.rot +=3;
                         tankVar.rightW = true;
                         tankVar.leftW = false;
                    }
              }
              if(keys[38]) {
                    if(tankVar.s <= (3 * speed.speed)) {
                         tankVar.s += tankVar.acc * speed.speed;
                    }
              }
              if(keys[40]) {
                    if(tankVar.s >= (-1.5 * speed.speed)) {
                         tankVar.s -= tankVar.acc * speed.speed;
                    }
              }
              if(!keys[38] && !keys[40]) {
                    if(tankVar.s >= 0) {
                         tankVar.s -= 0.05 * speed.speed;
                    } else if (tankVar.s <= 0) {
                         tankVar.s += 0.05 * speed.speed;
                    }
              }
              //if(tankVar.s < 0) {
              //     tankVar.s = 0;
              //}
              if(tankVar.s === (3 * speed.speed)) {
                    tankVar.s = 3 * speed.speed;
              } else if (tankVar.s === (-3 * speed.speed)) {
                    tankVar.s = 3 * speed.speed;
              }
         }
     } else {
        tankVar.rightW = false;
        tankVar.leftW = false;
     }

     tankVar.x += cos(tankVar.rot)*tankVar.s;
     tankVar.y += sin(tankVar.rot)*tankVar.s;
    
     tankVar.gx += cos(tankVar.rot)*tankVar.s;
     tankVar.gy += sin(tankVar.rot)*tankVar.s;
    
     push();
     
     if (firing) {
        if ((!buttonHover)) {
              if(mouseIsPressed){
                    if(reloadTime == 0){
                         bullets.push(new bullet(car.x,car.y));
                         reloadTime = reloadTime2;
                    }
              }
              if(keys[32]){
                    if(reloadTime == 0){
                         bullets.push(new bullet(car.x,car.y));
                         reloadTime = reloadTime2;
                    }
              }
        }
     }
    if (car.type === 1) {
        noStroke();
        translate(tankVar.x,tankVar.y);
        rotate(tankVar.rot+90);
        fill(0, 120, 0);
        rect(0,0,20,40,5);
        fill(50);
        rect(-12,0,5,35,5);
        rect(12,0,5,35,5);
        pop();
      
        push();
        noStroke();
        translate(tankVar.gx,tankVar.gy);
        rotate(-tankVar.grot-180);
        fill(0, 100, 0);
        rect(0,0,15,15,5);
        rect(0,-10,5,20,0);
        pop();
    } else {
        push();
        translate(tankVar.x,tankVar.y);
        
        if ((tankVar.rightW === false) && (tankVar.leftW === true)) {
            rotate(tankVar.rot+86);
        } 
        if ((tankVar.rightW === true) && (tankVar.leftW === false)) {
            rotate(tankVar.rot+94);
        }
    
        fill(50);
        rect(-12.0,-9,5,13,5);
        rect(12.0,-9,5,13,5);
        pop();
        push();
        translate(tankVar.x,tankVar.y);
        rotate(tankVar.rot+90);
        fill(50);
        rect(-12,10,5,13,5);
        rect(12,10,5,13,5);
        fill(0, 120, 0);
        rect(0,0,20,40,5);
        pop();
        push();
        translate(tankVar.x,tankVar.y);
        rotate(-tankVar.grot-180);
        fill(0, 100, 0);
        rect(0,0,15,15,5);
        rect(0,-10,5,20,0);
        pop();
    }
};

function incapacitatedTank(tankVar) {
     paused = true;
     tankVar.s -= 0.1;
     if(tankVar.s < 0){
         tankVar.s = 0;
     } else {
        tankVar.s -= 0.1;
     }
};

function preGame() {
     noStroke();
     if (s === 0) { //Credits
          var blackScreen = false;
          if(fade<255){
                angle+=3;
                fade += 2.5;
          } else {
                blackScreen = true;
                s = 1;
                fade = 0;
          }
          background(0, 0, 0);
          fill(255, 255, 255);
          textSize(800 * scaleResolution); //I'm just using this as a general scale/ratio factor, although it only works with appropriate ratios
          text("DP", 25 * scaleResolution, 600 * scaleResolution);
          textSize(125 * scaleResolution);
          text("roductions", 790 * scaleResolution, 600 * scaleResolution);
          push();
          translate(375 * scaleResolution, 715 * scaleResolution);
          rotate(angle);
          fill(-pulse, pulse, pulse + 100);
          rect(0, 0, 125 * scaleResolution, 125 * scaleResolution, 15*scaleResolution);
          pop();
          textAlign(LEFT,LEFT);
          textSize(125 * scaleResolution);
          text("cubeRedux();", 475 * scaleResolution, 752.5 * scaleResolution);
          
          fill(0, 0, 0, fade);
          rect(p5WindowWidth/2, windowHeight/2, p5WindowWidth, windowHeight);
          
          if (blackScreen === true) {
                fill(0, 0, 0);
                rect(p5WindowWidth/2, windowHeight/2, p5WindowWidth, windowHeight);
          }
     } else if (s === 1) { //Menu
        textAlign(LEFT,LEFT);
        background(0, pulse, 208);
          
        fill(225, 242, 114);
          rect(p5WindowWidth/2, windowHeight/2, 500, 500, 10);
          fill(43, 255, 0);
          rect(p5WindowWidth/2, windowHeight/2, 450, 450, 10);
          //textFont(createFont("cursive"));
          fill(255, 255, 255);
          textSize(100);
          text("Armor", p5WindowWidth/2 - 200, windowHeight/2 - 125);
          fill(100, 100, 100, 50);
          push();
          translate(p5WindowWidth/2 + 155, windowHeight/2 - 165);
          scale(5);
          triangle(-7.5, 9, 10, 0, -7.5, -9);
          fill(158, 60, 14);
          triangle(-4.5, 3, 10, 0, -4.5, -3);
          pop();
          
          fill(221, 255, 0);
          rect(p5WindowWidth/2, windowHeight/2 + 160, 250, 100, 10);
          fill(255, 255, 255);
        fill(225, 242, 114);
        rect(p5WindowWidth/2, windowHeight/2, 410, 190, 10);
        fill(255, 255, 255);
        textAlign(CENTER, CENTER);
        textSize(20);
        text("Armor Standalone Edition (90% Done)\n- Spacebar scroling is disabled for\nspacebar shooting.\n\n- This is based off of Tonk\nby Eclipse5214, and is licensed under the\nMIT License.", p5WindowWidth/2, windowHeight/2);
          textSize(80);
          text("Play", p5WindowWidth/2, windowHeight/2 + 150);
          tankSpawn(carMenu, false);
          
        if ((carMenu.x>(p5WindowWidth/2-125)) && (carMenu.x<(p5WindowWidth/2+125)) && (carMenu.y>(windowHeight/2+110)) && (carMenu.y<(windowHeight/2+210)) && (!buttonHover)) {
            if (fade < 255) {
                incapacitatedTank(carMenu);
                fill(0, 0, 0, fade);
                rect(p5WindowWidth/2, windowHeight/2,p5WindowWidth,windowHeight);
                fade += 2.5;
            } else {
                paused = false;
                fill(0, 0, 0);
                rect(p5WindowWidth/2, windowHeight/2,p5WindowWidth,windowHeight);
                fade = 0;
                fadeIsDone = false;
                buttonHover = true;
                s = 2;
            }
        } else {
            buttonHover = false;
        }
          
        if ((oppFade>0) && (!fadeIsDone)) {
            fill(0, 0, 0, oppFade);
            rect(p5WindowWidth/2, windowHeight/2, p5WindowWidth, windowHeight);
            oppFade -= 2.5;
        }
          
        if (oppFade === 0) {
            fadeIsDone = true;
            oppFade = 255;
        }
          
        if(carMenu.x<(p5WindowWidth/2-230)){carMenu.x=(p5WindowWidth/2-230);carMenu.gx=(p5WindowWidth/2-230);}
        if(carMenu.x>(p5WindowWidth/2+230)){carMenu.x=(p5WindowWidth/2+230);carMenu.gx=(p5WindowWidth/2+230);}
        if(carMenu.y<(windowHeight/2-230)){carMenu.y=(windowHeight/2-230);carMenu.gy=(windowHeight/2-230);}
        if(carMenu.y>(windowHeight/2+230)){carMenu.y=(windowHeight/2+230);carMenu.gy=(windowHeight/2+230);}
    } else if (s === 2) {
        background(0, pulse, 208);
        fill(225, 242, 114);
        fill(225, 242, 114);
        rect(p5WindowWidth/2, windowHeight/2, 500, 500, 10);
        fill(43, 255, 0);
        rect(p5WindowWidth/2, windowHeight/2, 450, 450, 10);
        fill(100, 100, 100, 50);
          
        fill(221, 255, 0);
        rect(p5WindowWidth/2, windowHeight/2 - 160, 250, 100, 10);
        rect(p5WindowWidth/2, windowHeight/2 + 160, 250, 100, 10);
        rect(p5WindowWidth/2 - 170, windowHeight/2, 90, 200, 10);
        rect(p5WindowWidth/2 + 170, windowHeight/2, 90, 200, 10);
        fill(225, 242, 114);
        rect(p5WindowWidth/2, windowHeight/2, 200, 175, 10);
        textAlign(CENTER, CENTER);
        textFont(arialBold);
        if (options.tree && options.respawn && optionsHover) {
            textSize(17.5);
            fill(255, 255, 255);
            text("Go over the buttons to\nsee all options and\nthe currently selected\noptions.", p5WindowWidth/2, windowHeight/2);
        }
        fill(255, 255, 255);
        textFont('Arial');
        textSize(70);
        if (options.treeOn === 3) {
            text("🌳\n❌", p5WindowWidth/2 - 170, windowHeight/2);
        } else if (options.treeOn === 1) {
            text("🌳\n✔️", p5WindowWidth/2 - 170, windowHeight/2);
        } else if (options.treeOn === 2) {
            text("🌲", p5WindowWidth/2 - 170, windowHeight/2);
        }
        if (time === 1) {
            textSize(80);
            text("☀️/🌕", p5WindowWidth/2, windowHeight/2 - 155);
        } else if (time === 2) {
            textSize(80);
            text("🌕", p5WindowWidth/2, windowHeight/2 - 155);
        } else if (time === 3) {
            textSize(80);
            text("☀️", p5WindowWidth/2, windowHeight/2 - 155);
        }
        
        textSize(70);
        if (options.respawnOn) {
            text("🔁\n✔️", p5WindowWidth/2 + 170, windowHeight/2);
        } else if ((!options.respawnOn) && (car.deaths === 0)){
            text("🔁\n❌", p5WindowWidth/2 + 170, windowHeight/2);
        } else {
            text("🔁\n🔒", p5WindowWidth/2 + 170, windowHeight/2);
        }
        
        textSize(80);
        textFont(arialBold);
        if (car.deaths === 0) {
            text("Play", p5WindowWidth/2, windowHeight/2 + 150);
        } else {
            textSize(60);
            text("Resume", p5WindowWidth/2, windowHeight/2 + 130);
            textSize(12.5);
            text("(if you'd like to restart, refresh \nRespawns: " + car.deaths, p5WindowWidth/2, windowHeight/2 + 184);
        }
        tankSpawn(carMenu, false);
          
        textFont('Arial');
        if ((carMenu.x> (p5WindowWidth/2 - 125)) && (carMenu.x<(p5WindowWidth/2 + 125))&&(carMenu.y>(windowHeight/2 - 210))&&(carMenu.y<(windowHeight/2 - 110))){
            if ((time === 1) && (optionsHover)) {
               time = 2; 
               optionsHover = false;
            }
            if ((time === 2) && (optionsHover)) {
                time = 3;
                optionsHover = false;
            }
            if ((time === 3) && (optionsHover)) {
               time = 1; 
               optionsHover = false;
            }
            if (time === 1) {
                fill(255, 255, 255);
                rect(p5WindowWidth/2, windowHeight/2 + 1, 105, 2.5);
            } else if (time === 2) {
                fill(255, 255, 255);
                rect(p5WindowWidth/2, windowHeight/2 + 24, 185, 2.5);
            } else if (time === 3) {
                fill(255, 255, 255);
                rect(p5WindowWidth/2, windowHeight/2 + 48, 175, 2.5);
            }
            textSize(20);
            fill(255, 255, 255);
            text("Day / Night Cycle:\n☀️/🌕 - On\n🌕 - Moonlight Only\n☀️ - Sunlight Only", p5WindowWidth/2, windowHeight/2);
        } else {
            optionsHover = true;
        }
          
        if ((carMenu.x>(p5WindowWidth/2 - 125)) && (carMenu.x<(p5WindowWidth/2 + 125)) && (carMenu.y>(windowHeight/2 + 110)) && (carMenu.y<(windowHeight/2 + 210)) && (!buttonHover)) {
            if (fade < 255) {
                incapacitatedTank(carMenu);
                fade += 2.5;
                fill(0, 0, 0, fade);
                rect(p5WindowWidth/2, windowHeight/2,p5WindowWidth, windowHeight);
            } else {
                paused = false;
                fill(0, 0, 0);
                rect(p5WindowWidth/2, windowHeight/2,p5WindowWidth, windowHeight);
                fadeIsDone = false;
                fade = 0;
                buttonHover = true;
                scene = 1;
            }
        } else {
            if ((carMenu.x<(p5WindowWidth/2 - 125)) || (carMenu.x>(p5WindowWidth/2 + 125)) || (carMenu.y<(windowHeight/2 + 110)) || (carMenu.y>(windowHeight/2 + 210))) {
                buttonHover = false;
            }
        }

        if ((carMenu.x>(p5WindowWidth/2 + 125)) && (carMenu.x<(p5WindowWidth/2 + 225)) && (carMenu.y>(windowHeight/2 - 100)) && (carMenu.y<(windowHeight/2 + 100))) {
            if (options.respawnOn && options.respawn) {
                options.respawnOn = false;
                options.respawn = false;
            } 
            if (!options.respawnOn && options.respawn) {
                options.respawnOn = true;
                options.respawn = false;
            }
            
        } else {
            options.respawn = true;
        }
          
        if ((carMenu.x>(p5WindowWidth/2 + 215)) && (carMenu.x<(p5WindowWidth/2 + 125)) && (carMenu.y>(windowHeight/2 - 100)) && (carMenu.y<(windowHeight/2 + 100))) {
            if ((options.treeOn === 1) && (options.tree)) {
                options.treeOn = 2;
                options.tree = false;
            } 
            if ((options.treeOn === 2) && (options.tree)) {
                options.treeOn = 3;
                options.tree = false;
            }
            if ((options.treeOn === 3) && (options.tree)) {
                options.treeOn = 1;
                options.tree = false;
            }
            if (options.treeOn === 1) {
                fill(255, 255, 255);
                rect(p5WindowWidth/2 + 5, windowHeight/2, 120, 2.5);
            } else if (options.treeOn === 2) {
                fill(255, 255, 255);
                rect(p5WindowWidth/2, windowHeight/2 + 2.25, 165, 2.5);
            } else if (options.treeOn === 3) {
                fill(255, 255, 255);
                rect(p5WindowWidth/2, windowHeight/2 + 48, 140, 2.5);
            }
            textSize(20);
            fill(255, 255, 255);
            text("Trees:\n🌳✔️ - Trees\n🌲 - Performance\n🌳❌ - Nothing",p5WindowWidth/2, windowHeight/2);
        } else {
            options.tree = true;
        }
          
        if ((oppFade>0) && (!fadeIsDone)) {
            fill(0, 0, 0, oppFade);
            rect(p5WindowWidth/2, windowHeight/2,p5WindowWidth, windowHeight);
            oppFade -= 2.5;
        }
          
        if ((oppFade === 0)) {
            fadeIsDone = true;
            oppFade = 255;
        }
          
        if(carMenu.x<(p5WindowWidth/2-230)){carMenu.x=(p5WindowWidth/2-230);carMenu.gx=(p5WindowWidth/2-230);}
        if(carMenu.x>(p5WindowWidth/2+230)){carMenu.x=(p5WindowWidth/2+230);carMenu.gx=(p5WindowWidth/2+230);}
        if(carMenu.y<(windowHeight/2-230)){carMenu.y=(windowHeight/2-230);carMenu.gy=(windowHeight/2-230);}
        if(carMenu.y>(windowHeight/2+230)){carMenu.y=(windowHeight/2+230);carMenu.gy=(windowHeight/2+230);}
     }
};

function zsp(x,y){
     zombies.push(new zombie(x,y));  
};

function rai(a,i) {
     a.splice(i,1);
};
function game() {
     
     angle+=3;
     pulse -= pulseS;
     if(pulse<0){pulseS = -1;}
     if(pulse>250){pulseS = 1;}
     background(0, 255, 208);
    push();
    translate(c.x,c.y);
    fill(225, 242, 114);
    rect(0,0,2150,2150,175);
    fill(43, 255, 0);
    rect(0,0,2000,2000,100);
    pop();
    if (options.treeOn) {
        if(bushes.length < 100){
              bushes.push(new bush(random(-1000,1000),random(-1000,1000)));
        }
        for (var i = 0; i < bushes.length; i ++) {
          bushes[i].draw();
        }
    }
    tankSpawn(car, true);
    if(zombies.length < zc - td){
         zsp(random(-1000,1000),random(-1000,1000));
    }
     for (var i = 0; i < zombies.length; i ++) {
          zombies[i].draw();
          zx[i] = zombies[i].x +c.x;
          zy[i] = zombies[i].y +c.y;
          za[i] = zombies[i].a;
          if(zombies[i].x+c.x-15<car.x &&zombies[i].x+c.x+15> car.x&&zombies[i].y-15+c.y< car.y&&zombies[i].y+c.y+15> car.y && zombies[i].a && (!metalMode)) {
                health.h-= level;
          }
          for (var j = 0; j < bullets.length; j++){
              if(zombies[i].x+c.x-15< bx[j]&&zombies[i].x+c.x+15> bx[j]&&zombies[i].y-15+c.y< by[j]&&zombies[i].y+c.y+15> by[j]&&ba[j]) {
                  zombies[i].a = false;
              }
          }
          if(health.h<0){
                car.deaths++;
                health.h=0;scene=0;
                carMenu.x = p5WindowWidth/2;
                carMenu.y = windowHeight/2;
                carMenu.gx = p5WindowWidth/2;
                carMenu.gy = windowHeight/2;
                carMenu.s = 0;
                carMenu.rot = -90;
                carMenu.acc = 0.1;
                carMenu.grot = 0;
          }
          if(zombies[i].r>79){
                td++;
                money++;
                rai(zombies,i);
          }
          
     }
     if(zombies.length === 0){
        level++;
        health.h = health.max;
        zc += 10;
        td = 0;
     }

    for (var i = 0; i < bullets.length; i ++) {
     bullets[i].draw();
     bx[i] = bullets[i].x;
     by[i] = bullets[i].y;
     ba[i] = bullets[i].a;
     for (var j = 0; j < zombies.length; j++){
          if(bullets[i].x > zx[j] - 15&&bullets[i].x < zx[j] + 15 && bullets[i].y > zy[j] - 15 && bullets[i].y < zy[j] + 15 && za[j]){bullets[i].a = false;}
     }
      if(bullets[i].x>width||bullets[i].x<0||bullets[i].y>height||bullets[i].y<0){rai(bullets,i);}
}
     push();
    noStroke();
    translate(car.gx,car.gy);
    rotate(-car.grot-180);
    fill(0, 100, 0);
    rect(0,0,15,15,5);
    rect(0,-10,5,20,0);
    pop();
    
    if(car.x<150){
         car.x = 150;
         car.gx = 150;
         c.x+=car.s;
    }
    if(car.x>(p5WindowWidth-150)){
         car.x = (p5WindowWidth-150);
         car.gx = (p5WindowWidth-150);
         c.x-=car.s;
    }
    if(car.y<150){
         car.y = 150;
         car.gy = 150;
         c.y+=car.s;
    }
    if(car.y>(windowHeight-150)){
         car.y = windowHeight-150;
         car.gy = windowHeight-150;
         c.y-=car.s;
    }
    if(c.x>1200){c.x=1200;}
    if(c.x<465){c.x=465;}
    if(c.y>1205){c.y=1205;}
    if(c.y<-263){c.y=-263;}
    
    if (reloadTime > 0) {
        if ((reloadTime - bulletReload.reloadRate) >= 0) {
            reloadTime -= bulletReload.reloadRate;
        } else {
            reloadTime = 0;
        }
    }
    
    fill(0, 0, 0, timeAlpha);
    rect(p5WindowWidth/2, windowHeight/2, p5WindowWidth, windowHeight);
    
    if (time === 1) {
        if ((timeAlpha < 200) && (!timeIsDark)) {
            timeAlpha += 0.25;
            if (timeAlpha === 199) {
                timeIsDark = true;
            }
        }
        if (timeIsDark) {
            timeAlpha -= 0.25;
            if (timeAlpha === 0) {
                timeIsDark = false;
            }
        }
    } else if (time === 2) {
        fill(0, 0, 0, 200);
        rect(300, 300, 600, 600);
    }
    
    fill(0, 0, 0, 100);
    rect(p5WindowWidth/2,75,500,125);
    fill(255, 0, pulse);
    rect(p5WindowWidth/2,35,490 * (health.h/health.max),35);
    fill(100, pulse, 100);
    rect(p5WindowWidth/2,65,zombies.length/d,25);
    fill(pulse, 100, 200);
    rect(p5WindowWidth/2,85,490 * (reloadTime/reloadTime2),15);
    if(zc/d> 490){d++;}
    
    textAlign(CENTER,CENTER);
    
    if (waitTilReloadResets) {
        if (bulletReload.reloadRate < 60) {
            bulletReload.reloadRate += 5;
        } else {
            bulletReload.reloadRate = 60;
        }
        waitTilReloadResets = false;
    }
    
    if ((money > bulletReload.upgradeCost) && (!bulletReload.max) && waitTilReloadResets) {
        if (bulletReload.reloadRate === 60) {
            bulletReload.max = true;
            bulletReload.level = "MAX";
            bulletReload.upgradeCost = "MAX";
        } else {
            bulletReload.level++;
        }
        if (bulletReload.reloadRate < 60) {
            waitTilReloadResets = true;
        } else { 
            waitTilReloadResets = true;
        }
        waitTilReloadResets = false;
        money -= bulletReload.upgradeCost;
        bulletReload.upgradeCost += 200;
    }
    
    fill(0, 0, 0);
    textSize(20);
    text("Level "+ level,p5WindowWidth/2,27.5);
    textSize(15);
    //text("Zombies",300,65);
    text("Drones",p5WindowWidth/2,65);
    text("Health",p5WindowWidth/2,45);
    textSize(10);
    text("Reload Time",p5WindowWidth/2,85);
    
    noFill();
    push();
    translate(p5WindowWidth/2 - 150, 4);
    stroke(0, 0, 0);
    strokeWeight(3);
    arc(230, 115, 30, 30, 150, 325);
    stroke(255, 255, 255);
    ellipse(230, 115, 5, 5);
    line(230, 117.5, 235, 100.5);
    pop();
    noStroke();
    bulletDraw(p5WindowWidth/2 - 375, 77.5, 1.5);
    fill(0, 255, 0);
    textAlign(LEFT, LEFT);
    textSize(30);
    text("$" + money, p5WindowWidth/2 - 245,125.5);
    fill(255, 0, 0);
    text(bulletReload.level,p5WindowWidth/2 - 125,125.5);
    //fill(255, 255, 255);
    //text("🏃💨" + speed.level,280,125.5);
    fill(0, 0, 0);
    text(speed.level,p5WindowWidth/2 + 100, 125.5);
    textSize(12.5);
    fill(255, 255, 255);
    textFont('Arial');
    textSize(27.5);
    text("❤️", p5WindowWidth/2 - 53, 117.5);
    //text("Click on the symbols\nto upgrade!",415,115);
    noStroke();
    textFont(arialBold);
    textSize(30);
    text(health.h,820,125.5);
    textAlign(CENTER, CENTER);
    textSize(20);
    
    if((mouseX > 140) && (mouseX < 165) && (mouseY > 100) && (mouseY < 130)) {
        buttonHover = true;
        if (mouseIsPressed) {
            initiatebulletUpgradeLogic = true;
            if ((money < bulletReload.upgradeCost) && (!bulletReload.max)) {
                fill(255, 0, 0, 100);
                rect(p5WindowWidth/2,windowHeight/2,p5WindowWidth,windowHeight);
                fill(255, 0, 0);
                text("Not enough money!\nUpgrade cost to increase the reload rate by\n6 seconds is " + bulletReload.upgradeCost + " dollars for level " + bulletReload.level + ".", p5WindowWidth/2,windowHeight/2);
            }
        }
    } else {
        buttonHover = false;
    }
    
    if ((mouseX > 243) && (mouseX < 274) && (mouseY > 102) && (mouseY < 128)) {
        buttonHover = true;
        if (mouseIsPressed) {
            if ((money > speed.cost) && (speed.speed < 2)) {
                money -= speed.cost;
                speed.cost += 200;
                speed.level++;
                if (speed.speed < 2) {
                    speed.speed += 0.25;
                } else {
                    speed.speed = 2;
                    speed.cost = "MAX";
                    speed.level = "MAX";
                }
            }
            if ((money < speed.cost) && (speed.speed < 2)) {
                fill(255, 0, 0, 100);
              rect(p5WindowWidth/2,windowHeight/2,p5WindowWidth,windowHeight);
                fill(255, 0, 0);
                text("Not enough money!\nUpgrade cost to increase speed by 15% is\n" + speed.cost + " dollars for level " + speed.level + ".", p5WindowWidth/2,windowHeight/2);
            }
        } 
    } else {
        buttonHover = false;
    }
    
    if ((mouseX > 353) && (mouseX < 383) && (mouseY > 105) && (mouseY < 131)) {
        buttonHover = true;
        if (mouseIsPressed) {
            if ((money > health.upgradeCost) && (health.max < 999)) {
                money -= health.upgradeCost;
                health.upgradeCost += 300;
                if (health.h < 999) {
                    health.max += 100;
                } else {
                    health.max = 999;
                }
            }
            if ((money < health.upgradeCost) && (health.max < 999)) {
                fill(255, 0, 0, 100);
                rect(p5WindowWidth/2,windowHeight/2,p5WindowWidth,windowHeight);
                fill(255, 0, 0);
                text("Not enough money!\nUpgrade cost to increase the max health by\n100 points is " + health.upgradeCost + " dollars\nfor the current max health of " + health.max + ".", p5WindowWidth/2,windowHeight/2);
            }
        }
    } else {
        buttonHover = false;
    }
    
    if ((oppFade>0) && (!fadeIsDone)) {
        fill(0, 0, 0, oppFade);
      rect(p5WindowWidth/2,windowHeight/2,p5WindowWidth,windowHeight);
        oppFade -= 2.5;
    }
          
    if ((oppFade === 0)) {
        fadeIsDone = true;
        oppFade = 255;
    }
    
    noStroke();
    
    fade-=5;
    if(fade<0){fade=0;play=true;}
    fill(0,0,0,fade);
    rect(p5WindowWidth/2,windowHeight/2,p5WindowWidth,windowHeight);
    angle+=3;
};
	
function draw() {
	  pulse -= pulseS;
    if(pulse<125){pulseS = -0.25;}
    if(pulse>225){pulseS = 0.25;}
    
    if(scene === 0){
        preGame();
    }
    if(scene === 1){
        game();
    }
    if (armorDebug === true) {
        textAlign(LEFT, LEFT);
        fill(255, 0, 0);
        textFont(arialBold);
        textSize(20);
        text(mouseX + " mouseX", mouseX + 7.5, mouseY);
        text(mouseY + " mouseY", mouseX + 7.5, mouseY + 15);
      text(c.x + " c.x", mouseX + 7.5, mouseY + 30);
      text(c.y + " c.y", mouseX + 7.5, mouseY + 45);
      text(car.x + " car.x", mouseX + 7.5, mouseY + 60);
      text(car.y + " car.y", mouseX + 7.5, mouseY + 75);
      text(car.s + " car.s", mouseX + 7.5, mouseY + 90);
    }
}

function windowResized() {
	p5WindowWidth = windowHeight * (16/9);
	Math.floor(p5WindowWidth);
	scaleResolution = windowHeight/853;
	resizeCanvas(p5WindowWidth, windowHeight);
}
