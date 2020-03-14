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
    this.finalBoss = false;
    this.finalBossLeft = {x: 20, y: 150, width: 380, height: 64};
    this.finalBossRight = {x: 490, y: 150, width: 380, height: 64};
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,this.x, this.y);
    // this.ctx.beginPath();
    // this.ctx.rect(this.topHitBox.x, this.topHitBox.y, this.topHitBox.width, this.topHitBox.height);
    // this.ctx.stroke();
    // this.ctx.beginPath();
    // this.ctx.rect(this.bottomHitBox.x, this.bottomHitBox.y, this.bottomHitBox.width, this.bottomHitBox.height);
    // this.ctx.stroke();
    // this.ctx.beginPath();
    // this.ctx.rect(this.leftHitBox.x, this.leftHitBox.y, this.leftHitBox.width, this.leftHitBox.height);
    // this.ctx.stroke();
    // this.ctx.beginPath();
    // this.ctx.rect(this.rightHitBox.x, this.rightHitBox.y, this.rightHitBox.width, this.rightHitBox.height);
    // this.ctx.stroke();
    
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
    this.hp = 5;
    this.x = 410;
    this.y = 480;
    this.direction = "right";
    this.lastDirection = "right";
    this.lastShot = 0;
    this.invincible = false;
    this.invincibleTIme = 0;
    this.hitBox = {x: this.x+33, y: this.y+13, width: 48, height: 64};
    this.bulletUp = {sprite: "./img/Bullet_Up.png", direction: "up", scale: .65};
    this.bulletDown = {sprite: "./img/Bullet_Down.png", direction: "down", scale: .65};
    this.bulletRight = {sprite: "./img/Bullet_Right.png", direction: "right", scale: .65};
    this.bulletLeft =  {sprite: "./img/Bullet_Left.png", direction: "left", scale: .65};
    this.bulletNW = {sprite: "none", direction: "NW", scale: .65};
    this.bulletSW = {sprite: "none", direction: "SW", scale: .65};
    this.bulletNE = {sprite: "none", direction: "NE", scale: .65};
    this.bulletSE = {sprite: "none", direction: "SE", scale: .65};
    this.removeFromWorld = false;
    this.knockback = false;
    this.frate = 1000;
    this.AmmoType = "Starter";
    this.AmmoScale = .65;
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

    // this.ctx.beginPath();
    // this.ctx.rect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
    // this.ctx.stroke();
}
Raccoon.prototype.checkEnivormental = function () {
         
            i = 0;
            while(i < this.game.environment.length && !col) {
                envir = this.game.environment[i];
                if(this.hitBox.x < envir.hitBox.x + envir.hitBox.width &&
                this.hitBox.x + this.hitBox.width > envir.hitBox.x && 
                this.hitBox.y < envir.hitBox.y + envir.hitBox.height &&
                this.hitBox.height + this.hitBox.y > envir.hitBox.y) {
                    if(this.invincible == false){
                        if(envir.dmg) {
                            this.hp -= 1;
                            this.time = Date.now();
                        }
               
                    }
                
                //this.knockback = true;
                    if(envir.dmg) {
                        this.invincible = true;
                    } else {
                        this.knockback = true;
                    }
                    //this.lastDirection = this.direction;
                  
                   // this.direction = "none";
                
                }
                i++;
            }
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

    if(bg.finalBoss) {
        if(this.hitBox.x < bg.finalBossLeft.x + bg.finalBossLeft.width &&
            this.hitBox.x + this.hitBox.width > bg.finalBossLeft.x && 
            this.hitBox.y < bg.finalBossLeft.y + bg.finalBossLeft.height &&
            this.hitBox.height + this.hitBox.y > bg.finalBossLeft.y) {
                topBound = true; 
        }

        if(this.hitBox.x < bg.finalBossRight.x + bg.finalBossRight.width &&
            this.hitBox.x + this.hitBox.width > bg.finalBossRight.x && 
            this.hitBox.y < bg.finalBossRight.y + bg.finalBossRight.height &&
            this.hitBox.height + this.hitBox.y > bg.finalBossRight.y) {
                topBound = true; 
        }
    }

    if( this.game.keyPress["up"] ) {
        if(!topBound) {
            col = false;
            i = 0;
            while(i < this.game.environment.length && !col) {
                envir = this.game.environment[i];
                if(this.hitBox.x < envir.hitBox.x + envir.hitBox.width &&
                this.hitBox.x + this.hitBox.width > envir.hitBox.x && 
                this.hitBox.y < envir.hitBox.y + envir.hitBox.height &&
                this.hitBox.height + this.hitBox.y > envir.hitBox.y) {
                    if(this.invincible == false){
                        if(envir.dmg) {
                            this.hp -= 1;
                            this.time = Date.now();
                        }
               
                    }
                
                //this.knockback = true;
                    if(envir.dmg) {
                        this.invincible = true;
                    } else {
                        col = true;
                    }
                    //this.lastDirection = this.direction;
                   
                   // this.direction = "none";
                
                }
                i++;
            }
            if(!col) {
                this.y -= this.game.clockTick * this.speed;
                this.direction = "up";
                this.hitBox.y = this.y+13;
            }else {
                console.log("why cant i  u");
                this.direction = "up";
                this.y += this.game.clockTick * this.speed;
                this.hitBox.y = this.y+13;
            }
            
            
        }
        
        // this.direction = "up";
        // this.hitBox.y = this.y+13;
    }
   
    if( this.game.keyPress["down"]) {
        if(!botBound) {
            col = false;
            i = 0;
            while(i < this.game.environment.length && !col) {
                envir = this.game.environment[i];
                if(this.hitBox.x < envir.hitBox.x + envir.hitBox.width &&
                this.hitBox.x + this.hitBox.width > envir.hitBox.x && 
                this.hitBox.y < envir.hitBox.y + envir.hitBox.height &&
                this.hitBox.height + this.hitBox.y > envir.hitBox.y) {
                    if(this.invincible == false){
                        if(envir.dmg) {
                            this.hp -= 1;
                            this.time = Date.now();
                        }
               
                    }
                
                //this.knockback = true;
                    if(envir.dmg) {
                        this.invincible = true;
                    } else {
                        col = true;
                    }
                    //this.lastDirection = this.direction;
                  
                   // this.direction = "none";
                
                }
                i++;
            }
            if(!col) {
                this.y += this.game.clockTick * this.speed;
                this.direction = "down";
                this.hitBox.y = this.y+13;
            }  else {
                console.log("why cant i  d");
                this.direction = "down";
                this.y -= this.game.clockTick * this.speed;
                this.hitBox.y = this.y+13;
            }
            
        }

        // this.direction = "down";
        // this.hitBox.y = this.y+13;
    }
    if( this.game.keyPress["left"]) {
        if(!leftBound) {
            col = false;
            i = 0;
            while(i < this.game.environment.length && !col) {
                envir = this.game.environment[i];
                if(this.hitBox.x < envir.hitBox.x + envir.hitBox.width &&
                this.hitBox.x + this.hitBox.width > envir.hitBox.x && 
                this.hitBox.y < envir.hitBox.y + envir.hitBox.height &&
                this.hitBox.height + this.hitBox.y > envir.hitBox.y) {
                    if(this.invincible == false){
                        if(envir.dmg) {
                            this.hp -= 1;
                            this.time = Date.now();
                        }
               
                    }
                
                //this.knockback = true;
                    if(envir.dmg) {
                        this.invincible = true;
                    } else {
                        col = true;
                    }
                   // this.lastDirection = this.direction;
           
                   // this.direction = "none";
                
                }
                i++;
            }
            if(!col) {
                this.x -= this.game.clockTick * this.speed;
                this.direction = "left";
                this.hitBox.x = this.x+27;
            } else {
                console.log("why cant i  l");
                this.direction = "left";
                this.x += this.game.clockTick * this.speed;
                this.hitBox.x = this.x+27;
            }
            
        }

        // this.direction = "left";
        // this.hitBox.x = this.x+27;
    }
    if( this.game.keyPress["right"]) {
        if(!rightBound) {
            col = false;
            i = 0;
            while(i < this.game.environment.length && !col) {
                envir = this.game.environment[i];
                if(this.hitBox.x < envir.hitBox.x + envir.hitBox.width &&
                this.hitBox.x + this.hitBox.width > envir.hitBox.x && 
                this.hitBox.y < envir.hitBox.y + envir.hitBox.height &&
                this.hitBox.height + this.hitBox.y > envir.hitBox.y) {
                    if(this.invincible == false){
                        if(envir.dmg) {
                            this.hp -= 1;
                            this.time = Date.now();
                        }
               
                    }
                
                //this.knockback = true;
                    if(envir.dmg) {
                        this.invincible = true;
                    }else {
                        col = true;
                    }
                   // this.lastDirection = this.direction;
                  
                   // this.direction = "none";
                
                }
                i++;
            }
            if(!col) {
                this.x += this.game.clockTick * this.speed;
                this.direction = "right";
                this.hitBox.x = this.x+27;
            } else {
                console.log("why cant i move");
                 this.direction = "right";
                 this.x -= this.game.clockTick * this.speed;
                 this.hitBox.x = this.x+27;
            }
          
        }
        
        // this.direction = "right";
        // this.hitBox.x = this.x+27;
    }

    currentTime = Date.now() / this.frate;
    console.log("still firing" + currentTime);
    if( this.game.keyPress["shootUp"]) {
        this.direction = "up";
        
        if(currentTime - this.lastShot >= .5) {
            
            this.lastShot = currentTime;
   
            if(this.bulletUp.sprite != "none") {
                this.game.addPlayerBullet(new Bullet(this.game, AM.getAsset(this.bulletUp.sprite), this.x+32, this.y, this.bulletUp.direction, this.bulletUp.scale, this.AmmoType));
            } 
            if(this.bulletNW.sprite != "none") {
                this.game.addPlayerBullet(new Bullet(this.game, AM.getAsset(this.bulletNW.sprite), this.x+32, this.y, "NW", this.bulletNW.scale, this.AmmoType));
            }
            if(this.bulletNE.sprite != "none") {
                this.game.addPlayerBullet(new Bullet(this.game, AM.getAsset(this.bulletNE.sprite), this.x+32, this.y, "NE", this.bulletNE.scale, this.AmmoType));
            }
        }  
         
    }else if( this.game.keyPress["shootDown"]) {
        this.direction = "down";
        
        if(currentTime - this.lastShot >= .5) {
            this.lastShot = currentTime;
            if(this.bulletDown.sprite != "none") {
                this.game.addPlayerBullet(new Bullet(this.game, AM.getAsset(this.bulletDown.sprite), this.x + 32, this.y+64, this.bulletDown.direction, this.bulletDown.scale , this.AmmoType));
            }
            if(this.bulletSW.sprite != "none") {
                this.game.addPlayerBullet(new Bullet(this.game, AM.getAsset(this.bulletSW.sprite), this.x+32, this.y+64, "SW", this.bulletSW.scale, this.AmmoType));
            }
            if(this.bulletSE.sprite != "none") {
                this.game.addPlayerBullet(new Bullet(this.game, AM.getAsset(this.bulletSE.sprite), this.x+32, this.y+64, "SE", this.bulletSE.scale, this.AmmoType));
            }
        } 

    } else if(this.game.keyPress["shootLeft"]) {
        this.direction = "left";
        
        if(currentTime - this.lastShot >= .5) {
            this.lastShot = currentTime;
            if(this.bulletLeft.sprite != "none") {
                console.log("new ammo check failed");
                this.game.addPlayerBullet(new Bullet(this.game, AM.getAsset(this.bulletLeft.sprite), this.x, this.y+35, this.bulletLeft.direction, this.bulletLeft.scale, this.AmmoType));
            }
            if(this.bulletSW.sprite != "none") {
                    this.game.addPlayerBullet(new Bullet(this.game, AM.getAsset(this.bulletSW.sprite), this.x+32, this.y+64, "SW", this.bulletSW.scale, this.AmmoType));
            }
            if(this.bulletNW.sprite != "none") {
                    this.game.addPlayerBullet(new Bullet(this.game, AM.getAsset(this.bulletNW.sprite), this.x+32, this.y, "NW", this.bulletNW.scale, this.AmmoType));
            }
        } 

    }else if(this.game.keyPress["shootRight"]) {
        this.direction = "right";
        
        if(currentTime - this.lastShot >= .5) {
            this.lastShot = currentTime;
            if(this.bulletRight.sprite != "none") {
                this.game.addPlayerBullet(new Bullet(this.game, AM.getAsset(this.bulletRight.sprite), this.x+50, this.y+35, this.bulletRight.direction, this.bulletRight.scale, this.AmmoType));
            } 
            if(this.bulletSE.sprite != "none") {
                this.game.addPlayerBullet(new Bullet(this.game, AM.getAsset(this.bulletSE.sprite), this.x+32, this.y+64, "SE", this.bulletSE.scale, this.AmmoType));
            }
            if(this.bulletNE.sprite != "none") {
                this.game.addPlayerBullet(new Bullet(this.game, AM.getAsset(this.bulletNE.sprite), this.x+32, this.y, "NE", this.bulletNE.scale, this.AmmoType));
            }
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
  
                if(this.game.enemyProjectiles[i].direction == "down") {
                    if(!topBound && !leftBound && !botBound && !rightBound) {
                        this.y += 10;
                        this.hitBox.y = this.y+10;
                    }

                    console.log("hiting down");
                } else if(this.game.enemyProjectiles[i].direction == "up") {
                    if(!topBound && !leftBound && !botBound && !rightBound){
                        this.y -= 13;
                        this.hitBox.y = this.y-10;
                    }
                    
                
    
                } else if(this.game.enemyProjectiles[i].direction == "right") {
                    if(!topBound && !leftBound && !botBound && !rightBound) {
                        this.x += 27;
                        this.hitBox.x = this.x+10;
                    }
                    
                
                }else if(this.game.enemyProjectiles[i].direction == "left") {
                    if(!topBound && !leftBound && !botBound && !rightBound) {
                        this.x -= 27;
                        this.hitBox.x = this.x-10;

                    }
     
    
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
                               
                 if(this.game.enemies[i].direction == "down") {
                        
                        if(!topBound && !leftBound && !rightBound && !botBound) {
                           
                            
                            this.y += 30;
                            this.hitBox.y = this.y+13;
                           
                            
            
                            // this.y += 30;
                        }
                        
                       
                        // this.hitBox.y = this.y+13;
                        
           
                    } else if(this.game.enemies[i].direction == "up") {
                        if(!topBound && !leftBound && !rightBound && !botBound) {
                       
                            this.y -= 30;
                            this.hitBox.y = this.y+13;
                           
                            
                            
                        }
                            
                            

                    } else if(this.game.enemies[i].direction == "right") {
                        
                        
                        if(!topBound && !leftBound && !rightBound && !botBound) {
               
                
                                this.x += 30;
                                this.hitBox.x = this.x+27;
                              
                            
                           
                        }
                
                   
                        this.hitBox.x = this.x+27;
                    }else if(this.game.enemies[i].direction == "left") {
                         if(!topBound && !leftBound && !rightBound && !botBound) {
                 
                                this.x -= 30;
                                this.hitBox.x = this.x+27;
                             
                    
                        }
                        
                
                     
                }
                }

                this.invincible = true;
        }
    }
    if(this.hp <= 0) {
        cs.pause();
    }
}


