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
    //this.level++;
}
levelManager.prototype.nextLevel = function(){
    if(this.level > 0 ){
        if(this.level % 2 == 0){
       
            for(i = 0; i < this.gameEngine.environment.length; i++) {
                this.gameEngine.environment[i].removeFromWorld = true;
            }
            this.levelTeleport();
        }
        else if(this.level == 1){
            level1();
            this.bgHasChanged = true;
            this.bgSound = 1;
        }
        else if(this.level == 7){
            bosslevel1();
            this.bgHasChanged = true;
            this.bgSound = 4;
        }
        else if(this.level == 15){
            bosslevel2();
            this.bgHasChanged = true;
            this.bgSound = 4;
        }        
        else if(this.level == 23){
            bosslevel3();
            this.bgHasChanged = true;
            this.bgSound = 4;
        }
        else{
            var index = getRandomInt(levelList.length);
            levelList[index]();
            levelList.splice(index, 1);
        }
        if(this.level == 9){
            this.gameEngine.removeBG();
            bg = new Background(gameEngine, AM.getAsset("./img/Road.png"));
            gameEngine.addBackground(bg);
            this.bgHasChanged = true;
            this.bgSound = 2;
        }
        if(this.level == 17){
            this.gameEngine.removeBG();
            bg = new Background(gameEngine, AM.getAsset("./img/lab.png"));
            gameEngine.addBackground(bg);
            this.bgHasChanged = true;
            this.bgSound = 3;
        }
        if(this.level == 24){
            this.gameEngine.removeAll();
            this.gameEngine.removeBG();
            bg = new Background(gameEngine, AM.getAsset("./img/FloorOneBackgroundCrop.png"));
            this.VictoryMenu();
            this.level = -1;
            this.bgHasChanged = true;
            this.bgSound = 1;
            this.gameEngine.started = false;
            this.gameEngine.clickedTest = true;
            levelList = FulllevelList;
        }
        this.level ++;
    }
}

levelManager.prototype.menu = function(){
    bg = new Background(gameEngine, AM.getAsset("./img/FloorOneBackgroundCrop.png"));
    bgHasChanged = false;
    bgSound = 1;
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
    gameEngine.background[0].finalBoss = false;

    gameEngine.addEntity(new startText(gameEngine));
    gameEngine.addEntity(new scoreText(gameEngine));
}
levelManager.prototype.VictoryMenu = function(){
    bg = new Background(gameEngine, AM.getAsset("./img/FloorOneBackgroundCrop.png"));
    bgHasChanged = false;
    bgSound = 1;
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
    gameEngine.background[0].finalBoss = false;

    gameEngine.addEntity(new VictoryText(gameEngine));
    gameEngine.addEntity(new scoreText(gameEngine));
}

levelManager.prototype.DeathMenu = function(){
    bg = new Background(gameEngine, AM.getAsset("./img/FloorOneBackgroundCrop.png"));
    bgHasChanged = false;
    bgSound = 1;
    
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
    gameEngine.background[0].finalBoss = false;

    gameEngine.addEntity(new DeathText(gameEngine));
    gameEngine.addEntity(new scoreText(gameEngine));
}
levelManager.prototype.update = function(){
    if(this.gameEngine != null && this.gameEngine.player != null && this.gameEngine.player.hp < 1){
        cs = forest;
        cs.pause();
        cs.play();
        this.gameEngine.removeAll();
    
        this.DeathMenu();
        cs.pause();
        this.level = 0;
        levelList = FulllevelList;
        this.gameEngine.started = false;
        this.gameEngine.clickedTest = true;
        this.gameEngine.player = null;
        this.bgHasChanged = true;
        this.bgSound = 1;
 
        
    }
    if(this.bgHasChanged === true) {
        if(this.bgSound === 1) {
            /*******************************************************************************************************************************************
            *  This is forest music for the first level, put on very first zone
            ******************************************************************************************************************************************/
            cs = forest;
            cs.pause();
            cs.play();
            this.bgHasChanged = false;
        }else if(this.bgSound === 2) {
            /*******************************************************************************************************************************************
            *  This is city music for the 2nd zone
            ******************************************************************************************************************************************/
           cs.pause();
           cs = cityscape;
           cs.play();
           this.bgHasChanged = false;
        }else if(this.bgSound === 3) {
             /*******************************************************************************************************************************************
            *  This is lab music for the 3rd zone
            ******************************************************************************************************************************************/
           cs.pause();
           cs = lab;
           cs.play();
           this.bgHasChanged = false;
        }else if(this.bgSound === 4) {
            /*******************************************************************************************************************************************
            *  This is ebil music for the boss fight, IN MAIN.j during boss fight must have cs.pause() when boss reaches zero
            *  otherwise the music will loop over into the restarted game. if 'victory scene level' made then we must add a cs.pause() in there to
            *  ensure no repeating
            ******************************************************************************************************************************************/
           cs.pause();
           cs = ebil;
           cs.play();
           this.bgHasChanged = false;
        }
    }
   // console.log("the level is " + this.level);
}

