// Final Game Project

// variables declared 
var gameChar_x;
var gameChar_y;
var floorPos_y;
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var trees_x;
var collectables;
var canyons;
var mountains;
var clouds;
var cameraPosX;
var platforms;
var enemies;
var invincibleTimer = 0;
var fallSoundPlayed = false;
var musicStarted = false; // tracks whether bgMusic has been started yet

// sounds
var bgMusic;
var jumpSound;
var fallSound;
var hitSound;
var collectSound;
var cupcakeSound;
var gameOverSound;

function playSfx(name) {
    if (name === 'jump'     && jumpSound)      jumpSound.play();
    if (name === 'fall'     && fallSound)      fallSound.play();
    if (name === 'hit'      && hitSound)       hitSound.play();
    if (name === 'collect'  && collectSound)   collectSound.play();
	if (name === 'cupcake'  && cupcakeSound)  cupcakeSound.play();
    if (name === 'gameover' && gameOverSound) {
        if (bgMusic && bgMusic.isPlaying()) bgMusic.stop();
        gameOverSound.play();
    }
}
// load sounds
function preload() {
    bgMusic       = loadSound('sounds/background.mp3');
    jumpSound     = loadSound('sounds/jump.mp3');
    fallSound     = loadSound('sounds/fall.mp3');
    hitSound      = loadSound('sounds/hit.mp3');
    collectSound  = loadSound('sounds/collect.mp3');
	cupcakeSound  = loadSound('sounds/cupcake.mp3');
    gameOverSound = loadSound('sounds/gameover.mp3');
}

// score
var score = 0;

//lives
var lives = 3;

// if game has started, playing or ended
var gameState = 'start';

// game level
var level = 1;
//cupcake reward at end
var cupcake;

// animation variables for game screens
var titlePulse = 0;
var starParticles = [];

//platform 
function createPlatform(x, y, w, h, col){
    return {
        x_pos: x,
        y_pos: y,
        width: w,
        height: h || 16,
        colour: col || [180, 100, 220]
    };
}
// enemy
        function Enemy(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.range = 200;
    this.startX = x;
    this.direction = 1;

    this.update = function() {
        this.x += this.speed * this.direction;
        if (this.x > this.startX + this.range || this.x < this.startX - this.range) {
            this.direction *= -1;
        }
    };

    this.draw = function() {
       //enemy drawing
        noStroke();
        fill(255, 80, 20);
        ellipse(this.x, this.y, 34, 34);
        fill(255);
        ellipse(this.x - 6, this.y - 5, 9, 9);
        ellipse(this.x + 6, this.y - 5, 9, 9);
        fill(0);
        ellipse(this.x - 6 + this.direction, this.y - 5, 4, 4);
        ellipse(this.x + 6 + this.direction, this.y - 5, 4, 4);
        stroke(80, 0, 0);
        strokeWeight(2);
        line(this.x - 9, this.y - 12, this.x - 3, this.y - 10);
        line(this.x + 3, this.y - 10, this.x + 9, this.y - 12);
        noStroke();
        fill(80, 0, 0);
        arc(this.x, this.y + 5, 12, 8, 0, PI);
        fill(255, 100, 30);
        ellipse(this.x - 20, this.y + 2, 12, 12);
        ellipse(this.x + 20, this.y + 2, 12, 12);
        ellipse(this.x - 9, this.y + 19, 13, 10);
        ellipse(this.x + 9, this.y + 19, 13, 10);
        noStroke();
    };

    this.isHitting = function(charX, charY) {
        return dist(charX, charY, this.x, this.y) < 30;
    };
}

function setup() {
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;

	// sparkles for screens
	for (var i = 0; i < 80; i++) {
		starParticles.push({
			x: random(width),
			y: random(height),
			size: random(2, 5),
			speed: random(0.3, 1.2),
			brightness: random(150, 255)
		});
	}

	initGame();
}

function initGame() {
	gameChar_x = width/2;
	gameChar_y = floorPos_y;
	isLeft = false;
	isRight = false;
	isPlummeting = false;
	isFalling = false;
	cameraPosX = 0;
	invincibleTimer = 0;
	fallSoundPlayed = false;

	trees_x = [-1100,-700,-260,500, 880, 1380, 1760, 2140];

	canyons = [
		{x_pos: 800,  width: 100},
		{x_pos: 1250, width: 100},
		{x_pos: 1700, width: 100},
		{x_pos: 2200, width: 100}
	];

	collectables = [
		{x_pos: 0, y_pos: 380, size: 20, isFound: false},
		{x_pos: 320, y_pos: 380, size: 20, isFound: false},
		{x_pos: 700, y_pos: 380, size: 20, isFound: false},
		{x_pos:1200, y_pos: 380, size: 20, isFound: false}
	];

	mountains = [
		{x_pos: 100, y_pos: 200, width: 100, height: 150},
		{x_pos: 800, y_pos: 100, width: 100, height: 150},
		{x_pos: 1500, y_pos: 600, width: 100, height: 150},
		{x_pos: 2200, y_pos: 800, width: 100, height: 150}
	];

	clouds = [
		{x_pos: -400, y_pos: 50, size: 90},
		{x_pos: -600, y_pos: 150, size: 70},
		{x_pos: 600, y_pos: 160, size: 70},
		{x_pos: 1200, y_pos: 50, size: 90}
	];

	score = 0;
	lives = 3;

    cupcake = {x_pos: 4000, y_pos: floorPos_y - 35, size: 35, isFound: false};

    platforms = [
    createPlatform(-200, floorPos_y - 100, 140, 16, [100, 60, 180]),
    createPlatform( 100, floorPos_y - 100, 120, 16, [180, 60, 160]),
    createPlatform( 420, floorPos_y - 100, 130, 16, [100, 60, 180]),
    createPlatform( 620, floorPos_y - 100, 110, 16, [200, 80, 120]),
    createPlatform( 900, floorPos_y - 100, 150, 16, [100, 60, 180]),
    createPlatform(1150, floorPos_y - 100, 120, 16, [180, 60, 160]),
    createPlatform(1400, floorPos_y - 100, 130, 16, [100, 60, 180]),
    createPlatform(1700, floorPos_y - 100, 110, 16, [200, 80, 120])
    ];

    enemies = [
        new Enemy(-800, floorPos_y - 17, 1.4),
        new Enemy(-300, floorPos_y - 17, 1.6),
        new Enemy(200,  floorPos_y - 17, 1.5),
        new Enemy(712,  floorPos_y - 17, 1.5),
        new Enemy(1100, floorPos_y - 17, 1.8),
        new Enemy(1600, floorPos_y - 17, 1.2),
        new Enemy(2200, floorPos_y - 17, 2.0),
        new Enemy(2900, floorPos_y - 17, 1.6),
        new Enemy(3600, floorPos_y - 17, 1.4),
        new Enemy(4400, floorPos_y - 17, 2.2),
        new Enemy(5200, floorPos_y - 17, 1.9),
        new Enemy(6300, floorPos_y - 17, 1.7),
        new Enemy(7000, floorPos_y - 17, 2.0)
    ];
}
    
