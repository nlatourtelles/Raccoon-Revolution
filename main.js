var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

// Animation.prototype.drawFrame = function (tick, ctx, x, y) {
//     this.elapsedTime += tick;
//     if (this.isDone()) {
//         if (this.loop) this.elapsedTime = 0;
//     }
//     var frame = this.currentFrame();
//     var xindex = 0;
//     var yindex = 0;
//     xindex = frame % this.sheetWidth;
//     yindex = Math.floor(frame / this.sheetWidth);

//     ctx.drawImage(this.spriteSheet,
//                  xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
//                  this.frameWidth, this.frameHeight,
//                  x, y,
//                  this.frameWidth * this.scale,
//                  this.frameHeight * this.scale);
// }

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

/**
 * The player controlled character
 * @param {*} game 
 * @param {*} walkUp Sprite sheet for the walk up animation 
 * @param {*} walkDown Sprite sheet for the walk down animation
 * @param {*} walkLeft Sprite sheet for the walk left animation
 * @param {*} walkRight Sprite sheet for the walk right animation
 */
function Raccoon(game, walkUp, walkDown, walkLeft, walkRight) {
    this.walkUp = new Animation(walkUp, 64, 64, 512, .15, 8, true, 2);
    this.walkDown = new Animation(walkDown, 64, 64, 768, .15, 12, true, 2);
    this.walkLeft = new Animation(walkLeft,64, 64, 512, .15, 8, true, 2);
    this.walkRight = new Animation(walkRight, 64, 64, 576, .15, 9, true, 2);
    this.game = game;
    this.ctx =  game.ctx;
    this.speed = 150;
    this.hp = 4;
    this.x = 50;
    this.y = 50;
    this.direction = "right";
    this.lastShot = 0;
    this.invincible = false;
    this.invincibleTIme = 0;
    this.hitBox = {x: this.x, y: this.y, width: 64, height: 64};
    this.bulletUp = {sprite: "./img/Bullet_Up.png", direction: "up", scale: .9};
    this.bulletDown = {sprite: "./img/Bullet_Down.png", direction: "down", scale: .9};
    this.bulletRight = {sprite: "./img/Bullet_Right.png", direction: "right", scale: .9};
    this.bulletLeft =  {sprite: "./img/Bullet_Left.png", direction: "left", scale: .9};
    
    this.frate = 1000;
    this.health = 4;
}