function teleporter(game, spriteSheet, scale){
    this.teleporter = new Animation(spriteSheet, 64,64 );
}

function Bullet(game, spriteSheet, x, y, direction, scale, AmmoType) {
    this.bullet = new Animation(spriteSheet, 64, 64, 896, 1, 14, true, scale);
    this.game = game;
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.scale = scale;
    this.ctx = game.ctx;
    this.speed = 250;
    this.removeFromWorld = false;
    this.AType = AmmoType;
    console.log("ammo type is " + AmmoType);
     if(AmmoType === "Starter" || AmmoType === "triple" || AmmoType === "angled") {
        if(direction === "up") {
            this.hitBox = {x: this.x+12, y: this.y, width: 18, height: 30};
        } else if(direction === "down") {
            this.hitBox = {x: this.x+12, y: this.y+10, width: 18, height: 30};
        } else if(direction === "left") {
            this.hitBox = {x: this.x, y: this.y+13, width: 30, height: 18};
        } else if(direction === "right") {
            this.hitBox = {x: this.x+12, y: this.y+13, width: 30, height: 18};
        } else if(direction === "NE") {
            this.hitBox = {x: this.x +12, y: this.y, width: 30, height: 30};
        } else if(direction === "NW") {
            this.hitBox = {x: this.x+12, y: this.y, width: 30, height: 30};
        } else if(direction === "SE") {
            this.hitBox = {x: this.x+12, y: this.y, width: 30, height: 30};
        } else if(direction === "SW") {
            this.hitBox = {x: this.x+12, y: this.y, width: 30, height: 30};
        }

    }else if(AmmoType === "BIG") {
        if(direction === "up") {
            this.hitBox = {x: this.x+12, y: this.y, width: 30, height: 30};
        } else if(direction === "down") {
            this.hitBox = {x: this.x+12, y: this.y+10, width: 30, height: 30};
        } else if(direction === "left") {
            this.hitBox = {x: this.x, y: this.y+13, width: 40, height: 30};
        } else if(direction === "right") {
            this.hitBox = {x: this.x+12, y: this.y+13, width: 40, height: 30};
        } else if(direction === "NE") {
            this.hitBox = {x: this.x +12, y: this.y, width: 40, height: 40};
        } else if(direction === "NW") {
            this.hitBox = {x: this.x+12, y: this.y, width: 40, height: 40};
        } else if(direction === "SE") {
            this.hitBox = {x: this.x+12, y: this.y, width: 40, height: 40};
        } else if(direction === "SW") {
            this.hitBox = {x: this.x+12, y: this.y, width: 40, height: 40};
        }
    
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
    } else if( this.direction === "NW") {
        this.x -= this.game.clockTick * this.speed;
        this.y -= this.game.clockTick * this.speed;
        this.hitBox.x = this.x;
        this.hitBox.y = this.y;
    
    } else if(this.direction === "SW") {
        this.x -= this.game.clockTick * this.speed;
        this.y += this.game.clockTick * this.speed;
        this.hitBox.x = this.x;
        this.hitBox.y = this.y+12;
    } else if(this.direction === "SE") {
        this.x += this.game.clockTick * this.speed;
        this.y += this.game.clockTick * this.speed;
        this.hitBox.x = this.x+12;
        this.hitBox.y = this.y+12;
    } else if(this.direction === "NE") {
        this.x += this.game.clockTick * this.speed;
        this.y -= this.game.clockTick * this.speed;
        this.hitBox.x = this.x+12;
        this.hitBox.y = this.y;
    }
    // console.log(this.direction);
    // console.log(this.x);
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
    if(bg.finalBoss) {
        if(this.hitBox.x < bg.finalBossLeft.x + bg.finalBossLeft.width &&
            this.hitBox.x + this.hitBox.width > bg.finalBossLeft.x && 
            this.hitBox.y < bg.finalBossLeft.y + bg.finalBossLeft.height &&
            this.hitBox.height + this.hitBox.y > bg.finalBossLeft.y) {
                this.removeFromWorld = true; 
        }

        if(this.hitBox.x < bg.finalBossRight.x + bg.finalBossRight.width &&
            this.hitBox.x + this.hitBox.width > bg.finalBossRight.x && 
            this.hitBox.y < bg.finalBossRight.y + bg.finalBossRight.height &&
            this.hitBox.height + this.hitBox.y > bg.finalBossRight.y) {
                this.removeFromWorld = true; 
        }
    }
}