//level7, level8, level9, level10, level11,level12,level7, level8, level9, level10, level11,level12
var FulllevelList = [level2, level3, level4, level5, level6, level7, level8, level9, level10, level11,level12,level13, level14, level15];
var levelList = [level2, level3, level4, level5, level6, level7, level8, level9, level10, level11,level12,level13, level14, level15];

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

function level1(){
    gameEngine.setPlayer(new Raccoon(gameEngine, AM.getAsset("./img/RaccoonWalk_Up.png"), AM.getAsset("./img/RaccoonWalk_Down.png"), 
        AM.getAsset("./img/RaccoonWalk_Left.png"), AM.getAsset("./img/RaccoonWalk_Right.png")));
    gameEngine.addEntity(new Health(gameEngine, AM.getAsset("./img/trashcan.png"), 10, 10));
   
    gameEngine.addEnemy(new MeleeRobot(gameEngine, AM.getAsset("./img/MeleeRobWalk_Up.png"), AM.getAsset("./img/MeleeRobWalk_Down.png"), 
        AM.getAsset("./img/MeleeRobWalk_Left.png"), AM.getAsset("./img/MeleeRobWalk_Right.png"), 50, 200));
        gameEngine.addEnemy(new MeleeRobot(gameEngine, AM.getAsset("./img/MeleeRobWalk_Up.png"), AM.getAsset("./img/MeleeRobWalk_Down.png"), 
        AM.getAsset("./img/MeleeRobWalk_Left.png"), AM.getAsset("./img/MeleeRobWalk_Right.png"), 600, 200));


}

function level2(){
    gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "up", 410, 480));
    gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "down", 410, 10));
    gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "left", 770, 310));
    gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "right", 15, 310));
}



function level3(){
    gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "up", 410, 480));
    gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "down", 410, 10));
    gameEngine.addEnemy(new MeleeRobot(gameEngine, AM.getAsset("./img/MeleeRobWalk_Up.png"), AM.getAsset("./img/MeleeRobWalk_Down.png"), 
        AM.getAsset("./img/MeleeRobWalk_Left.png"), AM.getAsset("./img/MeleeRobWalk_Right.png"),50, 450));
}

function level4(){
    gameEngine.addEnemy(new MeleeRobot(gameEngine, AM.getAsset("./img/MeleeRobWalk_Up.png"), AM.getAsset("./img/MeleeRobWalk_Down.png"), 
        AM.getAsset("./img/MeleeRobWalk_Left.png"), AM.getAsset("./img/MeleeRobWalk_Right.png"),50, 450));
    gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "left", 770, 310));
    gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "right", 15, 310));
}

function level5(){
    gameEngine.addEnemy(new LaserRobot(gameEngine,AM.getAsset("./img/LaserRobWalk_Up.png"), AM.getAsset("./img/LaserRobWalk_Down.png"), 
        AM.getAsset("./img/LaserRobWalk_Left.png"), AM.getAsset("./img/LaserRobWalk_Right.png"), "right",50, 450));
    gameEngine.addEnemy(new LaserRobot(gameEngine,AM.getAsset("./img/LaserRobWalk_Up.png"), AM.getAsset("./img/LaserRobWalk_Down.png"), 
        AM.getAsset("./img/LaserRobWalk_Left.png"), AM.getAsset("./img/LaserRobWalk_Right.png"), "right", 600,200));
    gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "left",  770, 310));
    gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "right",15, 310));
}

