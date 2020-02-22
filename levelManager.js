var AM = new AssetManager();


function levelManager(){
    this.gameEngine = null;
    this.background = [];
    this.enemies = [];
    this.enemyProjectiles = [];
    this.playerBullet = [];
    this.player = [];
    this.level = 0;
    
}
levelManager.prototype.next = function(){
    this.level++;
}
levelManager.prototype.nextLevel = function(){
    if(this.level > 0 ){
        if(this.level == 2 || this.level == 4 || this.level == 6 || this.level == 8 ||this.level == 10){
            this.levelTeleport();
        }
        if(this.level == 1){
            this.level1();
        }
        if(this.level == 3){
            this.level2();
        }
        if(this.level == 5){
            this.level3();
        }
        if(this.level == 7){
            this.level4();
        }
        if(this.level == 9){
            this.level5();
        }
        if(this.level == 11){
            this.level6();
        }
        if(this.level == 12){
            this.gameEngine.removeAll();
            this.menu();
            this.level = -1;
            this.gameEngine.started = false;
            this.gameEngine.clickedTest = true;
        }
        this.level ++;
    }
}

levelManager.prototype.menu = function(){
    bg = new Background(gameEngine, AM.getAsset("./img/FloorOneBackgroundCrop.png"));
    gameEngine.addBackground(bg);
    bg.topHitBox.x = 0;
    bg.topHitBox.y = 0;
    bg.topHitBox.width = 910;
    bg.topHitBox.height = 41;
    bg.bottomHitBox.x = 0;
    bg.bottomHitBox.y = 604;
    bg.bottomHitBox.width = 910;
    bg.bottomHitBox.height = 56;
    bg.leftHitBox.x = 0;
    bg.leftHitBox.y = 0;
    bg.leftHitBox.width = 40;
    bg.leftHitBox.height = 660;
    bg.rightHitBox.x = 870;
    bg.rightHitBox.y = 0;
    bg.rightHitBox.width = 40;
    bg.rightHitBox.height = 660;
    
    gameEngine.addEntity(new startText(gameEngine));
    gameEngine.addEntity(new scoreText(gameEngine));
}

levelManager.prototype.update = function(){
    if(this.gameEngine != null && this.gameEngine.player != null && this.gameEngine.player.hp < 1){
        this.gameEngine.removeAll();
        this.menu();
        this.level = 0;
        this.gameEngine.started = false;
        this.gameEngine.clickedTest = true;
        this.gameEngine.player = null;
    }
}


levelManager.prototype.level1 = function(){
    gameEngine.setPlayer(new Raccoon(gameEngine, AM.getAsset("./img/RaccoonWalk_Up.png"), AM.getAsset("./img/RaccoonWalk_Down.png"), 
        AM.getAsset("./img/RaccoonWalk_Left.png"), AM.getAsset("./img/RaccoonWalk_Right.png")));
    gameEngine.addEntity(new Health(gameEngine, AM.getAsset("./img/trashcan.png"), 10, 10));
   
    this.gameEngine.addEnemy(new MeleeRobot(gameEngine, AM.getAsset("./img/MeleeRobWalk_Up.png"), AM.getAsset("./img/MeleeRobWalk_Down.png"), 
        AM.getAsset("./img/MeleeRobWalk_Left.png"), AM.getAsset("./img/MeleeRobWalk_Right.png"), 50, 450));
    this.gameEngine.addEnemy(new LaserRobot(gameEngine,AM.getAsset("./img/LaserRobWalk_Up.png"), AM.getAsset("./img/LaserRobWalk_Down.png"), 
        AM.getAsset("./img/LaserRobWalk_Left.png"), AM.getAsset("./img/LaserRobWalk_Right.png"), "right", 600,200));
    this.gameEngine.addEnemy(new Drone(gameEngine, AM.getAsset("./img/Drone.png"), 100, 500));
    this.gameEngine.addEnvironment(new GroundFire(gameEngine, AM.getAsset("./img/GroundFireSpritesheet.png"), 700, 350));
}

levelManager.prototype.level2 = function(){
    this.gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "up", 410, 480));
    this.gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "down", 410, 10));
    this.gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "left", 770, 310));
    this.gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "right", 15, 310));
}



levelManager.prototype.level3 = function(){
    this.gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "up", 410, 480));
    this.gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "down", 410, 10));
    this.gameEngine.addEnemy(new MeleeRobot(gameEngine, AM.getAsset("./img/MeleeRobWalk_Up.png"), AM.getAsset("./img/MeleeRobWalk_Down.png"), 
        AM.getAsset("./img/MeleeRobWalk_Left.png"), AM.getAsset("./img/MeleeRobWalk_Right.png"),50, 450));
}

levelManager.prototype.level4 = function(){
    this.gameEngine.addEnemy(new MeleeRobot(gameEngine, AM.getAsset("./img/MeleeRobWalk_Up.png"), AM.getAsset("./img/MeleeRobWalk_Down.png"), 
        AM.getAsset("./img/MeleeRobWalk_Left.png"), AM.getAsset("./img/MeleeRobWalk_Right.png"),50, 450));
    this.gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "left", 770, 310));
    this.gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "right", 15, 310));
}