Bullet.prototype.draw = function() {
    this.bullet.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    // this.ctx.beginPath();
    // this.ctx.rect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
    // this.ctx.stroke();
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
    this.canMove = true;
    this.y = yloc;
    this.type = "robot";
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
    
    // for(var i = 0; i < this.game.enemies.length; i++) {
    //     enemy = this.game.enemies[i];
    //     if(this.hitBox.x + 20< enemy.hitBox.x + enemy.hitBox.width &&
    //         this.hitBox.x + 20 + this.hitBox.width > enemy.hitBox.x && 
    //         this.hitBox.y < enemy.y + enemy.hitBox.height &&
    //         this.hitBox.height + this.hitBox.y > enemy.hitBox.y && enemy.type != "drone") {
    //             this.direction = "none";
    //         this.canMove = false;
    //         console.log("the melee has been stopped up");
    //      } else {
    //          this.canMove = true;
    //     }


    // }
   
    // for(var i = 0; i < this.game.environment.length; i++) {
    //     eni = this.game.environment[i];
    //     if(this.hitBox.x < eni.hitBox.x + eni.hitBox.width &&
    //         this.hitBox.x + this.hitBox.width > eni.hitBox.x && 
    //         this.hitBox.y < eni.y + eni.hitBox.height &&
    //         this.hitBox.height + this.hitBox.y > eni.hitBox.y) {
    //             if(!eni.dmg) {
    //                 this.canMove = false;
    //                 this.direction = "none";
    //             }else{
    //                 this.canMove = true;
    //             }
           
    //         console.log("the melee has been stopped up");
    //      } else {
    //          this.canMove = true;
    //     }
    // }

    if(this.y < this.game.player.y) {
        if(!botBound) {
            
            if(this.canMove) {
                this.y += this.game.clockTick * this.speed;
                this.direction = "down";
            } else if(!rightBound && !this.canMove && this.x < this.game.player.x) {
                this.x -= this.game.clockTick * this.speed;
                this.direction = "right";
               // this.canMove = true;
            } else if(!leftBound && !this.canMove && this.x > this.game.player.x) {
                this.x += this.game.clockTick * this.speed;
                this.direction = "left";
            }
         
        }
        
        
    }
  
    if(this.y > this.game.player.y) {
        if(!topBound) {
     
    
            if(this.canMove) {
                this.y -= this.game.clockTick * this.speed;
                this.direction = "up";
            }else if(!rightBound && !this.canMove && this.x < this.game.player.x) {
                this.x -= this.game.clockTick * this.speed;
                this.direction = "right";
               // this.canMove = true;
            } else if(!leftBound && !this.canMove && this.x > this.game.player.x) {
                this.x += this.game.clockTick * this.speed;
                this.direction = "left";
            }
        }
        
        
    }
    if(this.x < this.game.player.x) {
        if(!rightBound) {
  
            if(this.canMove) {
                this.x += this.game.clockTick * this.speed;
                this.direction = "right";
            } else if(!topBound && !this.canMove && this.y < this.game.player.y) {
                this.y -= this.game.clockTick * this.speed;
                this.direction = "up";
               // this.canMove = true;
            } else if(!leftBound && !this.canMove && this.y > this.game.player.y) {
                this.y += this.game.clockTick * this.speed;
                this.direction = "down";
            }
        }
        
       
    }
    if (this.x > this.game.player.x) {
        if(!leftBound) {
  
            if(this.canMove) {
                this.x -= this.game.clockTick * this.speed;
                this.direction = "left";
            } else if(!topBound && !this.canMove && this.y < this.game.player.y) {
                this.y -= this.game.clockTick * this.speed;
                this.direction = "up";
               // this.canMove = true;
            } else if(!leftBound && !this.canMove && this.y > this.game.player.y) {
                this.y += this.game.clockTick * this.speed;
                this.direction = "down";
            }
        }
        
        
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
                if(this.game.player.AmmoType != "BIG") {
                    bullet.removeFromWorld = true;
                    this.hp -= 1;
                }else{
                    bullet.removeFromWorld = true;
                    this.hp -= 2;
                }
           
        }
    }
 
    if(this.hp <= 0) {
        this.removeFromWorld = true;
        this.game.score += 20;
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
   
 
    this.canMove = true;
    // this.ctx.beginPath();
    // this.ctx.rect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
    // this.ctx.stroke();
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
    this.type = "lrobot";
    this.hitBox = {x: this.x+50, y: this.y+20, width: 20, height: 77};
    this.upDownHitbox = {x: this.x+25, y: this.y+16, width: 42, height: 72};
    this.leftRightHitbox = {x: this.x+40, y: this.y+10, width: 20, height: 77};
    this.removeFromWorld = false;
}