// restart game function
function restart(){
	floorPos_y = height * 3/4;
	gameChar_x = width/2;
	gameChar_y = floorPos_y;
	isLeft = false;
	isRight = false;
	isPlummeting = false;
	isFalling = false;
	cameraPosX = 0;
	score = 0;

	for(var i = 0; i < collectables.length; i++){
		collectables[i].isFound = false;
	}

	lives = 3;
}

// home screen
function drawStartScreen() {
	titlePulse += 0.04;
	//background
	for (var y = 0; y < height; y++) {
		var t = y / height;
		var r = lerp(20, 80, t);
		var g = lerp(10, 20, t);
		var b = lerp(60, 100, t);
		stroke(r, g, b);
		line(0, y, width, y);
	}
	// sparkles
	noStroke();
	for (var i = 0; i < starParticles.length; i++) {
		var s = starParticles[i];
		s.x -= s.speed * 0.5;
		if (s.x < 0) s.x = width;
		var twinkle = 128 + 127 * sin(titlePulse * 2 + i);
		fill(s.brightness, s.brightness, 255, twinkle);
		ellipse(s.x, s.y, s.size, s.size);
	}
	// round box
	noStroke();
	fill(255, 105, 180, 60);
	rect(0, height * 0.78, width, height * 0.22);

	//mountains
	fill(50, 30, 80, 180);
	triangle(0, height * 0.78, 180, height * 0.38, 360, height * 0.78);
	triangle(200, height * 0.78, 420, height * 0.28, 640, height * 0.78);
	triangle(500, height * 0.78, 700, height * 0.42, 900, height * 0.78);
	triangle(750, height * 0.78, 950, height * 0.32, 1150, height * 0.78);

	//trees
	fill(35, 20, 60, 200);
	rect(75, height * 0.62, 30, 110);
	triangle(20, height * 0.62, 89, height * 0.42, 160, height * 0.62);
    triangle(20, height * 0.67, 89, height * 0.42, 160, height * 0.67);
    triangle(20, height * 0.73, 89, height * 0.42, 160, height * 0.73);
	rect(855, height * 0.62, 30, 110);
	triangle(800, height * 0.62, 869, height * 0.44, 938, height * 0.62);
    triangle(800, height * 0.67, 869, height * 0.44, 938, height * 0.67);
    triangle(800, height * 0.73, 869, height * 0.44, 938, height * 0.73);
	//glowing title
	var glowSize = 10 + 4 * sin(titlePulse);
	noFill();
	for (var g2 = glowSize; g2 > 0; g2 -= 2) {
		stroke(255, 105, 180, map(g2, 0, glowSize, 0, 40));
		strokeWeight(g2);
		rect(width/2 - 290, height * 0.12 - 10, 580, 100, 20);
	}

	noStroke();
	textAlign(CENTER, CENTER);
	textStyle(BOLD);
	fill(80, 0, 80, 120);
	textSize(60);
	text("ADVENTURE RUN", width/2 + 4, height * 0.195 + 4);
	var pulse = (sin(titlePulse) + 1) / 2;
	fill(
		lerp(255, 255, pulse),
		lerp(105, 240, pulse),
		lerp(180, 255, pulse)
	);
	textSize(60);
	text("ADVENTURE RUN", width/2, height * 0.195);

	// subtitle
	fill(255, 228, 225, 200);
	textSize(20);
	textStyle(NORMAL);
	text("Collect ice creams  •  Find the cupcake  •  Survive!", width/2, height * 0.32);

	// controls to use
	fill(200, 180, 220, 180);
	textSize(15);
	text("Arrow Keys / WASD to move  •  Space / W to jump", width/2, height * 0.36);

	// start game button
	var btnW = 220, btnH = 60;
	var btnX = width/2 - btnW/2;
	var btnY = height * 0.55 - btnH/2;

	var mx = mouseX, my = mouseY;
	var hovering = mx > btnX && mx < btnX + btnW && my > btnY && my < btnY + btnH;

	if (hovering) {
		for (var g3 = 18; g3 > 0; g3 -= 3) {
			noFill();
			stroke(255, 105, 180, map(g3, 0, 18, 0, 60));
			strokeWeight(g3);
			rect(btnX, btnY, btnW, btnH, 30);
		}
	}

	noStroke();
	if (hovering) {
		fill(255, 80, 160);
	} else {
		fill(200, 50, 120);
	}
	rect(btnX, btnY, btnW, btnH, 30);

	fill(255, 180, 210, 80);
	rect(btnX + 8, btnY + 6, btnW - 16, btnH/2 - 4, 20);

	fill(255);
	textStyle(BOLD);
	textSize(22);
	text("▶  START GAME", width/2, btnY + btnH/1.9);

	// ice cream 
	drawIceCreamDecor(width/2 - 250, height * 0.65, 1.4);
	drawIceCreamDecor(width/2 + 290, height * 0.65, 1.4);

	textAlign(LEFT, BASELINE);
}

