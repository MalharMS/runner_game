localStorage["High.score"] = 0

//initiate Game STATEs
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var Runner, runner_run, runner_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var stopSound;

var gameOver,restart,gameOverimage,restartimage,play;

function preload(){
  runner_run = loadAnimation("sa/1.png","sa/2.png","sa/3.png","sa/4.png","sa/5.png","sa/6.png","sa/7.png","sa/8.png","sa/9.png","sa/10.png");
  runner_dead = loadAnimation("sa/dead.png");
   
  groundImage = loadImage("ground2.png");
  
  airp = loadImage("images/a2.png")

  cloudImage = loadImage("cloud.png");
  
  // obstacles images
  obstacle1 = loadImage("images/ob1.png");
  obstacle2 = loadImage("images/ob2.png");
  obstacle3 = loadImage("images/ob3.png");
  obstacle4 = loadImage("images/ob1.png");
  obstacle5 = loadImage("images/ob2.png");
  obstacle6 = loadImage("images/ob3.png");
  
  // game end images
  gameOverimage = loadImage("gameOver.png");
  restartimage = loadImage("restart.png");

  // bg image
  bg = loadImage("images/back.jpg");

  // sounds
  bgs = loadSound("sounds/background.mp3")
  jump = loadSound("sounds/jump.mp3")

}

function setup() {
  createCanvas(displayWidth, displayHeight);
  
  bgs.play();
  
  stopSound = createButton('Sound off');
  stopSound.position(1400, 50);

  Runner = createSprite(50,displayHeight-400,20,50);
  Runner.addAnimation("running", runner_run);
  Runner.addAnimation("collided", runner_dead);
  Runner.scale = 0.3;
  Runner.debug = true
  
  ground = createSprite(200,displayHeight-250,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.scale = 1.4;
  
  
  invisibleGround = createSprite(200,displayHeight-240,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  
  //place gameOver and restart icon on the screen
    gameOver = createSprite(displayWidth/2, displayHeight/2 - 130);
    restart = createSprite(displayWidth/2 ,displayHeight/2 - 20);
    gameOver.addImage(gameOverimage)
    gameOver.scale = 0.3;
    restart.addImage(restartimage)
    restart.scale = 0.09;

    gameOver.visible = false;
    restart.visible = false;

}

function draw() {
  background(bg);

  //Adding score and highscore to canvas 
  textSize(20);
  fill("white")
  text("Score: "+ score, 800,50);
  text("highscore: "+ localStorage["High.score"],600,50 )

  // sound off 
  stopSound.mousePressed(function(){
    bgs.stop();
  });

  if (gameState===PLAY){ 

    score = score + Math.round(getFrameRate()/60);

    if(keyDown("space")&& Runner.y >= displayHeight/2 + 100) {
      jump.play();
      Runner.velocityY = -14 ;  
    }
  
    Runner.velocityY = Runner.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    ground.velocityX = -4;
    
    air();
    spawnObstacles();    
    if(obstaclesGroup.isTouching(Runner)){
      gameState=END
    }

  } else if(gameState===END){
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    Runner.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the Runner animation
    Runner.changeAnimation("collided",runner_collided)
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
  
    obstaclesGroup.depth = 1 ; 

    if(mousePressedOver(restart)) {
      reset();
    }
    
    
  
  }
  Runner.collide(invisibleGround);
  drawSprites();
}

function air() {
  //write code here to spawn the clouds
  if (frameCount % 220 === 0) {
    var cloud = createSprite(800, displayHeight/4, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(airp);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = Runner.depth;
    Runner.depth = Runner.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if(frameCount % 80 === 0) {
    var obstacle = createSprite(displayWidth ,displayHeight-270, 10, 20);
    obstacle.velocityX = -6;
    
    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              obstacle.scale = 1
              break;
      case 2: obstacle.addImage(obstacle2);
              obstacle.scale = 0.8
              break;
      case 3: obstacle.addImage(obstacle3);
              obstacle.scale = 1
              break;
      case 4: obstacle.addImage(obstacle4);
              obstacle.scale = 0.8
              break;
      case 5: obstacle.addImage(obstacle5);
              obstacle.scale = 1
              break;
      case 6: obstacle.addImage(obstacle6);
              obstacle.scale = 1
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    // obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  Runner.changeAnimation("running",runner_run);
  
  if(localStorage["High.score"] < score){
  localStorage["High.score"] = score
  }
  
  score = 0;
  
  
}