LaserRobot.prototype.update = function() {
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
    for(var i = 0; i < this.game.environment.length; i++) {
        eni = this.game.environment[i];
        if(this.hitBox.x < eni.hitBox.x + eni.hitBox.width &&
            this.hitBox.x + this.hitBox.width > eni.hitBox.x && 
            this.hitBox.y < eni.y + eni.hitBox.height &&
            this.hitBox.height + this.hitBox.y > eni.hitBox.y) {
                if(!eni.dmg) {
                    this.canMove = false;
                    this.direction = "none";
                }else{
                    this.canMove = true;
                }
           
            console.log("the melee has been stopped up");
         } else {
             this.canMove = true;
        }
    }
    currentTime = Date.now() / 1000;
    if(this.y < this.game.player.y) {

        if(this.canMove) {
            this.y += this.game.clockTick * this.speed;

        }else {
            this.y -= this.game.clockTick * this.speed;
        }
        if(currentTime - this.lastShot >= 1 && this.direction === "down") {
            this.game.addEnemyProj(new Laser(this.game, AM.getAsset("./img/LaserUpDown.png"), this.x+25, this.y+35, "down", .65));
            this.lastShot = currentTime;
        }
        this.direction = "down";
 
    }
    if(this.y > this.game.player.y) {
        if(this.canMove) {
            this.y -= this.game.clockTick * this.speed;
          }else {
            this.y += this.game.clockTick * this.speed;
        }

        if(currentTime - this.lastShot >= 1 && this.direction === "up") {
            this.game.addEnemyProj(new Laser(this.game, AM.getAsset("./img/LaserUpDown.png"), this.x+25, this.y+35, "up", .65));
            this.lastShot = currentTime;
        }
        this.direction = "up";
    }
    if(this.x < this.game.player.x) {
        if(this.canMove) {
            this.x += this.game.clockTick * this.speed;
        
        }else {
            this.x -= this.game.clockTick * this.speed;
        }
        if(currentTime - this.lastShot >= 1) {
            this.game.addEnemyProj(new Laser(this.game, AM.getAsset("./img/LaserLeftRight.png"), this.x+50, this.y+35, "right", .65));
            this.lastShot = currentTime;
        }
        this.direction = "right";
    }
    if (this.x > this.game.player.x) {
        //console.log("shoot ma lazar left");
        //console.log("my direction is " + this.direction);
        if(this.canMove) {
            this.x -= this.game.clockTick * this.speed;
        } else {
            this.x += this.game.clockTick * this.speed;
        }
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
                if(this.game.player.AmmoType != "BIG") {
                    bullet.removeFromWorld = true;
                    this.hp -= 1;
                }else{
                    bullet.removeFromWorld = true;
                    this.hp -= 2;
                }
        }
    }
    this.canMove = true;
    if(this.hp <= 0) {
        this.removeFromWorld = true;
        this.game.score += 30;
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

    // this.ctx.beginPath();
    // this.ctx.rect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
    // this.ctx.stroke();
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
    // this.ctx.beginPath();
    // this.ctx.rect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
    // this.ctx.stroke();
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
    this.type = "turret";
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
                if(this.game.player.AmmoType != "BIG") {
                    bullet.removeFromWorld = true;
                    this.hp -= 1;
                }else{
                    bullet.removeFromWorld = true;
                    this.hp -= 2;
                }
        }
    }

    if(this.hp <= 0) {
        this.removeFromWorld = true;
        this.game.score += 10;
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

    // this.ctx.beginPath();
    // this.ctx.rect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
    // this.ctx.stroke();
    
}

function Drone(game, sprite, xLoc, yLoc) {
    this.droneAnim = new Animation(sprite, 64, 64, 512, 1, 8, true, 1);
    this.ctx = game.ctx;
    this.game = game;
    this.x = xLoc;
    this.y = yLoc;
    this.type = "drone";
    this.hp = 4;
    this.speed = 50;
    this.direction = "right";
    this.hitBox = {x: this.x, y: this.y, width: 50, height: 32};
    this.removeFromWorld = false;
}

Drone.prototype.update = function() {

    // if(this.game.started == false){
    //     return;
    // }

    if(this.y < this.game.player.y) {
        this.y += this.game.clockTick * this.speed;
        this.hitBox.y = this.y+15;
        this.direction = "down";
    }
    if(this.y > this.game.player.y) {
        this.y -= this.game.clockTick * this.speed;
        this.hitBox.y = this.y+15;
        this.direction = "up";
        
    }
    if(this.x < this.game.player.x) {
        this.x += this.game.clockTick * this.speed;
        this.hitBox.x = this.x+6;
        this.direction = "right";
    }
    if (this.x > this.game.player.x) {
        this.x -= this.game.clockTick * this.speed;
        this.hitBox.x = this.x+6;
        this.direction = "left";
    }

    for(i = 0; i < this.game.playerBullet.length; i++) {
        bullet = this.game.playerBullet[i];
        if(this.hitBox.x < bullet.hitBox.x + bullet.hitBox.width &&
            this.hitBox.x + this.hitBox.width > bullet.hitBox.x && 
            this.hitBox.y < bullet.y + bullet.hitBox.height &&
            this.hitBox.height + this.hitBox.y > bullet.hitBox.y) {
                bullet.removeFromWorld = true;
                if(this.game.player.AmmoType != "BIG") {
                    bullet.removeFromWorld = true;
                    this.hp -= 1;
                }else{
                    bullet.removeFromWorld = true;
                    this.hp -= 2;
                }
        }
    }

    if(this.hp <= 0) {
        this.removeFromWorld = true;
        this.game.score += 20;
    }

}

Drone.prototype.draw = function() {
    this.droneAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    // this.ctx.beginPath();
    // this.ctx.rect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
    // this.ctx.stroke();
}


function DroneBoss(game, sprite, xLoc, yLoc) {
    this.bossAnim = new Animation(sprite, 256, 256, 2048, 1, 8, true, .75);
    this.ctx = game.ctx;
    this.game = game;
    this.x = xLoc;
    this.y = yLoc;
    this.hp = 25;
    this.lastHp = 50;
    this.removeFromWorld = false;
    this.xVelocity = 100;
    this.yVelocity = 100;
    this.hitBox = {x: this.x+20, y: this.y+47, width: 150, height: 100};
    this.droneCircle = {x: this.x+95, y:this.y+95, radius: 100};
    this.game.droneBossAlive = true;
    this.drones = [];
    this.topDroneSpawn = {x: this.x+64, y: this.y-50};
    this.botDroneSpawn = {x: this.x+64, y: this.y+180};
    this.leftDroneSpawn = {x: this.x-60, y: this.y+58};
    this.rightDroneSpawn = {x: this.x+190, y: this.y+58};
    this.SwDroneSpawn = {x: this.x-36, y: this.y+140};
    this.NwDroneSpawn = {x: this.x-36, y: this.y-20};
    this.NeDroneSpawn = {x: this.x+160, y: this.y-20};
    this.SeDroneSpawm = {x: this.x+160, y: this.y+150};
    this.timeSinceSpawm = 0;

}

DroneBoss.prototype.removeDeadDrones = function(drone) {
    for (var i = this.drones.length - 1; i >= 0; --i) {
        if (this.drones[i] === drone) {
            this.drones.splice(i, 1);
        }
    }
}