function level6(){
    gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "up", 410, 480));
    gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "down", 410, 10));
    gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "left", 770, 310));
    gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "right", 15, 310));

} 

function level7(){
    gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "down", 15, 10));
    gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "down", 410, 10));
    gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "down", 770, 10));
    gameEngine.addEnemy(new MeleeRobot(gameEngine, AM.getAsset("./img/MeleeRobWalk_Up.png"), AM.getAsset("./img/MeleeRobWalk_Down.png"), 
        AM.getAsset("./img/MeleeRobWalk_Left.png"), AM.getAsset("./img/MeleeRobWalk_Right.png"),50, 450));

}


function level8(){
    gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "up", 15, 480));
    gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
        AM.getAsset("./img/Turret_Right.png"), "up", 770, 480));
    gameEngine.addEnemy(new LaserRobot(gameEngine,AM.getAsset("./img/LaserRobWalk_Up.png"), AM.getAsset("./img/LaserRobWalk_Down.png"), 
        AM.getAsset("./img/LaserRobWalk_Left.png"), AM.getAsset("./img/LaserRobWalk_Right.png"), "right",50, 450));
    gameEngine.addEnemy(new LaserRobot(gameEngine,AM.getAsset("./img/LaserRobWalk_Up.png"), AM.getAsset("./img/LaserRobWalk_Down.png"), 
        AM.getAsset("./img/LaserRobWalk_Left.png"), AM.getAsset("./img/LaserRobWalk_Right.png"), "right", 600,200));

}

function level9(){
    gameEngine.addEnemy(new MeleeRobot(gameEngine, AM.getAsset("./img/MeleeRobWalk_Up.png"), AM.getAsset("./img/MeleeRobWalk_Down.png"), 
        AM.getAsset("./img/MeleeRobWalk_Left.png"), AM.getAsset("./img/MeleeRobWalk_Right.png"),410, 480));
    gameEngine.addEnemy(new MeleeRobot(gameEngine, AM.getAsset("./img/MeleeRobWalk_Up.png"), AM.getAsset("./img/MeleeRobWalk_Down.png"), 
        AM.getAsset("./img/MeleeRobWalk_Left.png"), AM.getAsset("./img/MeleeRobWalk_Right.png"),410, 15));
    gameEngine.addEnemy(new MeleeRobot(gameEngine, AM.getAsset("./img/MeleeRobWalk_Up.png"), AM.getAsset("./img/MeleeRobWalk_Down.png"), 
        AM.getAsset("./img/MeleeRobWalk_Left.png"), AM.getAsset("./img/MeleeRobWalk_Right.png"),770, 310));
    gameEngine.addEnemy(new MeleeRobot(gameEngine, AM.getAsset("./img/MeleeRobWalk_Up.png"), AM.getAsset("./img/MeleeRobWalk_Down.png"), 
        AM.getAsset("./img/MeleeRobWalk_Left.png"), AM.getAsset("./img/MeleeRobWalk_Right.png"),15, 310));
}

function level10(){
    gameEngine.addEnemy(new MeleeRobot(gameEngine, AM.getAsset("./img/MeleeRobWalk_Up.png"), AM.getAsset("./img/MeleeRobWalk_Down.png"), 
        AM.getAsset("./img/MeleeRobWalk_Left.png"), AM.getAsset("./img/MeleeRobWalk_Right.png"),410, 480));
    gameEngine.addEnemy(new MeleeRobot(gameEngine, AM.getAsset("./img/MeleeRobWalk_Up.png"), AM.getAsset("./img/MeleeRobWalk_Down.png"), 
        AM.getAsset("./img/MeleeRobWalk_Left.png"), AM.getAsset("./img/MeleeRobWalk_Right.png"),410, 15));
    gameEngine.addEnemy(new LaserRobot(gameEngine,AM.getAsset("./img/LaserRobWalk_Up.png"), AM.getAsset("./img/LaserRobWalk_Down.png"), 
        AM.getAsset("./img/LaserRobWalk_Left.png"), AM.getAsset("./img/LaserRobWalk_Right.png"), "right",770, 310));
    gameEngine.addEnemy(new LaserRobot(gameEngine,AM.getAsset("./img/LaserRobWalk_Up.png"), AM.getAsset("./img/LaserRobWalk_Down.png"), 
        AM.getAsset("./img/LaserRobWalk_Left.png"), AM.getAsset("./img/LaserRobWalk_Right.png"), "right", 15, 310));
}

