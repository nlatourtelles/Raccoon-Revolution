var AM = new AssetManager();
var levelManager = new levelManager();

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
    this.topHitBox = {x: 0, y: 0, width: 0, height: 0};
    this.bottomHitBox = {x: 0, y: 0, width: 0, height: 0};
    this.leftHitBox = {x: 0, y: 0, width: 0, height: 0};
    this.rightHitBox = {x: 0, y: 0, width: 0, height: 0};
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,this.x, this.y);
    this.ctx.beginPath();
    this.ctx.rect(this.topHitBox.x, this.topHitBox.y, this.topHitBox.width, this.topHitBox.height);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.rect(this.bottomHitBox.x, this.bottomHitBox.y, this.bottomHitBox.width, this.bottomHitBox.height);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.rect(this.leftHitBox.x, this.leftHitBox.y, this.leftHitBox.width, this.leftHitBox.height);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.rect(this.rightHitBox.x, this.rightHitBox.y, this.rightHitBox.width, this.rightHitBox.height);
    this.ctx.stroke();
    
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
    this.walkUp = new Animation(walkUp, 64, 64, 512, .15, 8, true, 1.5);
    this.walkDown = new Animation(walkDown, 64, 64, 768, .15, 12, true, 1.5);
    this.walkLeft = new Animation(walkLeft,64, 64, 512, .15, 8, true, 1.5);
    this.walkRight = new Animation(walkRight, 64, 64, 576, .15, 9, true, 1.5);
    this.game = game;
    this.ctx =  game.ctx;
    this.speed = 150;
    this.hp = 40;
    this.x = 410;
    this.y = 480;
    this.direction = "right";
    this.lastShot = 0;
    this.invincible = false;
    this.invincibleTIme = 0;
    this.hitBox = {x: this.x+33, y: this.y+13, width: 48, height: 64};
    this.bulletUp = {sprite: "./img/Bullet_Up.png", direction: "up", scale: .65};
    this.bulletDown = {sprite: "./img/Bullet_Down.png", direction: "down", scale: .65};
    this.bulletRight = {sprite: "./img/Bullet_Right.png", direction: "right", scale: .65};
    this.bulletLeft =  {sprite: "./img/Bullet_Left.png", direction: "left", scale: .65};
    this.removeFromWorld = false;
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

    this.ctx.beginPath();
    this.ctx.rect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
    this.ctx.stroke();
    // this.ctx.beginPath();
    // this.ctx.arc(this.hitBox.x, this.hitBox.y, 40, 0, 1.5*Math.PI);
    // this.ctx.stroke();
    // this.walkRight.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