DroneBoss.prototype.update = function() {
    for(i = 0; i < this.game.playerBullet.length; i++) {
        bullet = this.game.playerBullet[i];
        if(this.hitBox.x < bullet.hitBox.x + bullet.hitBox.width &&
            this.hitBox.x + this.hitBox.width > bullet.hitBox.x && 
            this.hitBox.y < bullet.y + bullet.hitBox.height &&
            this.hitBox.height + this.hitBox.y > bullet.hitBox.y) {
                if(this.game.player.AmmoType != "BIG") {
                    bullet.removeFromWorld = true;
                    this.hp -= 1;
                }else{
                    bullet.removeFromWorld = true;
                    this.hp -= 2;
                }
        }
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
            console.log("collision");
    }

    if(this.hitBox.x < bg.bottomHitBox.x + bg.bottomHitBox.width &&
        this.hitBox.x + this.hitBox.width > bg.bottomHitBox.x && 
        this.hitBox.y < bg.bottomHitBox.y + bg.bottomHitBox.height &&
        this.hitBox.height + this.hitBox.y > bg.bottomHitBox.y) {
            botBound = true; 
            console.log("collision");
    }

    if(this.hitBox.x < bg.leftHitBox.x + bg.leftHitBox.width &&
        this.hitBox.x + this.hitBox.width > bg.leftHitBox.x && 
        this.hitBox.y < bg.leftHitBox.y + bg.leftHitBox.height &&
        this.hitBox.height + this.hitBox.y > bg.leftHitBox.y) {
            leftBound = true; 
            console.log("collision");
    }

    if(this.hitBox.x < bg.rightHitBox.x + bg.rightHitBox.width &&
        this.hitBox.x + this.hitBox.width > bg.rightHitBox.x && 
        this.hitBox.y < bg.rightHitBox.y + bg.rightHitBox.height &&
        this.hitBox.height + this.hitBox.y > bg.rightHitBox.y) {
            rightBound = true; 
            console.log("collision");
    }

    if(this.hp <= 0) {
        this.removeFromWorld = true;
        this.game.score += 150;
        this.game.droneBossAlive = false;
        for (var i = this.drones.length - 1; i >= 0; --i) {
            this.drones[i].released = true;
        }
    }

    this.x += this.xVelocity * this.game.clockTick;
    this.y += this.yVelocity * this.game.clockTick;

    this.hitBox.x = this.x + 20;
    this.hitBox.y = this.y + 47;

    if(topBound) {
        this.yVelocity = -this.yVelocity;
        this.y += 10;
        this.hitBox.y = this.y + 47;
    } else if(botBound) {
        this.yVelocity = -this.yVelocity;
        this.y -= 10;
        this.hitBox.y = this.y + 47;
    }

    if(leftBound) {
        this.xVelocity = -this.xVelocity;
        this.x += 10;
        this.hitBox.x = this.x + 20;
    } else if(rightBound) {
        this.xVelocity = -this.xVelocity;
        this.x -= 10;
        this.hitBox.x = this.x + 20;
    }
    this.topDroneSpawn = {x: this.x+64, y: this.y-50};
    this.botDroneSpawn = {x: this.x+64, y: this.y+180};
    this.leftDroneSpawn = {x: this.x-60, y: this.y+58};
    this.rightDroneSpawn = {x: this.x+190, y: this.y+58};
    this.SwDroneSpawn = {x: this.x-36, y: this.y+140};
    this.NwDroneSpawn = {x: this.x-36, y: this.y-20};
    this.NeDroneSpawn = {x: this.x+160, y: this.y-20};
    this.SeDroneSpawm = {x: this.x+160, y: this.y+150};

    currentTime = Date.now()/1000;
    if(currentTime - this.timeSinceSpawm >= 15) {
        for(i = 0; i < this.drones.length; i++) {
            this.drones[i].released = true;
        }

        this.drones = [];
        addDrone = new BossMiniDrone(this.game, AM.getAsset("./img/Drone.png"), this.x+64, this.y-50, this, "top");
        this.game.addEnemy(addDrone);
        this.drones.push(addDrone);

        addDrone = new BossMiniDrone(this.game, AM.getAsset("./img/Drone.png"), this.x+64, this.y+180, this, "bot");
        this.game.addEnemy(addDrone);
        this.drones.push(addDrone);

        addDrone = new BossMiniDrone(this.game, AM.getAsset("./img/Drone.png"), this.x-60, this.y+58, this, "left");
        this.game.addEnemy(addDrone);
        this.drones.push(addDrone);

        addDrone = new BossMiniDrone(this.game, AM.getAsset("./img/Drone.png"), this.x+190, this.y+58, this, "right");
        this.game.addEnemy(addDrone);
        this.drones.push(addDrone);

        addDrone = new BossMiniDrone(this.game, AM.getAsset("./img/Drone.png"), this.x-36, this.y+140, this, "sw");
        this.game.addEnemy(addDrone);
        this.drones.push(addDrone);

        addDrone = new BossMiniDrone(this.game, AM.getAsset("./img/Drone.png"), this.x-36, this.y-20, this, "nw");
        this.game.addEnemy(addDrone);
        this.drones.push(addDrone);

        addDrone = new BossMiniDrone(this.game, AM.getAsset("./img/Drone.png"), this.x+160, this.y-20, this, "ne");
        this.game.addEnemy(addDrone);
        this.drones.push(addDrone);

        addDrone = new BossMiniDrone(this.game, AM.getAsset("./img/Drone.png"), this.x+160, this.y+150, this, "se");
        this.game.addEnemy(addDrone);
        this.drones.push(addDrone);

        this.timeSinceSpawm = currentTime;
    }

}

DroneBoss.prototype.draw = function() {
    this.bossAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    // this.ctx.beginPath();
    // this.ctx.rect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
    // this.ctx.stroke();

//     this.ctx.beginPath();
//     this.ctx.arc(this.x+95, this.y+95, 100, 0, Math.PI * 2, false);
//     this.ctx.stroke();
}

function BossMiniDrone(game, sprite, xLoc, yLoc, boss, pos) {
    this.droneAnim = new Animation(sprite, 64, 64, 512, 1, 8, true, 1);
    this.ctx = game.ctx;
    this.game = game;
    this.x = xLoc;
    this.y = yLoc;
    this.type = "drone";
    this.hp = 4;
    this.speed = 50;
    this.direction = "right";
    this.hitBox = {x: this.x+6, y: this.y+15, width: 50, height: 32};
    this.removeFromWorld = false;
    this.boss = boss;
    this.released = false;
    this.pos = pos;
}