function level11(){
    gameEngine.addEnemy(new Drone(gameEngine, AM.getAsset("./img/Drone.png"),410, 480));
    gameEngine.addEnemy(new Drone(gameEngine, AM.getAsset("./img/Drone.png"),410, 15));
    gameEngine.addEnemy(new Drone(gameEngine, AM.getAsset("./img/Drone.png"),450, 480));
    gameEngine.addEnemy(new Drone(gameEngine, AM.getAsset("./img/Drone.png"),450, 15));
    gameEngine.addEnemy(new LaserRobot(gameEngine,AM.getAsset("./img/LaserRobWalk_Up.png"), AM.getAsset("./img/LaserRobWalk_Down.png"), 
        AM.getAsset("./img/LaserRobWalk_Left.png"), AM.getAsset("./img/LaserRobWalk_Right.png"), "right",770, 310));
    gameEngine.addEnemy(new LaserRobot(gameEngine,AM.getAsset("./img/LaserRobWalk_Up.png"), AM.getAsset("./img/LaserRobWalk_Down.png"), 
        AM.getAsset("./img/LaserRobWalk_Left.png"), AM.getAsset("./img/LaserRobWalk_Right.png"), "right", 15, 310));
}

function level12(){
    gameEngine.addEnemy(new Drone(gameEngine, AM.getAsset("./img/Drone.png"), 410, 480));
    gameEngine.addEnemy(new Drone(gameEngine, AM.getAsset("./img/Drone.png"), 410, 10));
    gameEngine.addEnemy(new Drone(gameEngine, AM.getAsset("./img/Drone.png"), 770, 310));
    gameEngine.addEnemy(new Drone(gameEngine, AM.getAsset("./img/Drone.png"), 15, 310));

} 

function level13(){
    gameEngine.addEnemy(new Drone(gameEngine, AM.getAsset("./img/Drone.png"), 410, 480));
    gameEngine.addEnemy(new Drone(gameEngine, AM.getAsset("./img/Drone.png"), 410, 10));
    gameEngine.addEnemy(new Drone(gameEngine, AM.getAsset("./img/Drone.png"), 770, 310));
    gameEngine.addEnemy(new Drone(gameEngine, AM.getAsset("./img/Drone.png"), 15, 310));
    gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
    AM.getAsset("./img/Turret_Right.png"), "down", 15, 10));
    gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
    AM.getAsset("./img/Turret_Right.png"), "left", 770, 30));
    gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
    AM.getAsset("./img/Turret_Right.png"), "right", 15, 500));
    gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
    AM.getAsset("./img/Turret_Right.png"), "up", 770, 500));

} 

