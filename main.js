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
    if( this.game.keyPress["up"] ) {
        this.y -= this.game.clockTick * this.speed;
        this.direction = "up";
    }
    if( this.game.keyPress["down"]) {
        this.y += this.game.clockTick * this.speed;
        this.direction = "down";
    }
    if( this.game.keyPress["left"]) {
        this.x -= this.game.clockTick * this.speed;
        this.direction = "left";
    }
    if( this.game.keyPress["right"]) {
        this.x += this.game.clockTick * this.speed;
        this.direction = "right";
    }

    currentTime = Date.now() / 1000;
    if( this.game.keyPress["shootUp"]) {
        this.direction = "up";
        
        if(currentTime - this.lastShot >= .5) {
            this.lastShot = currentTime;
            this.game.addEntity(new Bullet(this.game, AM.getAsset("./img/Bullet_Up.png"), this.x+32, this.y, "up", .9));
        }  
         
    }else if( this.game.keyPress["shootDown"]) {
        this.direction = "down";
        
        if(currentTime - this.lastShot >= .5) {
            this.lastShot = currentTime;
            this.game.addEntity(new Bullet(this.game, AM.getAsset("./img/Bullet_Down.png"), this.x + 32, this.y+64, "down", .9));
        } 

    } else if(this.game.keyPress["shootLeft"]) {
        this.direction = "left";
        
        if(currentTime - this.lastShot >= .5) {
            this.lastShot = currentTime;
            this.game.addEntity(new Bullet(this.game, AM.getAsset("./img/Bullet_Left.png"), this.x, this.y+35, "left", .9));
        } 

    }else if(this.game.keyPress["shootRight"]) {
        this.direction = "right";
        
        if(currentTime - this.lastShot >= .5) {
            this.lastShot = currentTime;
            this.game.addEntity(new Bullet(this.game, AM.getAsset("./img/Bullet_Right.png"), this.x+50, this.y+35, "right", .9));
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
    this.speed = 150;
    this.hp = 4;
    this.x = 50;
    this.y = 300;
    
}

MeleeRobot.prototype.update = function() {
    if (this.x >=1241 &&  this.y < 650)  {
        this.y += this.game.clockTick * this.speed;
    } else if (this.y >= 650 && this.x > 75 ) {
        this.x -= this.game.clockTick * this.speed;
    } else if (this.x <=75 && this.y > 75) {
        this.y -= this.game.clockTick * this.speed;
    } else if (this.y <= 75 && this.x <= 1241) {
        this.x += this.game.clockTick * this.speed;
    }
}

MeleeRobot.prototype.draw = function() {
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

function LaserRobot(game, walkUp, walkDown, walkLeft, walkRight) {
    this.walkUp = new Animation(walkUp, 64, 64, 512, .15, 8, true, 2);
    this.walkDown = new Animation(walkDown, 64, 64, 512, .15, 8, true, 2);
    this.walkLeft = new Animation(walkLeft, 64, 64, 768, .15, 12, true, 2);
    this.walkRight = new Animation(walkRight, 64, 64, 768, .15, 12, true, 2);
    this.game = game;
    this.ctx = game.ctx;
    this.speed = 150;
    this.hp = 4;
    this.x = 50;
    this.y = 50;
    this.lastShot = 0;
}


LaserRobot.prototype.update = function() {
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

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/floor.png")));
    gameEngine.addEntity(new GroundFire(gameEngine, AM.getAsset("./img/GroundFireSpritesheet.png"), 700, 350));
    gameEngine.addEntity(new Rock(gameEngine, AM.getAsset("./img/GreyRock.png"), 500, 350));
    gameEngine.addEntity(new Raccoon(gameEngine, AM.getAsset("./img/RaccoonWalk_Up.png"), AM.getAsset("./img/RaccoonWalk_Down.png"), 
        AM.getAsset("./img/RaccoonWalk_Left.png"), AM.getAsset("./img/RaccoonWalk_Right.png")));
    gameEngine.addEntity(new MeleeRobot(gameEngine, AM.getAsset("./img/MeleeRobWalk_Up.png"), AM.getAsset("./img/MeleeRobWalk_Down.png"), 
        AM.getAsset("./img/MeleeRobWalk_Left.png"), AM.getAsset("./img/MeleeRobWalk_Right.png")));
    gameEngine.addEntity(new LaserRobot(gameEngine,AM.getAsset("./img/LaserRobWalk_Up.png"), AM.getAsset("./img/LaserRobWalk_Down.png"), 
        AM.getAsset("./img/LaserRobWalk_Left.png"), AM.getAsset("./img/LaserRobWalk_Right.png")));

    
    console.log("All Done!");
});