Raccoon.prototype.update = function () {
    if(this.game.started == false){
        return;
    }

    topBound = false;
    botBound = false;
    leftBound = false;
    rightBound = false;
    bg = this.game.background[0];
    if(this.hitBox.x < bg.topHitBox.x + bg.topHitBox.width &&
        this.hitBox.x + this.hitBox.width > bg.topHitBox.x && 
        this.hitBox.y < bg.topHitBox.y + bg.topHitBox.height &&
        this.hitBox.height + this.hitBox.y > bg.topHitBox.y) {
            topBound = true; 
    }

    if(this.hitBox.x < bg.bottomHitBox.x + bg.bottomHitBox.width &&
        this.hitBox.x + this.hitBox.width > bg.bottomHitBox.x && 
        this.hitBox.y < bg.bottomHitBox.y + bg.bottomHitBox.height &&
        this.hitBox.height + this.hitBox.y > bg.bottomHitBox.y) {
            botBound = true; 
    }

    if(this.hitBox.x < bg.leftHitBox.x + bg.leftHitBox.width &&
        this.hitBox.x + this.hitBox.width > bg.leftHitBox.x && 
        this.hitBox.y < bg.leftHitBox.y + bg.leftHitBox.height &&
        this.hitBox.height + this.hitBox.y > bg.leftHitBox.y) {
            leftBound = true; 
    }

    if(this.hitBox.x < bg.rightHitBox.x + bg.rightHitBox.width &&
        this.hitBox.x + this.hitBox.width > bg.rightHitBox.x && 
        this.hitBox.y < bg.rightHitBox.y + bg.rightHitBox.height &&
        this.hitBox.height + this.hitBox.y > bg.rightHitBox.y) {
            rightBound = true; 
    }

    for(i = 0; i < this.game.environment.length; i++) {
        envir = this.game.environment[i];
        if(this.hitBox.x < envir.hitBox.x + envir.hitBox.width &&
            this.hitBox.x + this.hitBox.width > envir.hitBox.x && 
            this.hitBox.y < envir.hitBox.y + envir.hitBox.height &&
            this.hitBox.height + this.hitBox.y > envir.hitBox.y) {
                if(envir.dmg) {
                    this.hp -= 1;
                }
        }
    }

    if( this.game.keyPress["up"] ) {
        if(!topBound) {
            this.y -= this.game.clockTick * this.speed;
        }
        
        this.direction = "up";
        this.hitBox.y = this.y+13;
    }
    if( this.game.keyPress["down"]) {
        if(!botBound) {
            this.y += this.game.clockTick * this.speed;
        }

        this.direction = "down";
        this.hitBox.y = this.y+13;
    }
    if( this.game.keyPress["left"]) {
        if(!leftBound) {
            this.x -= this.game.clockTick * this.speed;
        }

        this.direction = "left";
        this.hitBox.x = this.x+27;
    }
    if( this.game.keyPress["right"]) {
        if(!rightBound) {
            this.x += this.game.clockTick * this.speed;
        }
        
        this.direction = "right";
        this.hitBox.x = this.x+27;
    }

    currentTime = Date.now() / this.frate;
    if( this.game.keyPress["shootUp"]) {
        this.direction = "up";
        
        if(currentTime - this.lastShot >= .5) {
            this.lastShot = currentTime;
   
            this.game.addPlayerBullet(new Bullet(this.game, AM.getAsset(this.bulletUp.sprite), this.x+32, this.y, this.bulletUp.direction, this.bulletUp.scale));
        }  
         
    }else if( this.game.keyPress["shootDown"]) {
        this.direction = "down";
        
        if(currentTime - this.lastShot >= .5) {
            this.lastShot = currentTime;
            this.game.addPlayerBullet(new Bullet(this.game, AM.getAsset(this.bulletDown.sprite), this.x + 32, this.y+64, this.bulletDown.direction, this.bulletDown.scale));
        } 

    } else if(this.game.keyPress["shootLeft"]) {
        this.direction = "left";
        
        if(currentTime - this.lastShot >= .5) {
            this.lastShot = currentTime;
            this.game.addPlayerBullet(new Bullet(this.game, AM.getAsset(this.bulletLeft.sprite), this.x, this.y+35, this.bulletLeft.direction, this.bulletLeft.scale));
        } 

    }else if(this.game.keyPress["shootRight"]) {
        this.direction = "right";
        
        if(currentTime - this.lastShot >= .5) {
            this.lastShot = currentTime;
            this.game.addPlayerBullet(new Bullet(this.game, AM.getAsset(this.bulletRight.sprite), this.x+50, this.y+35, this.bulletRight.direction, this.bulletRight.scale));
        } 

    }

    if(Date.now() - this.time > 1000){
        this.invincible = false;
    }

    for( i = 0; i < this.game.enemyProjectiles.length; i++) {
        proj = this.game.enemyProjectiles[i];
        if(this.hitBox.x < this.game.enemyProjectiles[i].hitBox.x + this.game.enemyProjectiles[i].hitBox.width &&
            this.hitBox.x + this.hitBox.width > this.game.enemyProjectiles[i].hitBox.x && 
            this.hitBox.y < this.game.enemyProjectiles[i].y + this.game.enemyProjectiles[i].hitBox.height &&
            this.hitBox.height + this.hitBox.y > this.game.enemyProjectiles[i].hitBox.y) {
                console.log("Ive been hit!");
               
                if(this.invincible == false){
                    this.hp -= 1;
                    this.time = Date.now();
                }
                this.invincible = true;
                proj.removeFromWorld = true;
            }
    }

    for( i = 0; i < this.game.enemies.length; i++) {
        enemy = this.game.enemies[i];
        if(this.hitBox.x < enemy.hitBox.x + enemy.hitBox.width &&
            this.hitBox.x + this.hitBox.width > enemy.hitBox.x && 
            this.hitBox.y < enemy.y + enemy.hitBox.height &&
            this.hitBox.height + this.hitBox.y > enemy.hitBox.y) {
                
                if(this.invincible == false){
                    this.hp -= 1;
                    this.time = Date.now();
                }
                this.invincible = true;
        }
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
    this.removeFromWorld = false;
    
    if(direction === "up") {
        this.hitBox = {x: this.x+12, y: this.y, width: 18, height: 30};
    } else if(direction === "down") {
        this.hitBox = {x: this.x+12, y: this.y+10, width: 18, height: 30};
    } else if(direction === "left") {
        this.hitBox = {x: this.x, y: this.y+13, width: 30, height: 18};
    } else if(direction === "right") {
        this.hitBox = {x: this.x+12, y: this.y+13, width: 30, height: 18};
    }
    

}

Bullet.prototype.update = function() {
    if(this.direction === "up") {
        this.y -= this.game.clockTick * this.speed;
        this.hitBox.y = this.y;
    } else if( this.direction === "down") {
        this.y += this.game.clockTick * this.speed;
        this.hitBox.y = this.y + 10;
    } else if( this.direction === "left") {
        this.x -= this.game.clockTick * this.speed;
        this.hitBox.x = this.x;
    } else if( this.direction === "right") {
        this.x += this.game.clockTick * this.speed;
        this.hitBox.x = this.x + 12;
    }

    if(this.hitBox.x < bg.topHitBox.x + bg.topHitBox.width &&
        this.hitBox.x + this.hitBox.width > bg.topHitBox.x && 
        this.hitBox.y < bg.topHitBox.y + bg.topHitBox.height &&
        this.hitBox.height + this.hitBox.y > bg.topHitBox.y) {
            this.removeFromWorld = true; 
    }

    if(this.hitBox.x < bg.bottomHitBox.x + bg.bottomHitBox.width &&
        this.hitBox.x + this.hitBox.width > bg.bottomHitBox.x && 
        this.hitBox.y < bg.bottomHitBox.y + bg.bottomHitBox.height &&
        this.hitBox.height + this.hitBox.y > bg.bottomHitBox.y) {
            this.removeFromWorld = true; 
    }

    if(this.hitBox.x < bg.leftHitBox.x + bg.leftHitBox.width &&
        this.hitBox.x + this.hitBox.width > bg.leftHitBox.x && 
        this.hitBox.y < bg.leftHitBox.y + bg.leftHitBox.height &&
        this.hitBox.height + this.hitBox.y > bg.leftHitBox.y) {
            this.removeFromWorld = true; 
    }

    if(this.hitBox.x < bg.rightHitBox.x + bg.rightHitBox.width &&
        this.hitBox.x + this.hitBox.width > bg.rightHitBox.x && 
        this.hitBox.y < bg.rightHitBox.y + bg.rightHitBox.height &&
        this.hitBox.height + this.hitBox.y > bg.rightHitBox.y) {
            this.removeFromWorld = true; 
    }
}

Bullet.prototype.draw = function() {
    this.bullet.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    this.ctx.beginPath();
    this.ctx.rect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
    this.ctx.stroke();
}

function MeleeRobot(game, walkUp, walkDown, walkLeft, walkRight,xloc,yloc) {
    this.walkUp = new Animation(walkUp, 64, 64, 512, .15, 8, true, 1.5);
    this.walkDown = new Animation(walkDown, 64, 64, 512, .15, 8, true, 1.5);
    this.walkLeft = new Animation(walkLeft, 64, 64, 768, .15, 12, true, 1.5);
    this.walkRight = new Animation(walkRight, 64, 64, 768, .15, 12, true, 1.5);
    this.game = game;
    this.ctx = game.ctx;
    this.speed = 100;
    this.hp = 4;
    this.x = xloc;
    this.y = yloc;
    this.direction = "right";
    this.removeFromWorld = false;
    this.hitBox = {x: this.x+50, y: this.y+20, width: 20, height: 77};
    this.upDownHitbox = {x: this.x+25, y: this.y+16, width: 42, height: 72};
    this.leftRightHitbox = {x: this.x+40, y: this.y+10, width: 20, height: 77};

    
}

MeleeRobot.prototype.update = function() {
    if(this.game.started == false){
        return;
    }

    topBound = false;
    botBound = false;
    leftBound = false;
    rightBound = false;
    bg = this.game.background[0];
    if(this.hitBox.x < bg.topHitBox.x + bg.topHitBox.width &&
        this.hitBox.x + this.hitBox.width > bg.topHitBox.x && 
        this.hitBox.y < bg.topHitBox.y + bg.topHitBox.height &&
        this.hitBox.height + this.hitBox.y > bg.topHitBox.y) {
            topBound = true; 
    }

    if(this.hitBox.x < bg.bottomHitBox.x + bg.bottomHitBox.width &&
        this.hitBox.x + this.hitBox.width > bg.bottomHitBox.x && 
        this.hitBox.y < bg.bottomHitBox.y + bg.bottomHitBox.height &&
        this.hitBox.height + this.hitBox.y > bg.bottomHitBox.y) {
            botBound = true; 
    }

    if(this.hitBox.x < bg.leftHitBox.x + bg.leftHitBox.width &&
        this.hitBox.x + this.hitBox.width > bg.leftHitBox.x && 
        this.hitBox.y < bg.leftHitBox.y + bg.leftHitBox.height &&
        this.hitBox.height + this.hitBox.y > bg.leftHitBox.y) {
            leftBound = true; 
    }

    if(this.hitBox.x < bg.rightHitBox.x + bg.rightHitBox.width &&
        this.hitBox.x + this.hitBox.width > bg.rightHitBox.x && 
        this.hitBox.y < bg.rightHitBox.y + bg.rightHitBox.height &&
        this.hitBox.height + this.hitBox.y > bg.rightHitBox.y) {
            rightBound = true; 
    }

    

    if(this.y < this.game.player.y) {
        if(!botBound) {
            this.y += this.game.clockTick * this.speed;
        }
        
        this.direction = "down"
    }
    if(this.y > this.game.player.y) {
        if(!topBound) {
            this.y -= this.game.clockTick * this.speed;
        }
        
        this.direction = "up";
    }
    if(this.x < this.game.player.x) {
        if(!rightBound) {
            this.x += this.game.clockTick * this.speed;
        }
        
        this.direction = "right";
    }
    if (this.x > this.game.player.x) {
        if(!leftBound) {
            this.x -= this.game.clockTick * this.speed;
        }
        
        this.direction = "left";
    }
    // console.log(this.x - this.game.player.x);

    xDiff = Math.abs(this.x - this.game.player.x);
    if (xDiff < 10) {
        if(this.y < this.game.player.y) {
            this.direction = "down"
        }
        if(this.y > this.game.player.y) {
            this.direction = "up";
        }
    }

    if(this.direction === "up" || this.direction === "down") {
        this.hitBox = this.upDownHitbox;
        this.hitBox.x = this.x +25;
        this.hitBox.y = this.y +16;
    } else {
        this.hitBox = this.leftRightHitbox;
        this.hitBox.x = this.x+40;
        this.hitBox.y = this.y+10;
    }

    for(i = 0; i < this.game.playerBullet.length; i++) {
        bullet = this.game.playerBullet[i];
        if(this.hitBox.x < bullet.hitBox.x + bullet.hitBox.width &&
            this.hitBox.x + this.hitBox.width > bullet.hitBox.x && 
            this.hitBox.y < bullet.y + bullet.hitBox.height &&
            this.hitBox.height + this.hitBox.y > bullet.hitBox.y) {
                bullet.removeFromWorld = true;
                this.hp -= 1;
        }
    }

    if(this.hp <= 0) {
        this.removeFromWorld = true;
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
    this.ctx.beginPath();
    this.ctx.rect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
    this.ctx.stroke();
}

function LaserRobot(game, walkUp, walkDown, walkLeft, walkRight, direction, xloc, yloc) {

    this.walkUp = new Animation(walkUp, 64, 64, 512, .15, 8, true, 1.5);
    this.walkDown = new Animation(walkDown, 64, 64, 512, .15, 8, true, 1.5);
    this.walkLeft = new Animation(walkLeft, 64, 64, 768, .15, 12, true, 1.5);
    this.walkRight = new Animation(walkRight, 64, 64, 768, .15, 12, true, 1.5);
    this.game = game;
    this.ctx = game.ctx;
    this.speed = 80;
    this.hp = 4;
    this.x = xloc;
    this.y = yloc;
    this.lastShot = 0;
    this.direction = direction;
    
    this.hitBox = {x: this.x+50, y: this.y+20, width: 20, height: 77};
    this.upDownHitbox = {x: this.x+25, y: this.y+16, width: 42, height: 72};
    this.leftRightHitbox = {x: this.x+40, y: this.y+10, width: 20, height: 77};
    this.removeFromWorld = false;
}


LaserRobot.prototype.update = function() {
    if(this.game.started == false){
        return;
    }
    currentTime = Date.now() / 1000;
    if(this.y < this.game.player.y) {
        this.y += this.game.clockTick * this.speed;
        if(currentTime - this.lastShot >= 1 && this.direction === "down") {
            this.game.addEnemyProj(new Laser(this.game, AM.getAsset("./img/LaserUpDown.png"), this.x+25, this.y+35, "down", .65));
            this.lastShot = currentTime;
        }
        this.direction = "down";
 
    }
    if(this.y > this.game.player.y) {
        this.y -= this.game.clockTick * this.speed;
        if(currentTime - this.lastShot >= 1 && this.direction === "up") {
            this.game.addEnemyProj(new Laser(this.game, AM.getAsset("./img/LaserUpDown.png"), this.x+25, this.y+35, "up", .65));
            this.lastShot = currentTime;
        }
        this.direction = "up";
    }
    if(this.x < this.game.player.x) {
        this.x += this.game.clockTick * this.speed;
        if(currentTime - this.lastShot >= 1) {
            this.game.addEnemyProj(new Laser(this.game, AM.getAsset("./img/LaserLeftRight.png"), this.x+50, this.y+35, "right", .65));
            this.lastShot = currentTime;
        }
        this.direction = "right";
    }
    if (this.x > this.game.player.x) {
        console.log("shoot ma lazar left");
        console.log("my direction is " + this.direction);
        this.x -= this.game.clockTick * this.speed;
        if(currentTime - this.lastShot >= 1) {
            this.game.addEnemyProj(new Laser(this.game, AM.getAsset("./img/LaserLeftRight.png"), this.x+25, this.y+35, "left", .65));
            this.lastShot = currentTime;
        }
        this.direction = "left";
    }
    // console.log(this.x - this.game.player.x);

    xDiff = Math.abs(this.x - this.game.player.x);
    if (xDiff < 10) {
        if(this.y < this.game.player.y) {
            this.direction = "down"
            // if(currentTime - this.lastShot >= 1 && this.direction === "down") {
            //     this.game.addEnemyProj(new Laser(this.game, AM.getAsset("./img/LaserUpDown.png"), this.x+50, this.y+35, "down", .9));
            //     this.lastShot = currentTime;
            //}
        }
        if(this.y > this.game.player.y) {
            this.direction = "up";
            // if(currentTime - this.lastShot >= 1 && this.direction === "up") {
            //     this.game.addEnemyProj(new Laser(this.game, AM.getAsset("./img/LaserUpDown.png"), this.x+50, this.y+35, "up", .9));
            //     this.lastShot = currentTime;
            //}
        }
  
    }

    if(this.direction === "up" || this.direction === "down") {
        this.hitBox = this.upDownHitbox;
        this.hitBox.x = this.x +25;
        this.hitBox.y = this.y +16;
    } else {
        this.hitBox = this.leftRightHitbox;
        this.hitBox.x = this.x+40;
        this.hitBox.y = this.y+10;
    }



    for(i = 0; i < this.game.playerBullet.length; i++) {
        bullet = this.game.playerBullet[i];
        if(this.hitBox.x < bullet.hitBox.x + bullet.hitBox.width &&
            this.hitBox.x + this.hitBox.width > bullet.hitBox.x && 
            this.hitBox.y < bullet.y + bullet.hitBox.height &&
            this.hitBox.height + this.hitBox.y > bullet.hitBox.y) {
                bullet.removeFromWorld = true;
                this.hp -= 1;
        }
    }

    if(this.hp <= 0) {
        this.removeFromWorld = true;
    }


}

LaserRobot.prototype.draw = function() {
    
    if(this.direction === "up") {
        this.walkUp.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
  
    } else if(this.direction === "down") {
        this.walkDown.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else if (this.direction === "left") {
        this.walkLeft.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else if (this.direction === "right") {
        this.walkRight.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }

    this.ctx.beginPath();
    this.ctx.rect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
    this.ctx.stroke();
}

function Laser(game, spriteSheet, xLoc, yLoc, direction, scale) {
    this.game = game;
    this.ctx = game.ctx;
    this.scale = scale;
    this.laserAnim = new Animation(spriteSheet, 64, 64, 192, 1, 3, true, scale);
    this.direction = direction;
    this.x = xLoc;
    this.y = yLoc;
    this.speed = 250;
    this.hitBox = {x: this.x, y: this.y, width: 40, height: 32};
    this.removeFromWorld = false;

    if(direction === "up") {
        this.hitBox = {x: this.x+17, y: this.y, width: 9, height: 25};
    } else if(direction === "down") {
        this.hitBox = {x: this.x+17, y: this.y, width: 9, height: 25};
    } else if(direction === "left") {
        this.hitBox = {x: this.x, y: this.y+17, width: 25, height: 9};
    } else if(direction === "right") {
        this.hitBox = {x: this.x, y: this.y+17, width: 25, height: 9};
    }
}

Laser.prototype.update = function(){
    if(this.direction === "up") {
        this.y -= this.game.clockTick * this.speed;
        this.hitBox.y = this.y+9;
    } else if( this.direction === "down") {
        this.y += this.game.clockTick * this.speed;
        this.hitBox.y = this.y+9;
    } else if( this.direction === "left") {
        this.x -= this.game.clockTick * this.speed;
        this.hitBox.x = this.x+9;
    } else if( this.direction === "right") {
        this.x += this.game.clockTick * this.speed;
        this.hitBox.x = this.x+9;
    }

    if(this.hitBox.x < bg.topHitBox.x + bg.topHitBox.width &&
        this.hitBox.x + this.hitBox.width > bg.topHitBox.x && 
        this.hitBox.y < bg.topHitBox.y + bg.topHitBox.height &&
        this.hitBox.height + this.hitBox.y > bg.topHitBox.y) {
            this.removeFromWorld = true; 
    }

    if(this.hitBox.x < bg.bottomHitBox.x + bg.bottomHitBox.width &&
        this.hitBox.x + this.hitBox.width > bg.bottomHitBox.x && 
        this.hitBox.y < bg.bottomHitBox.y + bg.bottomHitBox.height &&
        this.hitBox.height + this.hitBox.y > bg.bottomHitBox.y) {
            this.removeFromWorld = true; 
    }

    if(this.hitBox.x < bg.leftHitBox.x + bg.leftHitBox.width &&
        this.hitBox.x + this.hitBox.width > bg.leftHitBox.x && 
        this.hitBox.y < bg.leftHitBox.y + bg.leftHitBox.height &&
        this.hitBox.height + this.hitBox.y > bg.leftHitBox.y) {
            this.removeFromWorld = true; 
    }

    if(this.hitBox.x < bg.rightHitBox.x + bg.rightHitBox.width &&
        this.hitBox.x + this.hitBox.width > bg.rightHitBox.x && 
        this.hitBox.y < bg.rightHitBox.y + bg.rightHitBox.height &&
        this.hitBox.height + this.hitBox.y > bg.rightHitBox.y) {
            this.removeFromWorld = true; 
    }
}

Laser.prototype.draw = function(){
    this.laserAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    this.ctx.beginPath();
    this.ctx.rect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
    this.ctx.stroke();
}

function Turret(game, lookUp, lookDown, lookLeft, lookRight, direction, xLoc, yLoc) {
    this.upAnim = new Animation(lookUp, 64, 64, 128, .15, 2, true, 1.5);
    this.downAnim = new Animation(lookDown, 64, 64, 192, .15, 3, true, 1.5);
    this.leftAnim = new Animation(lookLeft, 64, 64, 192, .15, 3, true, 1.5);
    this.rightAnim = new Animation(lookRight, 64, 64, 192, .15, 3, true, 1.5);
    this.direction = direction;
    this.x = xLoc;
    this.y = yLoc;
    this.game = game;
    this.hp = 4;
    this.lastShot = 0;
    this.ctx = game.ctx;
    this.removeFromWorld = false;
    if(this.direction === "up" || this.direction === "down"){
        this.hitBox = {x: this.x+30, y: this.y+25, width: 40, height: 70};
    } else if(this.direction === "left") {
        this.hitBox = {x: this.x+25, y: this.y+15, width: 50, height: 70};
    } else {
        this.hitBox = {x: this.x+25, y: this.y+15, width: 50, height: 70};
    }
    
}

Turret.prototype.update = function() {
    if(this.game.started == false){
        return;
    }
    currentTime = Date.now() / 1000;
    if(currentTime - this.lastShot >=5) {
        this.lastShot = currentTime;
        if(this.direction === "up") {
            this.game.addEnemyProj(new Laser(this.game, AM.getAsset("./img/LaserUpDown.png"), this.x+28, this.y, this.direction, .65));
        } else if(this.direction === "down") {
            this.game.addEnemyProj(new Laser(this.game, AM.getAsset("./img/LaserUpDown.png"), this.x+28, this.y+72, this.direction, .65));
        } else if(this.direction === "left") {
            this.game.addEnemyProj(new Laser(this.game, AM.getAsset("./img/LaserLeftRight.png"), this.x+15, this.y+5, this.direction, .65));
        } else if(this.direction === "right") {
            this.game.addEnemyProj(new Laser(this.game, AM.getAsset("./img/LaserLeftRight.png"), this.x+45, this.y+5, this.direction, .65));
        }
    }

    for(i = 0; i < this.game.playerBullet.length; i++) {
        bullet = this.game.playerBullet[i];
        if(this.hitBox.x < bullet.hitBox.x + bullet.hitBox.width &&
            this.hitBox.x + this.hitBox.width > bullet.hitBox.x && 
            this.hitBox.y < bullet.y + bullet.hitBox.height &&
            this.hitBox.height + this.hitBox.y > bullet.hitBox.y) {
                bullet.removeFromWorld = true;
                this.hp -= 1;
        }
    }

    if(this.hp <= 0) {
        this.removeFromWorld = true;
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

    this.ctx.beginPath();
    this.ctx.rect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
    this.ctx.stroke();
    
}

function Drone(game, sprite, xLoc, yLoc) {
    this.droneAnim = new Animation(sprite, 64, 64, 512, 1, 8, true, 1);
    this.ctx = game.ctx;
    this.game = game;
    this.x = xLoc;
    this.y = yLoc;
    this.hp = 4;
    this.hitBox = {x: this.x, y: this.y, width: 64, height: 64};
    this.removeFromWorld = false;
}

Drone.prototype.update = function() {

    // if(this.game.started == false){
    //     return;
    // }

    if(this.y < this.game.player.y) {
            this.y += this.game.clockTick * this.speed;
    }
    if(this.y > this.game.player.y) {
            this.y -= this.game.clockTick * this.speed;
    }
    if(this.x < this.game.player.x) {
            this.x += this.game.clockTick * this.speed;
    }
    if (this.x > this.game.player.x) {
            this.x -= this.game.clockTick * this.speed;
    }

    for(i = 0; i < this.game.playerBullet.length; i++) {
        bullet = this.game.playerBullet[i];
        if(this.hitBox.x < bullet.hitBox.x + bullet.hitBox.width &&
            this.hitBox.x + this.hitBox.width > bullet.hitBox.x && 
            this.hitBox.y < bullet.y + bullet.hitBox.height &&
            this.hitBox.height + this.hitBox.y > bullet.hitBox.y) {
                bullet.removeFromWorld = true;
                this.hp -= 1;
        }
    }

    if(this.hp <= 0) {
        this.removeFromWorld = true;
    }

}

Drone.prototype.draw = function() {
    this.droneAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    // this.ctx.beginPath();
    // this.ctx.rect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
    // this.ctx.stroke();
}

function GroundFire(game, fireSprite, xLoc, yLoc) {
    this.fireAnimation = new Animation (fireSprite, 128, 128, 768, .15, 6, true, .75);
    this.game = game;
    this.ctx = game.ctx;
    this.x = xLoc;
    this.y = yLoc;
    this.hitBox = {x: this.x+24, y: this.y+20, width: 50, height: 70};
    this.dmg = true;
}

GroundFire.prototype.update = function() {

}

GroundFire.prototype.draw = function() {
    this.fireAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    this.ctx.beginPath();
    this.ctx.rect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
    this.ctx.stroke();
}

function Rock(game, rockSprite, xLoc, yLoc) {
    this.rockAnimation = new Animation(rockSprite, 64, 64, 64, 1, 1, true, 1);
    this.game = game;
    this.ctx = game.ctx;
    this.x = xLoc;
    this.y = yLoc;
    this.hitBox = {x: this.x+5, y: this.y+5, width: 55, height: 48};
    this.dmg = false;
}

Rock.prototype.update = function(){

}

Rock.prototype.draw = function() {
    this.rockAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    this.ctx.beginPath();
    this.ctx.rect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
    this.ctx.stroke();
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
            this.game.ctx.fillStyle = "red";
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
        this.game.ctx.font = "25px Comic Sans MS";
        this.game.ctx.fillStyle = "black";
        this.game.ctx.fillText("Controls: W, A, S, D to move    UP, DOWN, LEFT, RIGHT to shoot", this.x - 190 , this.y +300);
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
            this.game.ctx.fillStyle = "red";
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






levelManager.init();