levelManager.prototype.level5 = function(){
    this.gameEngine.addEnemy(new LaserRobot(gameEngine,AM.getAsset("./img/LaserRobWalk_Up.png"), AM.getAsset("./img/LaserRobWalk_Down.png"), 
        AM.getAsset("./img/LaserRobWalk_Left.png"), AM.getAsset("./img/LaserRobWalk_Right.png"), "right",50, 450));
    this.gameEngine.addEnemy(new LaserRobot(gameEngine,AM.getAsset("./img/LaserRobWalk_Up.png"), AM.getAsset("./img/LaserRobWalk_Down.png"), 
        AM.getAsset("./img/LaserRobWalk_Left.png"), AM.getAsset("./img/LaserRobWalk_Right.png"), "right", 600,200));
    this.gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "left",  770, 310));
    this.gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "right",15, 310));
}

levelManager.prototype.level6 = function(){
    this.gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "up", 410, 480));
    this.gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "down", 410, 10));
    this.gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "left", 770, 310));
    this.gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "right", 15, 310));

}

levelManager.prototype.levelTeleport = function(){
    this.gameEngine.addEnemy(new PowerUp(gameEngine, AM.getAsset("./img/GarbagePU.png"), 706, 100, 2, 1, 0, 1));
    this.gameEngine.addEnemy(new Ammo(gameEngine, AM.getAsset("./img/ThreeTimesBox.png") , 100, 100,"./img/Bullet_Up.png",
    "./img/Bullet_Down.png", "./img/Bullet_Left.png", "./img/Bullet_Right.png", "./img/BulletNW.png", 
    "./img/BulletSW.png", "./img/BulletSE.png", "./img/BulletNE.png", .65, "triple"));
    this.gameEngine.addEnemy(new teleporter(this.gameEngine, AM.getAsset("./img/Teleporter.png") , 455, 302, 1));

}


levelManager.prototype.init = function(){
    var that = this;
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
    AM.queueDownload("./img/LaserUpDown.png");
    AM.queueDownload("./img/LaserLeftRight.png");
    AM.queueDownload("./img/FloorOneBackgroundCrop.png");
    AM.queueDownload("./img/Drone.png");
    AM.queueDownload("./img/BulletNE.png");
    AM.queueDownload("./img/BulletNW.png");
    AM.queueDownload("./img/BulletSE.png");
    AM.queueDownload("./img/BulletSW.png");
    AM.queueDownload("./img/ThreeTimesBox.png");
    AM.queueDownload("./img/GarbagePU.png");
    AM.queueDownload("./img/Teleporter.png");



AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");
    var gameEngine = new GameEngine(that);
    this.gameEngine = gameEngine;
    that.gameEngine = gameEngine;

    gameEngine.init(ctx);
    gameEngine.start();

    that.background.push(new Background(gameEngine, AM.getAsset("./img/floor.png")));
    that.background.push(new GroundFire(gameEngine, AM.getAsset("./img/GroundFireSpritesheet.png"), 700, 350));
    // that.background.push(new Rock(gameEngine, AM.getAsset("./img/GreyRock.png"), 500, 350));
    that.background.push(new Rock(gameEngine, AM.getAsset("./img/Rock_Two.png"), 500, 550));
    that.background.push(new startText(gameEngine));
    that.background.push(new scoreText(gameEngine));
    

    that.player.push(new Health(gameEngine, AM.getAsset("./img/trashcan.png"), 10, 10));
    
    
   that.player.push(new Raccoon(gameEngine, AM.getAsset("./img/RaccoonWalk_Up.png"), AM.getAsset("./img/RaccoonWalk_Down.png"), 
        AM.getAsset("./img/RaccoonWalk_Left.png"), AM.getAsset("./img/RaccoonWalk_Right.png")));

    that.enemies.push(new MeleeRobot(gameEngine, AM.getAsset("./img/MeleeRobWalk_Up.png"), AM.getAsset("./img/MeleeRobWalk_Down.png"), 
        AM.getAsset("./img/MeleeRobWalk_Left.png"), AM.getAsset("./img/MeleeRobWalk_Right.png")));
    that.enemies.push(new LaserRobot(gameEngine,AM.getAsset("./img/LaserRobWalk_Up.png"), AM.getAsset("./img/LaserRobWalk_Down.png"), 
        AM.getAsset("./img/LaserRobWalk_Left.png"), AM.getAsset("./img/LaserRobWalk_Right.png"), "right"));
    that.enemies.push(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "up", 683, 600));
    that.enemies.push(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "down", 683, -30));
    that.enemies.push(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "left", 1200, 350));
    that.enemies.push(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "right", 50, 350));
    that.enemies.push(new Drone(gameEngine, AM.getAsset("./img/Drone.png"), -100, -100))
    that.menu();
});

}


