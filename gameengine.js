window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

function GameEngine(levelManager) {
    this.levelManager = levelManager;
    this.entities = [];
    this.enemies = [];
    this.enemyProjectiles = [];
    this.playerBullet = [];
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.player = null;
    this.clickedTest =null;
    this.started = null;
    this.score =0;
    this.background = [];
    this.environment = [];
    //Really ugly fix so the drones can see if the boss is alive
    this.droneBossAlive = false;
}

GameEngine.prototype.setPlayer = function(player) {
    this.player = player;
    this.entities.push(player);
}
GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.timer = new Timer();
    this.startInput();
    this.keyPress = new Array(8);
    this.pressedE = 0;
    this.clickedTest = true;
    this.started = false;
    this.ctx.font = "30px Comic Sans MS";
    this.ctx.fillStyle = "blue";

    this.keyPress["up"] = false;
    this.keyPress["down"] = false;
    this.keyPress["left"] = false;
    this.keyPress["right"] = false;
    this.keyPress["shootUp"] = false;
    this.keyPress["shootDown"] = false;
    this.keyPress["shootLeft"] = false;
    this.keyPress["shootRight"] = false;

    console.log('game initialized');
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.removeAll = function(){
    for(var i = 0; i < this.entities.length; i++){
        this.entities[i].removeFromWorld = true;
    }
    this.player.removeFromWorld = true;

    for(var i = 0; i < this.enemies.length; i++){
        this.enemies[i].removeFromWorld = true;
    }
}

GameEngine.prototype.removeEnemies = function(){
    for(var i = 0; i < this.enemies.length; i++){
        this.enemies[i].removeFromWorld = true;
    }
}

GameEngine.prototype.removeBG = function(){
    for(var i = 0; i < this.background.length; i++){
        this.background[i].removeFromWorld = true;
    }
}
GameEngine.prototype.removeEni = function(){
    for(var i = 0; i < this.environment.length; i++){
        this.environment[i].removeFromWorld = true;
    }
}

GameEngine.prototype.startInput = function () {
    console.log('Starting input');
    var that = this;

    this.ctx.canvas.addEventListener("keydown" , function(e) {
        if(e.code === "KeyW") {
            that.keyPress["up"] = true;
            e.preventDefault();
        }
        if(e.code === "KeyS") {
            that.keyPress["down"] = true;
            e.preventDefault();
        }
        if(e.code === "KeyA") {
            that.keyPress["left"] = true;
            e.preventDefault();
        }
        if(e.code === "KeyD") {
            that.keyPress["right"] = true;
            e.preventDefault();
        }
        if(e.code == "ArrowUp") {
            that.keyPress["shootUp"] = true;
            e.preventDefault();
        }
        if(e.code === "ArrowDown") {
            that.keyPress["shootDown"] = true;
            e.preventDefault();
        }
        if(e.code === "ArrowLeft") {
            that.keyPress["shootLeft"] = true;
            e.preventDefault();
        }
        if(e.code === "ArrowRight") {
            that.keyPress["shootRight"] = true;
            e.preventDefault();
        }
        if(e.code == "KeyE"){
            that.pressedE = 0;
            e.preventDefault();
        }
    });

    this.ctx.canvas.addEventListener("keyup" , function(e) {
        if(e.code === "KeyW") {
            that.keyPress["up"] = false;
            e.preventDefault();
        }
        if(e.code === "KeyS") {
            that.keyPress["down"] = false;
            e.preventDefault();
        }
        if(e.code === "KeyA") {
            that.keyPress["left"] = false;
            e.preventDefault();
        }
        if(e.code === "KeyD") {
            that.keyPress["right"] = false;
            e.preventDefault();
        }
        if(e.code == "ArrowUp") {
            that.keyPress["shootUp"] = false;
            e.preventDefault();
        }
        if(e.code === "ArrowDown") {
            that.keyPress["shootDown"] = false;
            e.preventDefault();
        }
        if(e.code === "ArrowLeft") {
            that.keyPress["shootLeft"] = false;
            e.preventDefault();
        }
        if(e.code === "ArrowRight") {
            that.keyPress["shootRight"] = false;
            e.preventDefault();
        }
        if(e.code == "KeyE"){
            that.pressedE = 1;
            e.preventDefault();
        }
    });

    this.ctx.canvas.addEventListener("click", function(){
        that.clickedTest = false; 
        that.started = true;
        that.levelManager.level ++;  
        
    });

    console.log('Input started');
}

GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
}

GameEngine.prototype.addEnvironment = function (entity) {
    console.log('added entity');
    this.environment.push(entity);
}

GameEngine.prototype.addBackground = function (entity) {
    console.log('added background');
    this.background.push(entity);
}

GameEngine.prototype.addPlayerBullet = function (entity) {
    console.log('added entity');
    this.playerBullet.push(entity);
}

GameEngine.prototype.addEnemyProj= function (entity) {
    console.log('added laser');
    this.enemyProjectiles.push(entity);
}

GameEngine.prototype.addEnemy= function (entity) {
    console.log('added entity');
    this.enemies.push(entity);
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    for(var i = 0; i < this.background.length; i++) {
        this.background[i].draw(this.ctx);
    }
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    for(var i = 0; i < this.enemyProjectiles.length; i++) {
        this.enemyProjectiles[i].draw(this.ctx);
    }
    for(var i = 0; i < this.enemies.length; i++) {
        this.enemies[i].draw(this.ctx);
    }
    for(var i = 0; i < this.playerBullet.length; i++) {
        this.playerBullet[i].draw(this.ctx);
    }
    for(var i = 0; i < this.environment.length; i++) {
        this.environment[i].draw(this.ctx);
    }
    this.ctx.restore();
}

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;
    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];
        if (!entity.removeFromWorld) {
            entity.update();
        }
    }
    for (var i = this.entities.length - 1; i >= 0; --i) {
        if (this.entities[i].removeFromWorld) {
            this.entities.splice(i, 1);
        }
    }

    //Update for enemy projectile list
    var entitiesCount = this.enemyProjectiles.length;
    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.enemyProjectiles[i];
        

        if (!entity.removeFromWorld) {
            entity.update();
        }
    }
    for (var i = this.enemyProjectiles.length - 1; i >= 0; --i) {
        if (this.enemyProjectiles[i].removeFromWorld) {
            this.enemyProjectiles.splice(i, 1);
        }
    }

    //update for player bullet list
    var entitiesCount = this.playerBullet.length;
    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.playerBullet[i];
        

        if (!entity.removeFromWorld) {
            entity.update();
        }
    }
    for (var i = this.playerBullet.length - 1; i >= 0; --i) {
        if (this.playerBullet[i].removeFromWorld) {
            this.playerBullet.splice(i, 1);
        }
    }

    //update for enemies list
    var entitiesCount = this.enemies.length;
    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.enemies[i];
        if (!entity.removeFromWorld) {
            entity.update();
        }
    }
    for (var i = this.enemies.length - 1; i >= 0; --i) {
        if (this.enemies[i].removeFromWorld) {
            this.enemies.splice(i, 1);
        }
    }

    //update for environment list
    var entitiesCount = this.environment.length;
    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.environment[i];
        if (!entity.removeFromWorld) {
            entity.update();
        }
    }
    for (var i = this.environment.length - 1; i >= 0; --i) {
        if (this.environment[i].removeFromWorld) {
            this.environment.splice(i, 1);
        }
    }
}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    if(this.started == true && this.enemies.length == 0){
        this.levelManager.nextLevel();
    }
    this.levelManager.update();
    this.update();
    this.draw();
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function () {
}

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "blue";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}