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

function GameEngine() {
    this.entities = [];
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.player = null;
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
    });

    console.log('Input started');
}

GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
}

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];

        entity.update();
    }
}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
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
        this.game.ctx.strokeStyle = "green";
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