Raccoon.prototype.draw = function () {

    if(this.direction === "up") {
        this.walkUp.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else if (this.direction === "down") {
        this.walkDown.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else if (this.direction === "left") {
        this.walkLeft.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else if (this.direction === "right") {
        this.walkRight.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }

    // this.walkRight.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

Raccoon.prototype.update = function () {
    if(this.game.started == false){
        return;
    }
    if( this.game.keyPress["up"] ) {
        this.y -= this.game.clockTick * this.speed;
        this.direction = "up";
        this.hitBox.y = this.y;
    }
    if( this.game.keyPress["down"]) {
        this.y += this.game.clockTick * this.speed;
        this.direction = "down";
        this.hitBox.y = this.y;
    }
    if( this.game.keyPress["left"]) {
        this.x -= this.game.clockTick * this.speed;
        this.direction = "left";
        this.hitBox.x = this.x;
    }
    if( this.game.keyPress["right"]) {
        this.x += this.game.clockTick * this.speed;
        this.direction = "right";
        this.hitBox.x = this.x;
    }

    currentTime = Date.now() / this.frate;
    if( this.game.keyPress["shootUp"]) {
        this.direction = "up";
        
        if(currentTime - this.lastShot >= .5) {
            this.lastShot = currentTime;
   
            this.game.addEntity(new Bullet(this.game, AM.getAsset(this.bulletUp.sprite), this.x+32, this.y, this.bulletUp.direction, this.bulletUp.scale));
        }  
         
    }else if( this.game.keyPress["shootDown"]) {
        this.direction = "down";
        
        if(currentTime - this.lastShot >= .5) {
            this.lastShot = currentTime;
            this.game.addEntity(new Bullet(this.game, AM.getAsset(this.bulletDown.sprite), this.x + 32, this.y+64, this.bulletDown.direction, this.bulletDown.scale));
        } 

    } else if(this.game.keyPress["shootLeft"]) {
        this.direction = "left";
        
        if(currentTime - this.lastShot >= .5) {
            this.lastShot = currentTime;
            this.game.addEntity(new Bullet(this.game, AM.getAsset(this.bulletLeft.sprite), this.x, this.y+35, this.bulletLeft.direction, this.bulletLeft.scale));
        } 

    }else if(this.game.keyPress["shootRight"]) {
        this.direction = "right";
        
        if(currentTime - this.lastShot >= .5) {
            this.lastShot = currentTime;
            this.game.addEntity(new Bullet(this.game, AM.getAsset(this.bulletRight.sprite), this.x+50, this.y+35, this.bulletRight.direction, this.bulletRight.scale));
        } 

    }

    if(this.game.entities[4].x > this.x){
        if(this.game.entities[4].x - this.x <50){
            if(this.game.entities[4].y - this.y < 50 && this.invincible == false){
                this.time = Date.now();
                this.hp -= 1;
                if(this.hp <= 0){
                    // this.game.started = false;
                }
                this.invincible = true;
            }
        }
    }
    if(Date.now() - this.time > 1000){
        this.invincible = false;
    }
}

function Bullet(game, spriteSheet, x, y, direction, scale) {
    this.bullet = new Animation(spriteSheet, 64, 64, 896, 1, 14, true, scale);
    this.game = game;
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.scale = scale;
    this.ctx = game.ctx;
    this.speed = 250;
}

Bullet.prototype.update = function() {
    if(this.direction === "up") {
        this.y -= this.game.clockTick * this.speed;
    } else if( this.direction === "down") {
        this.y += this.game.clockTick * this.speed;
    } else if( this.direction === "left") {
        this.x -= this.game.clockTick * this.speed;
    } else if( this.direction === "right") {
        this.x += this.game.clockTick * this.speed;
    }

    if(this.game.entities[4].x > this.x){
        if(this.game.entities[4].x - this.x <25){
            if(this.game.entities[4].y - this.y < 25){
                this.game.score += 100;
            }
        }
    }
}

Bullet.prototype.draw = function() {
    this.bullet.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

function MeleeRobot(game, walkUp, walkDown, walkLeft, walkRight) {
    this.walkUp = new Animation(walkUp, 64, 64, 512, .15, 8, true, 2);
    this.walkDown = new Animation(walkDown, 64, 64, 512, .15, 8, true, 2);
    this.walkLeft = new Animation(walkLeft, 64, 64, 768, .15, 12, true, 2);
    this.walkRight = new Animation(walkRight, 64, 64, 768, .15, 12, true, 2);
    this.game = game;
    this.ctx = game.ctx;
    this.speed = 100;
    this.hp = 4;
    this.x = 50;
    this.y = 300;
    this.direction = "up";
    
}

MeleeRobot.prototype.update = function() {
    if(this.game.started == false){
        return;
    }

    if(this.y < this.game.player.y) {
        this.y += this.game.clockTick * this.speed;
        this.direction = "down"
    }
    if(this.y > this.game.player.y) {
        this.y -= this.game.clockTick * this.speed;
        this.direction = "up";
    }
    if(this.x < this.game.player.x) {
        this.x += this.game.clockTick * this.speed;
        this.direction = "right";
    }
    if (this.x > this.game.player.x) {
        this.x -= this.game.clockTick * this.speed;
        this.direction = "left";
    }
    console.log(this.x - this.game.player.x);

    xDiff = Math.abs(this.x - this.game.player.x);
    if (xDiff < 2) {
        if(this.y < this.game.player.y) {
            this.direction = "down"
        }
        if(this.y > this.game.player.y) {
            this.direction = "up";
        }
    }
}

MeleeRobot.prototype.draw = function() {
    if(this.direction === "up") {
        this.walkUp.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else if(this.direction === "down") {
        this.walkDown.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else if (this.direction === "left") {
        this.walkLeft.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else if (this.direction === "right") {
        this.walkRight.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }
}

function LaserRobot(game, walkUp, walkDown, walkLeft, walkRight) {

    this.walkUp = new Animation(walkUp, 64, 64, 512, .15, 8, true, 2);
    this.walkDown = new Animation(walkDown, 64, 64, 512, .15, 8, true, 2);
    this.walkLeft = new Animation(walkLeft, 64, 64, 768, .15, 12, true, 2);
    this.walkRight = new Animation(walkRight, 64, 64, 768, .15, 12, true, 2);
    this.game = game;
    this.ctx = game.ctx;
    this.speed = 150;
    this.hp = 4;
    this.x = 500;
    this.y = 50;
    this.lastShot = 0;
}


LaserRobot.prototype.update = function() {
    if(this.game.started == false){
        return;
    }
    currentTime = Date.now() / 1000;
    if (this.x >=1241 &&  this.y < 650)  {
        this.y += this.game.clockTick * this.speed;
        if(currentTime - this.lastShot >=1) {
            this.game.addEntity(new Bullet(this.game, AM.getAsset("./img/Bullet_Down.png"), this.x+50, this.y+35, "down", .9));
            this.lastShot = currentTime;
        }
    } else if (this.y >= 650 && this.x > 75 ) {
        this.x -= this.game.clockTick * this.speed;
        if(currentTime - this.lastShot >=1) {
            this.game.addEntity(new Bullet(this.game, AM.getAsset("./img/Bullet_Left.png"), this.x+50, this.y+35, "left", .9));
            this.lastShot = currentTime;
        }
    } else if (this.x <=75 && this.y > 75) {
        this.y -= this.game.clockTick * this.speed;
        if(currentTime - this.lastShot >=1) {
            this.game.addEntity(new Bullet(this.game, AM.getAsset("./img/Bullet_Up.png"), this.x+50, this.y+35, "up", .9));
            this.lastShot = currentTime;
        }
    } else if (this.y <= 75 && this.x <= 1241) {
        this.x += this.game.clockTick * this.speed;
        if(currentTime - this.lastShot >=1) {
            this.game.addEntity(new Bullet(this.game, AM.getAsset("./img/Bullet_Right.png"), this.x+50, this.y+35, "right", .9));
            this.lastShot = currentTime;
        }
    }


}

LaserRobot.prototype.draw = function() {
    if (this.x >=1241 &&  this.y < 650)  {
        this.walkDown.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else if (this.y >= 650 && this.x > 75) {
        this.walkLeft.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else if (this.x <=75 && this.y >75) {
        this.walkUp.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else if (this.y <= 75 && this.x <= 1241) {
        this.walkRight.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }
}

function Turret(game, lookUp, lookDown, lookLeft, lookRight, direction, xLoc, yLoc) {
    this.upAnim = new Animation(lookUp, 64, 64, 128, .15, 2, true, 2);
    this.downAnim = new Animation(lookDown, 64, 64, 192, .15, 3, true, 2);
    this.leftAnim = new Animation(lookLeft, 64, 64, 192, .15, 3, true, 2);
    this.rightAnim = new Animation(lookRight, 64, 64, 192, .15, 3, true, 2);
    this.direction = direction;
    this.x = xLoc;
    this.y = yLoc;
    this.game = game;
    this.hp = 4;
    this.lastShot = 0;
    this.ctx = game.ctx;
}

Turret.prototype.update = function() {
    if(this.game.started == false){
        return;
    }
    currentTime = Date.now() / 1000;
    if(currentTime - this.lastShot >=5) {
        this.lastShot = currentTime;
        if(this.direction === "up") {
            this.game.addEntity(new Bullet(this.game, AM.getAsset("./img/Bullet_Up.png"), this.x+30, this.y, this.direction, .9));
        } else if(this.direction === "down") {
            this.game.addEntity(new Bullet(this.game, AM.getAsset("./img/Bullet_Down.png"), this.x+30, this.y, this.direction, .9));
        } else if(this.direction === "left") {
            this.game.addEntity(new Bullet(this.game, AM.getAsset("./img/Bullet_Left.png"), this.x+30, this.y, this.direction, .9));
        } else if(this.direction === "right") {
            this.game.addEntity(new Bullet(this.game, AM.getAsset("./img/Bullet_Right.png"), this.x+30, this.y, this.direction, .9));
        }
    }
}

Turret.prototype.draw = function() {
    if(this.direction === "up") {
        this.upAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else if(this.direction === "down") {
        this.downAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else if(this.direction === "left") {
        this.leftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else if(this.direction === "right") {
        this.rightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }
}

function GroundFire(game, fireSprite, xLoc, yLoc) {
    this.fireAnimation = new Animation (fireSprite, 128, 128, 768, .15, 6, true, 1);
    this.game = game;
    this.ctx = game.ctx;
    this.x = xLoc;
    this.y = yLoc;
}

GroundFire.prototype.update = function() {

}

GroundFire.prototype.draw = function() {
    this.fireAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

function Rock(game, rockSprite, xLoc, yLoc) {
    this.rockAnimation = new Animation(rockSprite, 64, 64, 64, 1, 1, true, 1);
    this.game = game;
    this.ctx = game.ctx;
    this.x = xLoc;
    this.y = yLoc;
}

Rock.prototype.update = function(){

}

Rock.prototype.draw = function() {
    this.rockAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

function Health(game, healthSprite, xLoc, yLoc) {
    this.HealthAnimation = new Animation(healthSprite, 400, 600, 1000, 1, 1, true, .1);
    this.game = game;
    this.ctx = game.ctx;
    this.x = xLoc;
    this.y = yLoc;
}

Health.prototype.update = function(){

}

Health.prototype.draw = function() {
    this.moreX = 0;
    this.moreY = 0;
    for(var i = 0; i < this.game.player.hp; i++){
            this.HealthAnimation.drawFrame(this.game.clockTick, this.ctx, this.x + this.moreX, this.y + this.moreY);
            //this.moreX +=100;
            this.moreY +=60;
    }
}
//for stat based power ups
function PowerUp(game, powerUpSprite , theX, theY, health, frate, move, scale) { 
    this.x = theX;
    this.y = theY;
    this.game = game;
    this.ctx = game.ctx;
    this.PowerUpAnimation = new Animation(powerUpSprite, 64, 64, 64, 1, 1, true, 1);
    this.hitBox = {x: theX, y: theY, width: 64, height: 64};

    this.healthUpgrade = health;
    this.frateUpgrade = frate;
    this.speedUpgrade = move;
    this.scaleUp = scale;
  
}
PowerUp.prototype.update = function() {
    //colision detection
    if(this.hitBox.x < this.game.player.hitBox.x + this.game.player.hitBox.width &&
        this.hitBox.x + this.hitBox.width > this.game.player.hitBox.x && 
        this.hitBox.y < this.game.player.hitBox.y + this.game.player.hitBox.height &&
        this.hitBox.height + this.hitBox.y > this.game.player.hitBox.y) {

            this.game.player.health += this.healthUpgrade;
            this.game.player.frate *= this.frateUpgrade;
            this.game.player.speed += this.speedUpgrade;
        
            this.removeFromWorld = true;
            console.log("HIT");
        }
}
PowerUp.prototype.draw = function() {
    //if(!this.removeFromWorld) {
        this.PowerUpAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    //}
}
//for stat based power ups
function Ammo(game, powerUpSprite , theX, theY, bUp, bDown, bLeft, bRight, bNW, bSW, bSE, bNE, scale, name) { 
    this.x = theX;
    this.y = theY;
    this.game = game;
    this.ctx = game.ctx;
    this.PowerUpAnimation = new Animation(powerUpSprite, 64, 64, 64, 1, 1, true, 1);
    this.hitBox = {x: theX, y: theY, width: 64, height: 64};
    this.name = name;
    this.BulletUp = bUp;
    this.BulletDown = bDown;
    this.BulletLeft = bLeft;
    this.BulletRight = bRight;
    this.bNW = bNW;
    this.bSW = bSW;
    this.bSE = bSE;
    this.bNE = bNE;
    this.scaleUp = scale;
  
}
Ammo.prototype.update = function() {
    //colision detection
    if(this.hitBox.x < this.game.player.hitBox.x + this.game.player.hitBox.width &&
        this.hitBox.x + this.hitBox.width > this.game.player.hitBox.x && 
        this.hitBox.y < this.game.player.hitBox.y + this.game.player.hitBox.height &&
        this.hitBox.height + this.hitBox.y > this.game.player.hitBox.y) {
   
    
                this.game.player.bulletUp.sprite = this.BulletUp;
                this.game.player.bulletDown.sprite = this.BulletDown;
                this.game.player.bulletLeft.sprite = this.BulletLeft;
                this.game.player.bulletRight.sprite = this.BulletRight;
                console.log("AMMO WORK THIS WORKED");
            
            
            this.removeFromWorld = true;
       
           
           
            console.log("HIT");
        }
}
Ammo.prototype.draw = function() {
   
        this.PowerUpAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    
}
function startText(game) {
    this.game = game;
    this.ctx = game.ctx;
    this.time = Date.now();
    this.x = this.ctx.canvas.clientWidth /2 -200;
    this.y = this.ctx.canvas.clientHeight / 2 -100;
}

startText.prototype.update = function(){
    if(this.game.clickedTest == true){
        if( Date.now() - this.time > 500){
            this.game.ctx.font = "30px Comic Sans MS";
            this.game.ctx.fillStyle = "green";
            if(Date.now() - this.time > 1000){
                this.game.ctx.font = "30px Comic Sans MS";
                this.game.ctx.fillStyle = "blue";
                this.time = Date.now();
            }
            
        }

    }
    else{
        return;
    }
}

startText.prototype.draw = function() {
    if(this.game.clickedTest == true){
        this.game.ctx.fillText("CLICK HERE TO START!", this.x, this.y);
        this.game.ctx.fillStyle = "black";
        this.game.ctx.fillText("Controls: W, A, S, D to move    UP, DOWN, LEFT, RIGHT to shoot", this.x - 275 , this.y +300);
    }
}

function scoreText(game) {
    this.game = game;
    this.ctx = game.ctx;
    this.time = Date.now();
    this.x = this.ctx.canvas.clientWidth -220;
    this.y = 30;
}

scoreText.prototype.update = function(){
    if(this.game.clickedTest == true){
        if( Date.now() - this.time > 500){
            this.game.ctx.font = "30px Comic Sans MS";
            this.game.ctx.fillStyle = "green";
            if(Date.now() - this.time > 1000){
                this.game.ctx.font = "30px Comic Sans MS";
                this.game.ctx.fillStyle = "blue";
                this.time = Date.now();
            }
            
        }

    }
    else{
        return;
    }
}

scoreText.prototype.draw = function() {
        this.game.ctx.fillText("SCORE:  " + this.game.score, this.x, this.y);
}

//Queue All downloads
AM.queueDownload("./img/floor.png");
AM.queueDownload("./img/RaccoonWalk_Up.png");
AM.queueDownload("./img/RaccoonWalk_Down.png");
AM.queueDownload("./img/RaccoonWalk_Left.png");
AM.queueDownload("./img/RaccoonWalk_Right.png");
AM.queueDownload("./img/Bullet_Up.png");
AM.queueDownload("./img/Bullet_Down.png");
AM.queueDownload("./img/Bullet_Left.png");
AM.queueDownload("./img/Bullet_Right.png");
AM.queueDownload("./img/MeleeRobWalk_Up.png");
AM.queueDownload("./img/MeleeRobWalk_Down.png");
AM.queueDownload("./img/MeleeRobWalk_Left.png");
AM.queueDownload("./img/MeleeRobWalk_Right.png");
AM.queueDownload("./img/LaserRobWalk_Up.png");
AM.queueDownload("./img/LaserRobWalk_Down.png");
AM.queueDownload("./img/LaserRobWalk_Left.png");
AM.queueDownload("./img/LaserRobWalk_Right.png");
AM.queueDownload("./img/GroundFireSpritesheet.png");
AM.queueDownload("./img/GreyRock.png");
AM.queueDownload("./img/Rock_Two.png");
AM.queueDownload("./img/trashcan.png");
AM.queueDownload("./img/Turret_Up.png");
AM.queueDownload("./img/Turret_Down.png");
AM.queueDownload("./img/Turret_Left.png");
AM.queueDownload("./img/Turret_Right.png");
AM.queueDownload("./img/pebble.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();
    //AM.queueDownload("./img/Bullet_Up.png");
    //    AM.queueDownload("./img/Bullet_Down.png");
    //AM.queueDownload("./img/Bullet_Left.png");
    //AM.queueDownload("./img/Bullet_Right.png");
    
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/floor.png")));
    gameEngine.addEntity(new GroundFire(gameEngine, AM.getAsset("./img/GroundFireSpritesheet.png"), 700, 350));
    gameEngine.addEntity(new Rock(gameEngine, AM.getAsset("./img/GreyRock.png"), 500, 350));
    gameEngine.addEntity(new Rock(gameEngine, AM.getAsset("./img/Rock_Two.png"), 500, 550));
    
    
    gameEngine.setPlayer(new Raccoon(gameEngine, AM.getAsset("./img/RaccoonWalk_Up.png"), AM.getAsset("./img/RaccoonWalk_Down.png"), 
        AM.getAsset("./img/RaccoonWalk_Left.png"), AM.getAsset("./img/RaccoonWalk_Right.png")));

    gameEngine.addEntity(new MeleeRobot(gameEngine, AM.getAsset("./img/MeleeRobWalk_Up.png"), AM.getAsset("./img/MeleeRobWalk_Down.png"), 
        AM.getAsset("./img/MeleeRobWalk_Left.png"), AM.getAsset("./img/MeleeRobWalk_Right.png")));

    gameEngine.addEntity(new LaserRobot(gameEngine,AM.getAsset("./img/LaserRobWalk_Up.png"), AM.getAsset("./img/LaserRobWalk_Down.png"), 
        AM.getAsset("./img/LaserRobWalk_Left.png"), AM.getAsset("./img/LaserRobWalk_Right.png")));
    gameEngine.addEntity(new Health(gameEngine, AM.getAsset("./img/trashcan.png"), 10, 10));

    gameEngine.addEntity(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "up", 683, 600));
    
    gameEngine.addEntity(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "down", 683, -30));
    
    gameEngine.addEntity(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "left", 1200, 350));
    gameEngine.addEntity(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "right", 50, 350));
    gameEngine.addEntity(new PowerUp(gameEngine, AM.getAsset("./img/pebble.png"), 200, 200, 1,  1, 20, 1));
                    //function PowerUp(game, powerUpSprite , theX, theY, health, frate, move, scale)
    gameEngine.addEntity(new Ammo(gameEngine, AM.getAsset("./img/pebble.png"), 400, 400, "./img/Bullet_Down.png", "./img/Bullet_Down.png", "./img/Bullet_Down.png", 
    "./img/Bullet_Down.png", "./img/Bullet_Down.png", "./img/Bullet_Down.png", "./img/Bullet_Down.png", "./img/Bullet_Down.png", 2, "test"));            
    //function Ammo(game, powerUpSprite , theX, theY, bUp, bDown, bLeft, bRight, bNW, bSW, bSE, bNE, scale, name) { 
    gameEngine.addEntity(new startText(gameEngine));
    gameEngine.addEntity(new scoreText(gameEngine));
    console.log("All Done!");
});