BossMiniDrone.prototype.update = function() {
    for(i = 0; i < this.game.playerBullet.length; i++) {
        bullet = this.game.playerBullet[i];
        if(this.hitBox.x < bullet.hitBox.x + bullet.hitBox.width &&
            this.hitBox.x + this.hitBox.width > bullet.hitBox.x && 
            this.hitBox.y < bullet.y + bullet.hitBox.height &&
            this.hitBox.height + this.hitBox.y > bullet.hitBox.y) {
                if(this.game.player.AmmoType != "BIG") {
                    bullet.removeFromWorld = true;
                    this.hp -= 1;
                }else{
                    bullet.removeFromWorld = true;
                    this.hp -= 2;
                }
        }
    }

    if(this.hp <= 0) {
        this.removeFromWorld = true;
        this.boss.removeDeadDrones(this);
    }

    if(this.released && !this.removeFromWorld) {
        if(this.y < this.game.player.y) {
            this.y += this.game.clockTick * this.speed;
            this.hitBox.y = this.y+15;
            this.direction = "down";
        }
        if(this.y > this.game.player.y) {
            this.y -= this.game.clockTick * this.speed;
            this.hitBox.y = this.y+15;
            this.direction = "up";
            
        }
        if(this.x < this.game.player.x) {
            this.x += this.game.clockTick * this.speed;
            this.hitBox.x = this.x+6;
            this.direction = "right";
        }
        if (this.x > this.game.player.x) {
            this.x -= this.game.clockTick * this.speed;
            this.hitBox.x = this.x+6;
            this.direction = "left";
        }
    }

    if(!this.released && !this.removeFromWorld) {
        if(this.pos === "top") {
            this.x = this.boss.topDroneSpawn.x;
            this.y = this.boss.topDroneSpawn.y;
            this.hitBox.x = this.x+6;
            this.hitBox.y = this.y+15;
        } else if(this.pos === "bot") {
            this.x = this.boss.botDroneSpawn.x;
            this.y = this.boss.botDroneSpawn.y;
            this.hitBox.x = this.x+6;
            this.hitBox.y = this.y+15;
        } else if(this.pos === "left") {
            this.x = this.boss.leftDroneSpawn.x;
            this.y = this.boss.leftDroneSpawn.y;
            this.hitBox.x = this.x+6;
            this.hitBox.y = this.y+15;
        } else if(this.pos === "right") {
            this.x = this.boss.rightDroneSpawn.x;
            this.y = this.boss.rightDroneSpawn.y;
            this.hitBox.x = this.x+6;
            this.hitBox.y = this.y+15;
        } else if(this.pos === "ne") {
            this.x = this.boss.NeDroneSpawn.x;
            this.y = this.boss.NeDroneSpawn.y;
            this.hitBox.x = this.x+6;
            this.hitBox.y = this.y+15;
        } else if(this.pos === "nw") {
            this.x = this.boss.NwDroneSpawn.x;
            this.y = this.boss.NwDroneSpawn.y;
            this.hitBox.x = this.x+6;
            this.hitBox.y = this.y+15;
        } else if(this.pos === "se") {
            this.x = this.boss.SeDroneSpawm.x;
            this.y = this.boss.SeDroneSpawm.y;
            this.hitBox.x = this.x+6;
            this.hitBox.y = this.y+15;
        } else if(this.pos === "sw") {
            this.x = this.boss.SwDroneSpawn.x;
            this.y = this.boss.SwDroneSpawn.y;
            this.hitBox.x = this.x+6;
            this.hitBox.y = this.y+15;
        }
    }

}

BossMiniDrone.prototype.draw = function() {
    this.droneAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    // this.ctx.beginPath();
    // this.ctx.rect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
    // this.ctx.stroke();
}


function FinalBoss(game, sprite, xLoc, yLoc) {
    this.bossAnim = new Animation(sprite, 256, 256, 1024, 1, 4, true, .75);
    this.ctx = game.ctx;
    this.game = game;
    this.x = xLoc;
    this.y = yLoc;
    this.hp = 50;
    this.lastHp = 50;
    this.removeFromWorld = false;
    this.shotSpeed = 2
    this.lastShot = 0;
    this.hitBox = {x: this.x+30, y: this.y+34, width: 131, height: 136};
}

FinalBoss.prototype.update = function() {

    for(i = 0; i < this.game.playerBullet.length; i++) {
        bullet = this.game.playerBullet[i];
        if(this.hitBox.x < bullet.hitBox.x + bullet.hitBox.width &&
            this.hitBox.x + this.hitBox.width > bullet.hitBox.x && 
            this.hitBox.y < bullet.y + bullet.hitBox.height &&
            this.hitBox.height + this.hitBox.y > bullet.hitBox.y) {
                if(this.game.player.AmmoType != "BIG") {
                    bullet.removeFromWorld = true;
                    this.hp -= 1;
                }else{
                    bullet.removeFromWorld = true;
                    this.hp -= 2;
                }
        }
    }

    if(this.hp <= 0) {
        this.game.score += 200;
        this.removeFromWorld = true;
        this.game.background[0].finalBoss = false;
        cs.pause();
    }

    if(this.lastHp - this.hp >= 10) {
        this.lastHp = this.hp;
        this.shotSpeed -= .25;
    }
    currentTime = Date.now() / 1000;
    if(currentTime - this.lastShot > this.shotSpeed) {
        this.lastShot = currentTime;
        spot = 0;
        for(i = 0; i < 2; i++) {
            spot = Math.floor(Math.random() * 5);
            if(spot === 0) {
                this.game.addEnemyProj(new LaserCircle(this.game, AM.getAsset("./img/LaserCirc.png"), 
                    this.x + 25, this.y + 75, 100, 100));
                this.game.addEnemyProj(new LaserCircle(this.game, AM.getAsset("./img/LaserCirc.png"), 
                    this.x + 25, this.y + 75, -100, 100));
                this.game.addEnemyProj(new LaserCircle(this.game, AM.getAsset("./img/LaserCirc.png"), 
                    this.x + 25, this.y + 75, 0, 100));
            } else if(spot === 1) {
                this.game.addEnemyProj(new LaserCircle(this.game, AM.getAsset("./img/LaserCirc.png"), 
                    this.x + 50, this.y + 150, 100, 100));
                this.game.addEnemyProj(new LaserCircle(this.game, AM.getAsset("./img/LaserCirc.png"), 
                    this.x + 50, this.y + 150, -100, 100));
                this.game.addEnemyProj(new LaserCircle(this.game, AM.getAsset("./img/LaserCirc.png"), 
                    this.x + 50, this.y + 150, 0, 100));
            } else if(spot === 2) {
                this.game.addEnemyProj(new LaserCircle(this.game, AM.getAsset("./img/LaserCirc.png"), 
                    this.x + 100, this.y + 150, 100, 100));
                this.game.addEnemyProj(new LaserCircle(this.game, AM.getAsset("./img/LaserCirc.png"), 
                    this.x + 100, this.y + 150, -100, 100));
                this.game.addEnemyProj(new LaserCircle(this.game, AM.getAsset("./img/LaserCirc.png"), 
                    this.x + 100, this.y + 150, 0, 100));
            } else if(spot === 3) {
                this.game.addEnemyProj(new LaserCircle(this.game, AM.getAsset("./img/LaserCirc.png"), 
                    this.x + 125, this.y + 75, 100, 100));
                this.game.addEnemyProj(new LaserCircle(this.game, AM.getAsset("./img/LaserCirc.png"), 
                    this.x + 125, this.y + 75, -100, 100));
                this.game.addEnemyProj(new LaserCircle(this.game, AM.getAsset("./img/LaserCirc.png"), 
                    this.x + 125, this.y + 75, 0, 100));
            }
        }        
    }

    
    // console.log("Added bullet");
}
FinalBoss.prototype.draw = function() {
    this.bossAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    // this.ctx.beginPath();
    // this.ctx.rect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
    // this.ctx.stroke();

}
ForestBoss.prototype.draw = function() {
    this.bossAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    this.ctx.beginPath();
    this.ctx.rect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
    this.ctx.stroke();

}

function ForestBoss(game, walkUp, walkDown, walkLeft, walkRight, xLoc, yLoc) {
    this.walkUp = new Animation(walkUp, 256, 256, 1024, 4, 4, true, .5);
    this.walkDown = new Animation(walkDown, 256, 256, 1024, .4, 4, true, .5);
    this.walkLeft = new Animation(walkLeft, 256, 256, 1024, .4, 4, true, .5);
    this.walkRight = new Animation(walkRight, 256, 256, 1024, .4, 4, true, .5);
    this.ctx = game.ctx;
    this.game = game;
    this.x = xLoc;
    this.y = yLoc;
    this.hp = 35;
    this.lastHp = 65;
    this.speed = 130;
    this.removeFromWorld = false;
    this.lastMoveChange = 0;
    this.direction = "right";
    this.collidedWithPlayer = false;
    this.hitBox = {x: this.x+30, y: this.y+34, width: 131, height: 136};
    this.upDownHitbox = {x: this.x+20, y: this.y+16, width: 90, height: 90};
    this.leftHitbox = {x: this.x+70, y: this.y+10, width: 120, height: 100};
    this.rightHitbox = {x: this.x-20, y: this.y+10, width: 130, height: 100};
}