function level14(){
    gameEngine.addEnemy(new LaserRobot(gameEngine,AM.getAsset("./img/LaserRobWalk_Up.png"), AM.getAsset("./img/LaserRobWalk_Down.png"), 
    AM.getAsset("./img/LaserRobWalk_Left.png"), AM.getAsset("./img/LaserRobWalk_Right.png"), "left", 770, 310));
    gameEngine.addEnemy(new LaserRobot(gameEngine,AM.getAsset("./img/LaserRobWalk_Up.png"), AM.getAsset("./img/LaserRobWalk_Down.png"), 
    AM.getAsset("./img/LaserRobWalk_Left.png"), AM.getAsset("./img/LaserRobWalk_Right.png"), "right", 15, 310));
    gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
    AM.getAsset("./img/Turret_Right.png"), "down", 15, 10));
    gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
    AM.getAsset("./img/Turret_Right.png"), "left", 770, 30));
    gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
    AM.getAsset("./img/Turret_Right.png"), "right", 15, 500));
    gameEngine.addEnemy(new Turret(gameEngine, AM.getAsset("./img/Turret_Up.png"), AM.getAsset("./img/Turret_Down.png"), AM.getAsset("./img/Turret_Left.png"), 
    AM.getAsset("./img/Turret_Right.png"), "up", 770, 500));

} 
function level15(){
    gameEngine.addEnemy(new LaserRobot(gameEngine,AM.getAsset("./img/LaserRobWalk_Up.png"), AM.getAsset("./img/LaserRobWalk_Down.png"), 
    AM.getAsset("./img/LaserRobWalk_Left.png"), AM.getAsset("./img/LaserRobWalk_Right.png"), "left", 770, 310));
    gameEngine.addEnemy(new FourTurret(gameEngine, AM.getAsset("./img/Turret4Way.png"), 650, 400));
    gameEngine.addEnemy(new FourTurret(gameEngine, AM.getAsset("./img/Turret4Way.png"), 150, 200));
    gameEngine.addEnemy(new Drone(gameEngine, AM.getAsset("./img/Drone.png"), 410, 10));
    gameEngine.addEnemy(new Drone(gameEngine, AM.getAsset("./img/Drone.png"), 770, 310));


} 
function bosslevel1() {
    gameEngine.addEnemy(new ForestBoss(gameEngine, AM.getAsset("./img/TractorMiniBossUp.png"), AM.getAsset("./img/TractorMiniBossDown.png"), AM.getAsset("./img/TractorMiniBossLeft.png"), AM.getAsset("./img/TractorMiniBossRight.png"), 600, 200));
}

function bosslevel2() {
    gameEngine.addEnemy(new DroneBoss(gameEngine, AM.getAsset("./img/DroneBoss.png"), 100, 100));
}

function bosslevel3() {
    gameEngine.addEnemy(new FinalBoss(gameEngine, AM.getAsset("./img/FinalBoss.png"), 350, 25));
    gameEngine.addEnemy(new FinalBoss(gameEngine, AM.getAsset("./img/FinalBoss.png"), 350, 25));
    gameEngine.background[0].finalBoss = true;
    gameEngine.addEnvironment(new Barrel(gameEngine, AM.getAsset("./img/ToxBarrel.png"), 20, 150));
    gameEngine.addEnvironment(new Barrel(gameEngine, AM.getAsset("./img/ToxBarrel.png"), 55, 150));
    gameEngine.addEnvironment(new Barrel(gameEngine, AM.getAsset("./img/ToxBarrel.png"), 90, 150));
    gameEngine.addEnvironment(new Barrel(gameEngine, AM.getAsset("./img/ToxBarrel.png"), 125, 150));
    gameEngine.addEnvironment(new Barrel(gameEngine, AM.getAsset("./img/ToxBarrel.png"), 160, 150));
    gameEngine.addEnvironment(new Barrel(gameEngine, AM.getAsset("./img/ToxBarrel.png"), 195, 150));
    gameEngine.addEnvironment(new Barrel(gameEngine, AM.getAsset("./img/ToxBarrel.png"), 230, 150));
    gameEngine.addEnvironment(new Barrel(gameEngine, AM.getAsset("./img/ToxBarrel.png"), 265, 150));
    gameEngine.addEnvironment(new Barrel(gameEngine, AM.getAsset("./img/ToxBarrel.png"), 300, 150));
    gameEngine.addEnvironment(new Barrel(gameEngine, AM.getAsset("./img/ToxBarrel.png"), 345, 150));
    
    gameEngine.addEnvironment(new Barrel(gameEngine, AM.getAsset("./img/ToxBarrel.png"), 480, 150));
    gameEngine.addEnvironment(new Barrel(gameEngine, AM.getAsset("./img/ToxBarrel.png"), 525, 150));
    gameEngine.addEnvironment(new Barrel(gameEngine, AM.getAsset("./img/ToxBarrel.png"), 560, 150));
    gameEngine.addEnvironment(new Barrel(gameEngine, AM.getAsset("./img/ToxBarrel.png"), 595, 150));
    gameEngine.addEnvironment(new Barrel(gameEngine, AM.getAsset("./img/ToxBarrel.png"), 635, 150));
    gameEngine.addEnvironment(new Barrel(gameEngine, AM.getAsset("./img/ToxBarrel.png"), 670, 150));
    gameEngine.addEnvironment(new Barrel(gameEngine, AM.getAsset("./img/ToxBarrel.png"), 705, 150));
    gameEngine.addEnvironment(new Barrel(gameEngine, AM.getAsset("./img/ToxBarrel.png"), 740, 150));
    gameEngine.addEnvironment(new Barrel(gameEngine, AM.getAsset("./img/ToxBarrel.png"), 775, 150));
    gameEngine.addEnvironment(new Barrel(gameEngine, AM.getAsset("./img/ToxBarrel.png"), 815, 150));
}