// game over screen
function drawGameOverScreen() {
	titlePulse += 0.04;

	for (var y = 0; y < height; y++) {
		var t = y / height;
		var r = lerp(60, 20, t);
		var g = lerp(5, 5, t);
		var b = lerp(10, 30, t);
		stroke(r, g, b);
		line(0, y, width, y);
	}

	noStroke();
	for (var i = 0; i < starParticles.length; i++) {
		var s = starParticles[i];
		s.y += s.speed * 0.4;
		if (s.y > height) s.y = 0;
		var twinkle = 80 + 60 * sin(titlePulse + i);
		fill(255, 80, 80, twinkle);
		ellipse(s.x, s.y, s.size * 0.8, s.size * 0.8);
	}

	var glowSize2 = 12 + 5 * sin(titlePulse * 0.8);
	noFill();
	for (var g2 = glowSize2; g2 > 0; g2 -= 2) {
		stroke(220, 30, 30, map(g2, 0, glowSize2, 0, 35));
		strokeWeight(g2);
		rect(width/2 - 270, height * 0.1, 540, 110, 20);
	}

	noStroke();
	textAlign(CENTER, CENTER);
	textStyle(BOLD);

	fill(100, 0, 0, 150);
	textSize(70);
	text("GAME OVER", width/2 + 5, height * 0.21 + 5);

	var pulse = (sin(titlePulse * 1.2) + 1) / 2;
	fill(
		lerp(255, 255, pulse),
		lerp(50, 120, pulse),
		lerp(50, 50, pulse)
	);
	textSize(70);
	text("GAME OVER", width/2, height * 0.21);

	// score system
	fill(80, 0, 0, 120);
	noStroke();
	rect(width/2 - 200, height * 0.32, 400, 80, 15);
	fill(255, 200, 200);
	textSize(22);
	textStyle(NORMAL);
	text("Your score this run:", width/2, height * 0.355);
	fill(255, 255, 100);
	textStyle(BOLD);
	textSize(34);
	text(score + " pts", width/2, height * 0.415);

	fill(255, 160, 160, 180);
	textStyle(NORMAL);
	textSize(17);
	text("Better luck next time — the ice creams await!", width/2, height * 0.5);

	// play again button
	var btnW = 250, btnH = 60;
	var btnX = width/2 - btnW/2;
	var btnY = height * 0.6 - btnH/2;

	var mx = mouseX, my = mouseY;
	var hovering = mx > btnX && mx < btnX + btnW && my > btnY && my < btnY + btnH;

	if (hovering) {
		for (var g3 = 18; g3 > 0; g3 -= 3) {
			noFill();
			stroke(255, 80, 80, map(g3, 0, 18, 0, 50));
			strokeWeight(g3);
			rect(btnX, btnY, btnW, btnH, 30);
		}
	}

	noStroke();
	if (hovering) {
		fill(220, 50, 50);
	} else {
		fill(160, 30, 30);
	}
	rect(btnX, btnY, btnW, btnH, 30);

	fill(255, 120, 120, 80);
	rect(btnX + 8, btnY + 6, btnW - 16, btnH/2 - 4, 20);

	fill(255);
	textStyle(BOLD);
	textSize(24);
	text("↺  PLAY AGAIN", width/2, btnY + btnH/2);

	textAlign(LEFT, BASELINE);
}