ForestBoss.prototype.update = function() {
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
    for(i = 0; i < this.game.playerBullet.length; i++) {
        bullet = this.game.playerBullet[i];
        if(this.hitBox.x < bullet.hitBox.x + bullet.hitBox.width &&
            this.hitBox.x + this.hitBox.width > bullet.hitBox.x && 
            this.hitBox.y < bullet.y + bullet.hitBox.height &&
            this.hitBox.height + this.hitBox.y > bullet.hitBox.y) {
                if(this.game.player.AmmoType != "BIG") {
                    bullet.removeFromWorld = true;
                    this.hp -= 1;
                }else{
                    bullet.removeFromWorld = true;
                    this.hp -= 2;
                }
        }
    }
    randomChance = Math.floor(Math.random()* Math.floor(10000));
    if(randomChance <= 50) {
    
        console.log("hit the random direction")
        random = Math.floor(Math.random()* Math.floor(4));
    
            if(random === 1 && !botBound) {

                this.direction = "down";

                state = true;
                console.log("direction is " + this.direction);

            } else if(random === 2 && !leftBound) {
                this.direction = "left";
                state = true;

            }else if(random === 0 && !topBound) {
                this.direction = "up";
    
                state = true;
            }else if(random === 4 && !rightBound) {
                this.direction = "right";
                state = true;
            }
        
    }

    if(this.direction === "right" && !rightBound) {
        //move right        
        this.x += this.game.clockTick * this.speed;
        this.hitBox.x = this.x + 12;

    }else if(this.direction === "right"){
        //look for other directions
        state = false;
        while(!state){
            //console.log("loop");
            random = Math.floor(Math.random()* Math.floor(3));
            //console.log("random" + random);
            if(random === 1 && !botBound) {

                this.direction = "down";
                this.y += this.game.clockTick * this.speed;
                this.hitBox.y = this.y + 10;
                state = true;
                console.log("direction is " + this.direction);

            } else if(random === 2 && !leftBound) {
                this.direction = "left";
                this.x -= this.game.clockTick * this.speed;
                this.hitBox.x = this.x; 
                state = true;

            }else if(random === 0 && !topBound) {
                this.direction = "up";
                this.y -= this.game.clockTick * this.speed;
                this.hitBox.y = this.y;
                state = true;
            }
        }
       
    }
    
    if(this.direction === "left" && !leftBound) {
        //move left
        this.x -= this.game.clockTick * this.speed;
        this.hitBox.x = this.x;
    }else if(this.direction === "left"){
        //look for other directions
        state = false;
        while(!state){
            random = Math.floor(Math.random()* Math.floor(3));
            if(random === 1 && !rightBound) {
                this.direction = "right";       
                this.x += this.game.clockTick * this.speed;
                this.hitBox.x = this.x + 12;
                state = true;

            } else if(random === 2 && !botBound) {
                this.direction = "down";
                this.y += this.game.clockTick * this.speed;
                this.hitBox.y = this.y + 10;
                state = true;
            }else if(random === 0 && !topBound) {
                this.direction = "up";
                this.y -= this.game.clockTick * this.speed;
                this.hitBox.y = this.y;
                state = true;
            }
        }
    }
    if(this.direction === "up" && !topBound) {
        //move up
        this.y -= this.game.clockTick * this.speed;
        this.hitBox.y = this.y;
    }else if(this.direction === "up"){
        //look for other directions
        state = false;
        while(!state){
            random = Math.floor(Math.random()* Math.floor(3));
            if(random === 1 && !rightBound) {
                this.direction = "right";
                this.x += this.game.clockTick * this.speed;
                this.hitBox.x = this.x + 12;
                state = true;
            } else if(random === 2 && !leftBound) {
                this.direction = "left";
                this.x -= this.game.clockTick * this.speed;
                this.hitBox.x = this.x; 
                state = true;

            }else if(random === 0 && !botBound) {
                this.direction = "down";
                this.y += this.game.clockTick * this.speed;
                this.hitBox.y = this.y + 10;
                state = true;
            }
        }
    }
    if(this.direction === "down" && !botBound) {
        //move down        
        this.y += this.game.clockTick * this.speed;
        this.hitBox.y = this.y + 10;

    }else if(this.direction === "down"){
        //look for other directions
        state = false;
        while(!state){
            
            random = Math.floor(Math.random()* Math.floor(3));
            if(random === 1 && !rightBound) {

                this.direction = "right";        
                this.x += this.game.clockTick * this.speed;
                this.hitBox.x = this.x + 12;
                state = true;

            } else if(random === 2 && !leftBound) {
                this.direction = "left";
                this.x -= this.game.clockTick * this.speed;
                this.hitBox.x = this.x;
                state = true;
            }else if(random === 0 && !topBound) {
                this.direction = "up";
                this.y -= this.game.clockTick * this.speed;
                this.hitBox.y = this.y;
                state = true;
            }
        }
    }  
    if(this.direction === "up" || this.direction === "down") {
        this.hitBox = this.upDownHitbox;
        this.hitBox.x = this.x +20;
        this.hitBox.y = this.y +16;
    } else if(this.direction === "left"){
        this.hitBox = this.leftHitbox;
        this.hitBox.x = this.x+5;
        this.hitBox.y = this.y+15;
    }else {
        this.hitBox = this.rightHitbox;
        this.hitBox.x = this.x;
        this.hitBox.y = this.y+14;
    }

    if(this.hp <= 0) {
        this.score += 100;
        this.removeFromWorld = true;
    }

    if(this.lastHp - this.hp >= 20) {
        this.lastHp = this.hp;
        this.speed += 40;
    }
    // currentTime = Date.now() / 1000;
    // if(currentTime - this.lastMoveChange > this.shotSpeed) {
    //     this.lastMoveChange = currentTime;
        
       
    // }
    
    
    // console.log("Added bullet");
}