levelManager.prototype.levelTeleport = function(){
    console.log("the level is " + this.level);
     if(this.level === 8 || this.level === 16) {
        var chanceUp = Math.floor((Math.random() * 100) + 1);
        if(chanceUp > 66) {
            this.gameEngine.addEnvironment(new Ammo(gameEngine, AM.getAsset("./img/ShotgunSlugs.png") , 100, 100,"./img/Bullet_Up.png",
            "./img/Bullet_Down.png", "./img/Bullet_Left.png", "./img/Bullet_Right.png", "none", 
            "none", "none", "none", .8, "BIG", 2000));
      
        } else if ( chanceUp < 33) {
                     this.gameEngine.addEnvironment(new Ammo(gameEngine, AM.getAsset("./img/TimesBox.png") , 100, 100,"none",
                     "none", "none", "none", "./img/BulletNW.png", 
                    "./img/BulletSW.png", "./img/BulletSE.png", "./img/BulletNE.png", .65, "angled", 1));
        }else{
            this.gameEngine.addEnvironment(new Ammo(gameEngine, AM.getAsset("./img/ThreeTimesBox.png") , 100, 100,"./img/Bullet_Up.png",
            "./img/Bullet_Down.png", "./img/Bullet_Left.png", "./img/Bullet_Right.png", "./img/BulletNW.png", 
            "./img/BulletSW.png", "./img/BulletSE.png", "./img/BulletNE.png", .65, "triple", 1));
        }
        console.log("ammo should pop up");
  
     }
    
    console.log("the after level is " + this.level);
    var health = new PowerUp(gameEngine, AM.getAsset("./img/GarbagePU.png"), 706, 100, 488, 7, 1, 1, 0, 1);
    var frate = new PowerUp(gameEngine, AM.getAsset("./img/BumpStock.png"), 706, 100, 256, 4, 0, .8, 0, 1);
    var speed = new PowerUp(gameEngine, AM.getAsset("./img/CottonCandy.png"), 706, 100, 64, 1, 0, 1, 10, 1);
    var chance = Math.floor((Math.random() * 100) + 1);
    console.log("chance is " + chance);
    if(chance > 66) {
        this.gameEngine.addEnvironment(health);
    } else if ( chance < 33) {
        this.gameEngine.addEnvironment(frate);
    }else{
        this.gameEngine.addEnvironment(speed);
    }

    this.gameEngine.addEnemy(new teleporter(this.gameEngine, AM.getAsset("./img/Teleporter.png") , 455, 302, 1));

}


levelManager.prototype.init = function(){
    var that = this;
    AM.queueDownload("./img/floor.png");
    AM.queueDownload("./img/Road.png");
    AM.queueDownload("./img/lab.png");
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
    AM.queueDownload("./img/CottonCandy.png");
    AM.queueDownload("./img/BumpStock.png");
    AM.queueDownload("./img/FinalBoss.png");
    AM.queueDownload("./img/LaserCirc.png");
    AM.queueDownload("./img/DroneBoss.png");
    AM.queueDownload("./img/TractorMiniBossUp.png");
    AM.queueDownload("./img/TractorMiniBossDown.png");
    AM.queueDownload("./img/TractorMiniBossLeft.png");
    AM.queueDownload("./img/TractorMiniBossRight.png");
    AM.queueDownload("./img/ToxBarrel.png");
    AM.queueDownload("./img/TimesBox.png");
    AM.queueDownload("./img/ShotgunSlugs.png");
    AM.queueDownload("./img/Turret4Way.png");
AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");
    var gameEngine = new GameEngine(that);
    this.gameEngine = gameEngine;
    that.gameEngine = gameEngine;

    gameEngine.init(ctx);
    gameEngine.start();

    that.background.push(new Background(gameEngine, AM.getAsset("./img/floor.png")));

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