//  ice cream icon
function drawIceCreamDecor(cx, cy, scale) {
	noStroke();
	fill(255, 215, 0);
	ellipse(cx - 28 * scale, cy - 22 * scale, 20 * scale, 20 * scale);
	ellipse(cx - 32 * scale, cy - 13 * scale, 20 * scale, 20 * scale);
	ellipse(cx - 23 * scale, cy - 13 * scale, 20 * scale, 20 * scale);
	fill(255, 228, 181, 130);
	ellipse(cx - 28 * scale, cy - 26 * scale, 15 * scale, 10 * scale);
	stroke(160, 82, 45);
	strokeWeight(2 * scale);
	fill(205, 133, 63);
	triangle(cx - 30 * scale, cy + 35 * scale, cx - 40 * scale, cy - 5 * scale, cx - 15 * scale, cy - 5 * scale);
	noStroke();
}
// cupcake reward function
function drawCupcake(cx, cy){
    noStroke();
    fill(139, 69, 19);
	beginShape();
	vertex(cx - 18, cy);
	vertex(cx - 22, cy + 30);
	vertex(cx + 22, cy + 30);
	vertex(cx + 18, cy);
	endShape(CLOSE);

    fill(160, 100, 40);
	rect(cx - 10, cy, 4, 30);
	rect(cx + 5,  cy, 4, 30);

    fill(60, 30, 10);
	ellipse(cx, cy - 2, 44, 22);

    fill(80, 40, 15);
	ellipse(cx, cy - 12, 34, 18);
	fill(90, 45, 18);
	ellipse(cx, cy - 22, 24, 14);
	fill(100, 50, 20);
	ellipse(cx, cy - 30, 16, 10);

	fill(130, 70, 30);
	ellipse(cx - 4, cy - 31, 8, 5);

    stroke(255, 80, 120);  strokeWeight(2);
	line(cx - 12, cy - 8,  cx - 6,  cy - 10);
	stroke(255, 220, 0);   strokeWeight(2);
	line(cx + 16,  cy - 6,  cx + 10,  cy - 7);
	stroke(100, 200, 255); strokeWeight(2);
	line(cx + 5,  cy - 20, cx ,  cy - 30);
	stroke(200, 255, 100); strokeWeight(2);
	line(cx + 10, cy, cx, cy - 2);
	noStroke();
}
// winner screen
function drawWinnerScreen() {
	titlePulse += 0.05;

	for (var y = 0; y < height; y++) {
		var t = y / height;
		var r = lerp(80, 40, t);
		var g = lerp(20, 10, t);
		var b = lerp(120, 60, t);
		stroke(r, g, b);
		line(0, y, width, y);
	}

	noStroke();
	for (var i = 0; i < starParticles.length; i++) {
		var s = starParticles[i];
		s.x += sin(titlePulse + i) * 0.8;
		s.y += s.speed * 0.6;
		if (s.y > height) s.y = 0;
		var twinkle = 150 + 105 * sin(titlePulse * 3 + i);
		var hue = i % 4;
		if (hue === 0) fill(255, 215, 0, twinkle);
		else if (hue === 1) fill(255, 105, 180, twinkle);
		else if (hue === 2) fill(100, 220, 255, twinkle);
		else fill(180, 255, 100, twinkle);
		ellipse(s.x, s.y, s.size, s.size);
	}

	var cupcakeY = height * 0.80;
	var bounce = 8 * sin(titlePulse * 2);
	push();
	translate(width / 2, cupcakeY + bounce);
	scale(2.2);
	drawCupcake(0, 0);
	pop();

	noStroke();
	textAlign(CENTER, CENTER);
	textStyle(BOLD);

	fill(80, 50, 0, 150);
	textSize(72);
	text("YOU WIN!", width / 2 + 5, height * 0.185 + 5);

	var pulse = (sin(titlePulse * 1.5) + 1) / 2;
	fill(
		lerp(255, 255, pulse),
		lerp(180, 240, pulse),
		lerp(0, 80, pulse)
	);
	textSize(72);
	text("YOU WIN!", width / 2, height * 0.185);

	// score system
	fill(255, 240, 180);
	textSize(20);
	textStyle(NORMAL);
	text("You found the cupcake!", width / 2, height * 0.335);
	fill(255, 255, 100);
	textStyle(BOLD);
	textSize(30);
	text(score + " pts  •  Level " + level, width / 2, height * 0.395);

	// play again button
	var btnW = 260, btnH = 62;
	var btnX = width / 2 - btnW / 2;
	var btnY = height * 0.53 - btnH / 2;

	var mx = mouseX, my = mouseY;
	var hovering = mx > btnX && mx < btnX + btnW && my > btnY && my < btnY + btnH;

	if (hovering) {
		for (var g3 = 18; g3 > 0; g3 -= 3) {
			noFill();
			stroke(255, 215, 0, map(g3, 0, 18, 0, 55));
			strokeWeight(g3);
			rect(btnX, btnY, btnW, btnH, 32);
		}
	}

	noStroke();
	if (hovering) {
		fill(220, 160, 0);
	} else {
		fill(160, 110, 0);
	}
	rect(btnX, btnY, btnW, btnH, 32);

	fill(255, 240, 120, 80);
	rect(btnX + 8, btnY + 6, btnW - 16, btnH / 2 - 4, 22);

	fill(255);
	textStyle(BOLD);
	textSize(23);
	text("▶  PLAY AGAIN", width / 2, btnY + btnH / 1.9);

	textAlign(LEFT, BASELINE);
}