ForestBoss.prototype.draw = function() {
    if(this.direction === "up") {
        this.walkUp.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else if(this.direction === "down") {
        this.walkDown.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else if (this.direction === "left") {
        this.walkLeft.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else if (this.direction === "right") {
        this.walkRight.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }
   
 
    this.canMove = true;
    this.ctx.beginPath();
    //this.ctx.rect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
    this.ctx.stroke();

}


function LaserCircle(game, laserAnim, xLoc, yLoc, xChange, yChange) {
    this.lcAnim = new Animation (laserAnim, 64, 64, 128, 1, 2, true, .65);
    this.game = game;
    this.ctx = game.ctx;
    this.x = xLoc;
    this.y = yLoc;
    this.xChange = xChange;
    this.yChange = yChange;
    this.hitBox = {x: this.x+10, y: this.y+10, width: 20, height: 20};
}

LaserCircle.prototype.update = function() {

    this.x += this.game.clockTick * this.xChange;
    this.y += this.game.clockTick * this.yChange;
    this.hitBox.x = this.x+10;
    this.hitBox.y = this.y+10;

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

LaserCircle.prototype.draw = function() {
    this.lcAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);

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
    // this.ctx.beginPath();
    // this.ctx.rect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
    // this.ctx.stroke();
}

function Barrel(game, rockSprite, xLoc, yLoc) {
    this.rockAnimation = new Animation(rockSprite, 64, 64, 64, 1, 1, true, 1);
    this.game = game;
    this.ctx = game.ctx;
    this.x = xLoc;
    this.y = yLoc;
    this.hitBox = {x: this.x+5, y: this.y+5, width: 55, height: 48};
    this.dmg = false;
}

Barrel.prototype.update = function(){


}

Barrel.prototype.draw = function() {
    this.rockAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    // this.ctx.beginPath();
    // this.ctx.rect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
    // this.ctx.stroke();
}

function Health(game, healthSprite, xLoc, yLoc) {
    this.HealthAnimation = new Animation(healthSprite, 400, 600, 1000, 1, 1, true, .08);
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
            this.moreX +=50;
            //this.moreY +=60;
    }
}
//for stat based power ups
function PowerUp(game, powerUpSprite , theX, theY, sheetWidth, theframes, health, frate, move, scale) { 
    this.x = theX;
    this.y = theY;
    this.game = game;
    this.ctx = game.ctx;
    
    this.PowerUpAnimation = new Animation(powerUpSprite, 64, 64, sheetWidth, 1, theframes, true, 1);
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

            this.game.player.hp += this.healthUpgrade;
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
function Ammo(game, powerUpSprite , theX, theY, bUp, bDown, bLeft, bRight, bNW, bSW, bSE, bNE, scale, name, frate) { 
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
    this.frateUpgrade = frate;
  
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
                this.game.player.bulletUp.scale = this.scaleUp;
                this.game.player.bulletDown.scale = this.scaleUp;
                this.game.player.bulletLeft.scale = this.scaleUp;
                this.game.player.bulletRight.scale = this.scaleUp;
                console.log("AMMO WORK THIS WORKED");
                this.game.player.bulletNW.sprite = this.bNW;
                this.game.player.bulletNE.sprite = this.bNE;
                this.game.player.bulletSW.sprite = this.bSW;
                this.game.player.bulletSE.sprite = this.bSE;
                //this.game.player.frate =  this.frateUpgrade;
                console.log("the new fire rate is " + this.game.player.frate);
                this.game.player.bulletNW.scale = this.scaleUp;
                this.game.player.bulletNE.scale = this.scaleUp;
                this.game.player.bulletSW.scale = this.scaleUp;
                this.game.player.bulletSE.scale = this.scaleUp;
                if(this.game.player.AmmoType != "BIG") {
                    this.game.player.AmmoType = this.name;
                }
                console.log("ammo type is " + this.game.player.AmmoType);
            this.removeFromWorld = true;
       
           
           
            console.log("HIT");
        }
}
Ammo.prototype.draw = function() {
   
        this.PowerUpAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    
}

function teleporter(game, powerUpSprite , theX, theY, scale){
    this.x = theX;
    this.y = theY;
    this.game = game;
    this.ctx = game.ctx;
    this.scale = scale;
    this.oldHealth = this.game.player.hp;
    this.PowerUpAnimation = new Animation(powerUpSprite, 64, 64, 512, .5, 8, true, 1);
    this.hitBox = {x: theX, y: theY, width: 64, height: 64};
}

teleporter.prototype.update = function(){
    if(this.game.player.hp > this.oldHealth){
        this.oldHealth = this.game.player.hp;
    }
    this.game.player.hp = this.oldHealth;
    if(this.hitBox.x < this.game.player.hitBox.x + this.game.player.hitBox.width &&
        this.hitBox.x + this.hitBox.width > this.game.player.hitBox.x && 
        this.hitBox.y < this.game.player.hitBox.y + this.game.player.hitBox.height &&
        this.hitBox.height + this.hitBox.y > this.game.player.hitBox.y) { 
            this.game.ctx.font = "30px Comic Sans MS";
            this.game.ctx.fillStyle = "red";
            this.game.ctx.fillText("Press E to advance", this.x, this.y);
            if(this.game.pressedE == 1){
                this.game.removeEnemies();           
                this.removeFromWorld = true;
                console.log("HIT");
            }
            this.game.pressedE = 0;
        }
}

teleporter.prototype.draw = function(){
    if(this.hitBox.x < this.game.player.hitBox.x + this.game.player.hitBox.width &&
        this.hitBox.x + this.hitBox.width > this.game.player.hitBox.x && 
        this.hitBox.y < this.game.player.hitBox.y + this.game.player.hitBox.height &&
        this.hitBox.height + this.hitBox.y > this.game.player.hitBox.y){
    this.game.ctx.fillText("Press E to advance", this.x - 100, this.y+300);}
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
function DeathText(game) {
    this.game = game;
    this.ctx = game.ctx;
    this.time = Date.now();
    this.x = this.ctx.canvas.clientWidth /2 -200;
    this.y = this.ctx.canvas.clientHeight / 2 -100;
}

DeathText.prototype.update = function(){
    if(this.game.clickedTest == true){
        if( Date.now() - this.time > 500){
            this.game.ctx.font = "30px Comic Sans MS";
            this.game.ctx.fillStyle = "red";
            if(Date.now() - this.time > 1000){
                this.game.ctx.font = "30px Comic Sans MS";
                this.game.ctx.fillStyle = "black";
                this.time = Date.now();
            }
            
        }

    }
    else{
        return;
    }
}

DeathText.prototype.draw = function() {
    if(this.game.clickedTest == true){
        this.game.ctx.fillText("YOU DIED CLICK HERE TO RESTART!", this.x, this.y);
        this.game.ctx.font = "25px Comic Sans MS";
        this.game.ctx.fillStyle = "black";
  
    }
}
function VictoryText(game) {
    this.game = game;
    this.ctx = game.ctx;
    this.time = Date.now();
    this.x = this.ctx.canvas.clientWidth /2 -200;
    this.y = this.ctx.canvas.clientHeight / 2 -100;
}

VictoryText.prototype.update = function(){
    if(this.game.clickedTest == true){
        if( Date.now() - this.time > 500){
            this.game.ctx.font = "30px Comic Sans MS";
            this.game.ctx.fillStyle = "blue";
            if(Date.now() - this.time > 1000){
                this.game.ctx.font = "30px Comic Sans MS";
                this.game.ctx.fillStyle = "green";
                this.time = Date.now();
            }
            
        }

    }
    else{
        return;
    }
}

VictoryText.prototype.draw = function() {
    if(this.game.clickedTest == true){
        this.game.ctx.fillText("YOU WIN CLICK HERE TO RESTART!", this.x, this.y);
        this.game.ctx.font = "25px Comic Sans MS";
        this.game.ctx.fillStyle = "blue";
  
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

function FourTurret(game, sprite, xLoc, yLoc) {
    this.sprite = new Animation(sprite, 64, 64, 192, .15, 3, true, 1.5);


    this.x = xLoc;
    this.y = yLoc;
    this.game = game;
    this.hp = 4;
    this.lastShot = 0;
    this.ctx = game.ctx;
    this.type = "4turret";
    this.removeFromWorld = false;
    this.hitBox = {x: this.x+5, y: this.y+10, width: 80, height: 75};

    
}

FourTurret.prototype.update = function() {
    if(this.game.started == false){
        return;
    }
    currentTime = Date.now() / 1000;
    if(currentTime - this.lastShot >=5) {
        this.lastShot = currentTime;
     
        this.game.addEnemyProj(new Laser(this.game, AM.getAsset("./img/LaserUpDown.png"), this.x+28, this.y, "up", .65));
 
        this.game.addEnemyProj(new Laser(this.game, AM.getAsset("./img/LaserUpDown.png"), this.x+28, this.y+72, "down", .65));
     
        this.game.addEnemyProj(new Laser(this.game, AM.getAsset("./img/LaserLeftRight.png"), this.x+15, this.y+5, "left", .65));
    
        this.game.addEnemyProj(new Laser(this.game, AM.getAsset("./img/LaserLeftRight.png"), this.x+45, this.y+5, "right", .65));
        
    }

    for(i = 0; i < this.game.playerBullet.length; i++) {
        bullet = this.game.playerBullet[i];
        if(this.hitBox.x < bullet.hitBox.x + bullet.hitBox.width &&
            this.hitBox.x + this.hitBox.width > bullet.hitBox.x && 
            this.hitBox.y < bullet.y + bullet.hitBox.height &&
            this.hitBox.height + this.hitBox.y > bullet.hitBox.y) {
                if(this.game.player.AmmoType != "BIG") {
                    bullet.removeFromWorld = true;
                    this.hp -= 1;
                }else{
                    bullet.removeFromWorld = true;
                    this.hp -= 2;
                }
        }
    }

    if(this.hp <= 0) {
        this.removeFromWorld = true;
        this.game.score += 10;
    }
}
//this.gameEngine.addEnemy(new FourTurret(gameEngine, AM.getAsset("./img/Turret4Way.png"), 400, 400));
FourTurret.prototype.draw = function() {
  
        this.sprite.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);


    //  this.ctx.beginPath();
    //  this.ctx.rect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
    //  this.ctx.stroke();
    
}




levelManager.init();