function draw() {
	if (gameState === 'start') {
		drawStartScreen();
		return;
	}

	if (gameState === 'gameover') {
		drawGameOverScreen();
		return;
	}

	if (gameState === 'winner') {
		drawWinnerScreen();
		return;
	}
// character in middle
	cameraPosX = gameChar_x - width/2;

	background(240, 200, 150);

	push();
	translate(-cameraPosX, 0);

	// ground
	noStroke();
	fill(255,105,180);
	rect(-20000, floorPos_y, 30000, height - floorPos_y);

	// mountains
	for(var i = 0; i < mountains.length; i++) {
		var mountainX = mountains[i].x_pos;
		if(mountainX - cameraPosX < -800){
			mountains[i].x_pos += mountains.length*750;
		} else if(mountainX - cameraPosX > width+800){
			mountains[i].x_pos -= mountains.length*750;
		}
		noStroke();
		fill(72,61,139);
		triangle(mountainX + 250, mountains[i].height + 282, mountainX + 500, mountains[i].height - 300, mountainX + 750, mountains[i].height + 282);
	}

	// canyons
	for(var i = 0; i < canyons.length; i++){
		var canyonX = canyons[i].x_pos;
		if(canyonX - cameraPosX < -300){
			canyons[i].x_pos += canyons.length*350;
		} else if(canyonX - cameraPosX > width +300){
			canyons[i].x_pos -= canyons.length*350;
		}
		noStroke();
		fill(240, 200, 150);
		rect(canyonX, floorPos_y, canyons[i].width, height - floorPos_y);
		fill(216,191,216);
		triangle(canyonX + 10, height, canyonX + 30, height - 40, canyonX + 50, height);
		triangle(canyonX + 50, height, canyonX+ 70, height - 30, canyonX + 90, height);
		fill(225,30,147);
		triangle(canyonX, floorPos_y, canyonX + 20, floorPos_y, canyonX, height);
		triangle(canyonX + canyons[i].width, floorPos_y, canyonX + canyons[i].width - 20, floorPos_y, canyonX + canyons[i].width, height);

		if(gameChar_y >= floorPos_y && !isFalling && gameChar_x > canyonX + 20 && gameChar_x < canyonX + canyons[i].width - 20) {
			isPlummeting = true;
			if (!fallSoundPlayed) {
				playSfx('fall');
				fallSoundPlayed = true;
			}
		}
		if(isPlummeting) {
			gameChar_y += 10;
		}
	}

	//trees
	for (var i = 0; i < trees_x.length; i++){
		var treeX = trees_x[i];
		if(treeX - cameraPosX < - 200){
			trees_x[i] += trees_x.length*500;
		} else if(treeX - cameraPosX > width + 200){
			trees_x[i] -= trees_x.length*500;
		}
		noStroke();
		fill(180, 130, 70);
		rect(treeX, floorPos_y - 150, 60, 150);
		fill(255,255,204);
		triangle(treeX - 60, floorPos_y - 50, treeX + 30, floorPos_y - 200, treeX + 120, floorPos_y - 50);
		fill(255,255,102);
		triangle(treeX - 60, floorPos_y - 80, treeX + 30, floorPos_y - 200, treeX + 120, floorPos_y - 80);
		fill(255,255,153);
		triangle(treeX - 50, floorPos_y - 110, treeX+ 30, floorPos_y - 220, treeX+ 110, floorPos_y - 110);
	}

	// clouds
	for (var i = 0; i < clouds.length; i++){
		var cloudsX = clouds[i].x_pos;
		if(cloudsX - cameraPosX < -600){
			clouds[i].x_pos += clouds.length*700;
		} else if(cloudsX - cameraPosX > width + 600){
			clouds[i].x_pos -= clouds.length*700;
		}
		fill(255,228,225);
		ellipse(clouds[i].x_pos - 280, clouds[i].y_pos + 20, clouds[i].size + 10, clouds[i].size);
		ellipse(clouds[i].x_pos - 240, clouds[i].y_pos + 30, clouds[i].size - 5, clouds[i].size - 20);
		ellipse(clouds[i].x_pos - 320, clouds[i].y_pos + 30, clouds[i].size - 5, clouds[i].size - 20);
		ellipse(clouds[i].x_pos + 100, clouds[i].y_pos + 60, clouds[i].size + 10, clouds[i].size);
		ellipse(clouds[i].x_pos + 60, clouds[i].y_pos + 70, clouds[i].size - 5, clouds[i].size - 20);
		ellipse(clouds[i].x_pos + 140, clouds[i].y_pos + 70, clouds[i].size - 5, clouds[i].size - 20);
		ellipse(clouds[i].x_pos + 450, clouds[i].y_pos + 50, clouds[i].size + 10, clouds[i].size);
		ellipse(clouds[i].x_pos + 490, clouds[i].y_pos + 60, clouds[i].size - 5, clouds[i].size - 20);
		ellipse(clouds[i].x_pos + 410, clouds[i].y_pos + 60, clouds[i].size - 5, clouds[i].size - 20);
	}

	//collectable
	for(var i= 0; i < collectables.length; i++){
		var c = collectables[i];
		if(!c.isFound && dist(gameChar_x, gameChar_y, c.x_pos, c.y_pos) < c.size + 35 && gameChar_y >= c.y_pos - 35) {
			c.isFound = true;
			score += 10;
			playSfx('collect');
		}
		if(c.isFound == false) {
			noStroke();
			fill(255,215,0);
			ellipse(c.x_pos - 28, c.y_pos - 22, 20, 20);
			ellipse(c.x_pos - 32, c.y_pos - 13, 20, 20);
			ellipse(c.x_pos - 23, c.y_pos - 13, 20, 20);
			fill(255,228,181, 130);
			ellipse(c.x_pos - 28, c.y_pos - 26, 15, 10);
			ellipse(c.x_pos - 18, c.y_pos - 14, 5, 10);
			stroke(160,82,45);
			strokeWeight(2);
			fill(205,133,63);
			triangle(c.x_pos - 30, c.y_pos + 35, c.x_pos - 40, c.y_pos - 5, c.x_pos - 15, c.y_pos - 5);
			stroke(160,82,45);
			strokeWeight(1);
			line(c.x_pos - 20, c.y_pos - 5, c.x_pos - 32, c.y_pos + 25);
			line(c.x_pos - 30, c.y_pos - 5, c.x_pos - 35, c.y_pos + 10);
			line(c.x_pos - 39, c.y_pos , c.x_pos - 20, c.y_pos + 5);
			line(c.x_pos - 36, c.y_pos + 10 , c.x_pos - 25, c.y_pos + 21);
		}
		if(c.x_pos - cameraPosX < -200){
			c.x_pos += collectables.length*400;
			c.isFound = false;
		} else if(c.x_pos - cameraPosX > width+200){
			c.x_pos -= collectables.length*400;
			c.isFound = false;
		}
	}
    // platforms
    for (var i = 0; i < platforms.length; i++) {
		var p = platforms[i];
		if (p.x_pos - cameraPosX < -400) {
			p.x_pos += platforms.length * 500;
		} else if (p.x_pos - cameraPosX > width + 400) {
			p.x_pos -= platforms.length * 500;
		}
		noStroke();
		fill(p.colour[0], p.colour[1], p.colour[2]);
		rect(p.x_pos, p.y_pos, p.width, p.height, 4);
		fill(255, 255, 255, 60);
		rect(p.x_pos + 4, p.y_pos + 3, p.width - 8, 5, 3);
	}

    // cupcake reward
	if (!cupcake.isFound) {
		drawCupcake(cupcake.x_pos, cupcake.y_pos);
		if (dist(gameChar_x, gameChar_y, cupcake.x_pos, cupcake.y_pos) < cupcake.size + 20) {
			cupcake.isFound = true;
			score += 50;
			playSfx('cupcake');
			level++;
			if (bgMusic && !bgMusic.isPlaying()) {
				bgMusic.setVolume(0.5);
				bgMusic.loop();
			}
			gameState = 'winner';
		}
	}

    // enemies
    if (invincibleTimer > 0) invincibleTimer--;
    if (!cupcake.isFound) {
        for (var i = 0; i < enemies.length; i++) {
            var e = enemies[i];
            if (e.x - cameraPosX < -600) {
                var shift = enemies.length * 600;
                e.x += shift;
                e.startX += shift;
            } else if (e.x - cameraPosX > width + 600) {
                var shift = enemies.length * 600;
                e.x -= shift;
                e.startX -= shift;
            }

            e.update();
            e.draw();

            if (invincibleTimer <= 0 && e.isHitting(gameChar_x, gameChar_y)) {
                lives--;
                playSfx('hit');
                invincibleTimer = 120; 
                if (lives > 0) {
                    gameChar_x = width / 2;
                    gameChar_y = floorPos_y;
                    isPlummeting = false;
                    isFalling = false;
                    cameraPosX = 0;
                } else {
                    playSfx('gameover');
                    gameState = 'gameover';
                }
            }
        }
    }

	// character drawing
	if(isLeft && isFalling) {
		stroke(0); strokeWeight(1);
		fill(139,69,19); rect(gameChar_x - 13, gameChar_y - 63, 20, 20);
		fill(255,228,196); ellipse(gameChar_x - 4, gameChar_y - 60, 20, 22);
		rect(gameChar_x - 8, gameChar_y - 49, 7, 15, 2);
		fill(0); ellipse(gameChar_x - 10, gameChar_y - 59, 2, 2);
		fill(139,69,19); arc(gameChar_x - 3.5, gameChar_y - 62, 21, 20, PI, 0);
		noStroke(); rect(gameChar_x + 1, gameChar_y - 63, 5.3, 17);
		stroke(0); fill(255,228,196);
		rect(gameChar_x - 13.5, gameChar_y - 43, 2, 10); rect(gameChar_x + 1.5, gameChar_y - 43, 2, 10);
		rect(gameChar_x - 13.5, gameChar_y - 33, 2, 3); rect(gameChar_x + 1.5, gameChar_y - 33, 2, 3);
		fill(75,0,130); rect(gameChar_x - 10, gameChar_y - 47, 10, 20);
		rect(gameChar_x - 14, gameChar_y - 47, 4, 6); rect(gameChar_x, gameChar_y - 47, 4, 6);
		fill(0); rect(gameChar_x - 10, gameChar_y - 27, 4, 15); rect(gameChar_x - 4.5, gameChar_y - 27, 4, 15);
		fill(173,216,230); rect(gameChar_x - 14, gameChar_y - 12, 6, 5); rect(gameChar_x - 6.5, gameChar_y - 12, 6, 5);
	} else if(isRight && isFalling) {
		stroke(0); strokeWeight(1);
		fill(139,69,19); rect(gameChar_x - 7, gameChar_y - 63, 20, 20);
		fill(255,228,196); ellipse(gameChar_x + 4, gameChar_y - 60, 20, 22);
		rect(gameChar_x + 1, gameChar_y - 49, 7, 15, 2);
		fill(0); ellipse(gameChar_x + 10, gameChar_y - 59, 2, 2);
		fill(139,69,19); arc(gameChar_x + 3.5, gameChar_y - 62, 21, 20, PI, 0);
		noStroke(); rect(gameChar_x - 6, gameChar_y - 63, 5.3, 17);
		stroke(0); fill(255,228,196);
		rect(gameChar_x + 11.5, gameChar_y - 43, 2, 10); rect(gameChar_x - 3.5, gameChar_y - 43, 2, 10);
		rect(gameChar_x + 11.5, gameChar_y - 33, 2, 3); rect(gameChar_x - 3.5, gameChar_y - 33, 2, 3);
		fill(75,0,130); rect(gameChar_x , gameChar_y - 47, 10, 20);
		rect(gameChar_x + 9.6, gameChar_y - 47, 4, 6); rect(gameChar_x - 3.2, gameChar_y - 47, 4, 6);
		fill(0); rect(gameChar_x + 6, gameChar_y - 27, 4, 15); rect(gameChar_x, gameChar_y - 27, 4, 15);
		fill(173,216,230); rect(gameChar_x + 8, gameChar_y - 12, 6, 5); rect(gameChar_x , gameChar_y - 12, 6, 5);
	} else if(isLeft) {
		stroke(0); strokeWeight(1);
		fill(139,69,19); rect(gameChar_x - 13, gameChar_y - 63, 20, 20);
		fill(255,228,196); ellipse(gameChar_x - 4, gameChar_y - 60, 20, 22);
		rect(gameChar_x - 8, gameChar_y - 49, 7, 15, 2);
		fill(0); ellipse(gameChar_x - 10, gameChar_y - 59, 2, 2);
		fill(139,69,19); arc(gameChar_x - 3.5, gameChar_y - 62, 21, 20, PI, 0);
		noStroke(); rect(gameChar_x + 1, gameChar_y - 63, 5, 17);
		stroke(0); fill(255,228,196);
		rect(gameChar_x - 13, gameChar_y - 43, 4, 15); rect(gameChar_x - 1, gameChar_y - 43, 4, 15);
		rect(gameChar_x - 13, gameChar_y - 28, 3, 3, 1); rect(gameChar_x - 1, gameChar_y - 28, 4, 3, 1);
		fill(75,0,130); rect(gameChar_x - 10 , gameChar_y - 45, 10, 22);
		rect(gameChar_x - 14, gameChar_y - 45, 4, 6); rect(gameChar_x, gameChar_y - 45, 4, 6);
		fill(0); rect(gameChar_x - 10, gameChar_y - 23, 4, 20); rect(gameChar_x - 4.5, gameChar_y - 23, 4, 20);
		fill(173,216,230); rect(gameChar_x - 12, gameChar_y - 5, 6, 5, 2); rect(gameChar_x - 6, gameChar_y - 5, 6, 5, 2);
	} else if(isRight) {
		stroke(0); strokeWeight(1);
		fill(139,69,19); rect(gameChar_x - 7, gameChar_y - 63, 20, 20);
		fill(255,228,196); ellipse(gameChar_x + 4, gameChar_y - 60, 20, 22);
		rect(gameChar_x + 1, gameChar_y - 49, 7, 15, 2);
		fill(0); ellipse(gameChar_x + 10, gameChar_y - 59, 2, 2);
		fill(139,69,19); arc(gameChar_x + 3.5, gameChar_y - 62, 21, 20, PI, 0);
		noStroke(); rect(gameChar_x - 6, gameChar_y - 63, 5.3, 17);
		stroke(0); fill(255,228,196);
		rect(gameChar_x + 9, gameChar_y - 43, 4, 15); rect(gameChar_x - 3, gameChar_y - 43, 4, 15);
		rect(gameChar_x + 10, gameChar_y - 28, 3, 3, 1); rect(gameChar_x - 3, gameChar_y - 28, 4, 3, 1);
		fill(75,0,130); rect(gameChar_x , gameChar_y - 45, 10, 22);
		rect(gameChar_x + 9.6, gameChar_y - 45, 4, 6); rect(gameChar_x - 3.2, gameChar_y - 45, 4, 6);
		fill(0); rect(gameChar_x + 6, gameChar_y - 23, 4, 20); rect(gameChar_x, gameChar_y - 23, 4, 20);
		fill(173,216,230); rect(gameChar_x + 6, gameChar_y - 5, 6, 5, 2); rect(gameChar_x , gameChar_y - 5, 6, 5, 2);
	} else if(isFalling || isPlummeting) {
		stroke(0); strokeWeight(1);
		fill(139,69,19); rect(gameChar_x - 11, gameChar_y - 63, 22, 20);
		fill(255,228,196); ellipse(gameChar_x, gameChar_y - 60, 22, 22);
		rect(gameChar_x - 5, gameChar_y - 49, 10, 15, 2);
		fill(0); ellipse(gameChar_x - 4, gameChar_y - 60, 2, 2); ellipse(gameChar_x + 4, gameChar_y - 60, 2, 2);
		fill(139,69,19); arc(gameChar_x, gameChar_y - 63, 23, 20, PI, 0);
		fill(255,228,196);
		rect(gameChar_x - 16, gameChar_y - 48, 4, 15); rect(gameChar_x + 12, gameChar_y - 48, 4, 15);
		rect(gameChar_x - 16, gameChar_y - 34, 4, 3); rect(gameChar_x + 12, gameChar_y - 34, 4, 3);
		fill(75,0,130); rect(gameChar_x - 10 , gameChar_y - 48, 20, 22);
		rect(gameChar_x - 15, gameChar_y - 48, 4, 6); rect(gameChar_x + 12, gameChar_y - 48, 4, 6);
		fill(0); rect(gameChar_x - 10, gameChar_y - 26, 8, 15); rect(gameChar_x + 2, gameChar_y - 26, 8, 15);
		fill(173,216,230); rect(gameChar_x - 11, gameChar_y - 11, 9, 5); rect(gameChar_x + 2, gameChar_y - 11, 9, 5);
	} else {
		stroke(0); strokeWeight(1);
		fill(139,69,19); rect(gameChar_x - 11, gameChar_y - 63, 22, 20);
		fill(255,228,196); ellipse(gameChar_x, gameChar_y - 60, 22, 22);
		rect(gameChar_x - 5, gameChar_y - 49, 10, 15, 2);
		fill(0); ellipse(gameChar_x - 4, gameChar_y - 60, 2, 2); ellipse(gameChar_x + 4, gameChar_y - 60, 2, 2);
		fill(139,69,19); arc(gameChar_x, gameChar_y - 63, 23, 20, PI, 0);
		fill(255,228,196);
		rect(gameChar_x - 14, gameChar_y - 43, 4, 15); rect(gameChar_x + 10, gameChar_y - 43, 4, 15);
		rect(gameChar_x - 14, gameChar_y - 28, 4, 6, 2); rect(gameChar_x + 10, gameChar_y - 28, 4, 6, 2);
		fill(75,0,130); rect(gameChar_x - 10 , gameChar_y - 45, 20, 22);
		rect(gameChar_x - 14, gameChar_y - 45, 4, 6); rect(gameChar_x + 10, gameChar_y - 45, 4, 6);
		fill(0); rect(gameChar_x - 10, gameChar_y - 23, 8, 20); rect(gameChar_x + 2, gameChar_y - 23, 8, 20);
		fill(173,216,230); rect(gameChar_x - 11, gameChar_y - 5, 9, 5, 3); rect(gameChar_x + 2, gameChar_y - 5, 9, 5, 3);
	}

	pop();

	// score system
	//score
	noStroke();
	fill(20, 0, 30, 100);
	rect(13, 13, 200, 48, 12);
	fill(85, 0, 105, 230);
	rect(10, 10, 200, 48, 12);
	fill(255, 200, 255, 50);
	rect(15, 14, 190, 16, 8);
	noStroke();
	fill(255, 255, 255);
	textSize(22);
	textStyle(BOLD);
	textAlign(LEFT, BASELINE);
	text("Score: " + score, 22, 44);
	//lives
	noStroke();
	fill(20, 0, 0, 100);
	rect(13, 66, 200, 48, 12);
	fill(130, 0, 25, 230);
	rect(10, 63, 200, 48, 12);
	fill(255, 180, 180, 50);
	rect(15, 67, 190, 16, 8);
	noStroke();
	fill(255, 255, 255);
	textSize(22);
	textStyle(BOLD);
	textAlign(LEFT, BASELINE);
	text("Lives: " + lives, 22, 97);


// gravity
	var onPlatform = false;
	if (!isPlummeting) {
		for (var i = 0; i < platforms.length; i++) {
			var p = platforms[i];
			if (gameChar_x > p.x_pos &&
				gameChar_x < p.x_pos + p.width &&
				gameChar_y <= p.y_pos + 15 &&
				gameChar_y >= p.y_pos - 15) {
				gameChar_y = p.y_pos;
				onPlatform = true;
				isFalling = false;
			}
		}
	}

	if (gameChar_y < floorPos_y && !isPlummeting && !onPlatform) {
		gameChar_y += 3;
		isFalling = true;
	} else if (!isPlummeting && !onPlatform) {
		isFalling = false;
	}

	if(isLeft) { gameChar_x -= 5; }
	if(isRight) { gameChar_x += 5; }

	if (gameChar_y > height){
		lives--;
		if(lives > 0){
			gameChar_x = width/2;
			gameChar_y = floorPos_y;
			isPlummeting = false;
			isFalling = false;
			fallSoundPlayed = false;
			score = 0;
		} else {
			playSfx('gameover');
			gameState = 'gameover';
		}
	}
}

// click button to play music at start
function startMusicOnce() {
	if (!musicStarted && bgMusic) {
		bgMusic.setVolume(0.5);
		bgMusic.loop();
		musicStarted = true;
	}
}

function mousePressed() {
	startMusicOnce();
	if (gameState === 'start') {
		var btnW = 220, btnH = 60;
		var btnX = width/2 - btnW/2;
		var btnY = height * 0.55 - btnH/2;
		if (mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH) {
			initGame();
			gameState = 'playing';
		}
	} else if (gameState === 'gameover') {
		var btnW = 250, btnH = 60;
		var btnX = width/2 - btnW/2;
		var btnY = height * 0.6 - btnH/2;
		if (mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH) {
			initGame();
			gameState = 'playing';
			if (bgMusic && !bgMusic.isPlaying()) {
				bgMusic.loop();
			}
		}
	} else if (gameState === 'winner') {
		var btnW = 260, btnH = 62;
		var btnX = width/2 - btnW/2;
		var btnY = height * 0.53 - btnH/2;
		if (mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH) {
			var savedLevel = level;
			initGame();
			level = savedLevel;
			gameState = 'playing';
			if (bgMusic && !bgMusic.isPlaying()) {
				bgMusic.setVolume(0.5);
				bgMusic.loop();
			}
		}
	}
}

function keyPressed() {
	startMusicOnce();
	if (gameState !== 'playing') return;

	if(isPlummeting) { return; }

	if(keyCode == 65 || key == 'a' || keyCode == 37 || key == 'ArrowLeft') {
		isLeft = true;
	} else if(keyCode == 68 || key == 'd' || keyCode == 39 || key == 'ArrowRight') {
		isRight = true;
	}

	if((keyCode == 87 || key == 'w'|| keyCode == 32 || key == ' ') && !isFalling && !isPlummeting) {
		gameChar_y -= 140;
		isFalling = true;
		playSfx('jump');
	}
}

function keyReleased() {
	if (gameState !== 'playing') return;

	if(keyCode == 65 || key == 'a' || keyCode == 37 || key == 'ArrowLeft') {
		isLeft = false;
	} else if(keyCode == 68 || key == 'd' || keyCode == 39 || key == 'ArrowRight') {
		isRight = false;
	}
}