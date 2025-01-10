const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#FFF",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};




const game = new Phaser.Game(config);





let player;                // The player sprite (Dino)
let score;                  // The current score of the game
let clouds;                 // Group for the cloud objects
let ground;                 // The ground sprite used in the game
let obstacles;              // Group for the obstacle objects (cacti)
let scoreText;              // Text object displaying the current score
let gameOverText;           // Image object for the "Game Over" screen
let restartText;            
let gameOverContainer;  
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0; // Retrieve the saved high score
function gameOver(){
   /* const newHighScore = this.highScoreText.text.substring(this.highScoreText.text.length - 5);
    const newScore = Number(this.scoreText.text) > Number(newHighScore)
     ? this.scoreText.text: newHighScore;
     this.highScoreText.setText("HI" +newScore);
     this.highScoreText.setAlpha(1); */
   
    if (this.score > this.highScore) {
        this.highScore = this.score; // Update high score
        localStorage.setItem('highScore', highScore);
        this.highScoreText.setText("HI" + String(this.highScore).padStart(4, '0')); // Update high score text
    }
    this.highScoreText.setAlpha(1);
    this.gameOverContainer.setAlpha(1);
    this.isGameRunning = false
    this.physics.pause();
   
   
 }




function preload() {
    this.load.spritesheet("dino", "assets/dino-run.png",{
        frameWidth: 88,
        frameHeight : 94
    });
    this.load.image("cloud", "assets/cloud.png");
    this.load.image("ground", "assets/ground.png");
    this.load.image("game-over", "assets/game-over.png");
    this.load.image("restart", "assets/restart.png");


    for (let i = 0; i < 6; i++) {
        const cactusNum = i + 1;
        this.load.image(`obstacle-${cactusNum}`, `assets/cactuses_${cactusNum}.png`); // Corrected template literal
    }
}


function create() {
    this.isGameRunning = true;
    this.timer = 0;
    this.gameSpeed = 10;
    this.player = this.physics.add.sprite(200,200, "dino")
    .setOrigin(0,1)
    .setCollideWorldBounds(true)
    .setGravityY(5000)
    .setBodySize(44,92)
    .setDepth(1);




    this.ground=this.add.tileSprite(0, 300, 1000, 30, "ground")
    .setOrigin(0,1);
     this.physics.world.enable(this.ground);  // Enable physics on the ground
    this.ground.body.setAllowGravity(false);  // Prevent ground from being affected by gravity
    this.ground.body.setImmovable(true);  // Make sure the ground doesn't move




    // Add collision between the player and the ground
   this.physics.add.collider(this.player, this.ground);
    this.clouds = this.add.group();
    this.clouds=this.clouds.addMultiple([
    this.add.image(200,100,"cloud"),
    this.add.image(300,130,"cloud"),
    this.add.image(650,90,"cloud"),
   
])
this.obstacles = this.physics.add.group()
this.physics.add.collider(this.obstacles, this.player, gameOver,null,this);


this.gameOverText = this.add.image(0,0, "game-over");
this.restartText= this.add.image(0,80,"restart").setInteractive();
//bc u need a restart button so make its image interactive w user
this.gameOverContainer = this.add
.container(1000/2, (300/2) - 50)
.add([this.gameOverText, this.restartText])
.setAlpha(0);


this.scoreText = this.add.text(700,30, "0000", {
    fontSize : 30,
    fontFamily : "Arial",
    color : "535353",
    resolution : 5
}).setOrigin(1,0);
this.highScoreText = this.add.text(this.scoreText.getBounds().left - 20,0 ,"0000", {
    fontSize : 30,
    fontFamily : "Arial",
    color : "535353",
    resolution : 5
}).setOrigin(1,0).setAlpha(0);


this.score = 0;
this.frameCounter = 0;
this.gameSpeed = 13;


this.restartText.on("pointerdown", () =>{
    this.physics.resume();
    this.player.setVelocityY(0);
    this.obstacles.clear(true,true);
   
    this.frameCounter = 0;
   this.score = 0; // Reset the score to 0
    const formattedScore = String(Math.floor(this.score));
    this.scoreText.setText(formattedScore);
    this.isGameRunning = true;
    this.gameOverContainer.setAlpha(0);
   
   
     })


}




function update(time,delta) {
    if(!this.isGameRunning){
        return;}
    this.frameCounter ++;
    if(this.frameCounter%100 == 0){
        this.score += 100;
      const formattedScore = String (Math.floor(this.score));
      this.scoreText.setText(formattedScore);
    }


     this.cursors = this.input.keyboard.createCursorKeys();
     const {space,up} = this.cursors;
    const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space)
    || Phaser.Input.Keyboard.JustDown(up);
     const onFloor = this.player.body.onFloor();
    if(isSpaceJustDown && onFloor){
        this.player.setVelocityY(-1600);
   
    }
 
this.ground.tilePositionX += this.gameSpeed;
Phaser.Actions.IncX(this.obstacles.getChildren(), -this.gameSpeed);
this.timer += delta;
console.log(this.timer);


while(this.timer > 1000) {
 this.obstacleNum = Math.floor((Math.random()*6)+1);
this.obstacle = this.obstacles.create(700,200, `obstacle-${this.obstacleNum}`).setOrigin(0);
this.obstacle.body.allowGravity = false;
this.timer -= 1000;
}
//regular creation of random obstacles
  this.obstacles.getChildren().forEach(obstacle => {
      if(obstacle.getBounds().right<0){
          this.obstacles.remove(obstacle);
          obstacle.destroy();
      }
     //obstacle deleted once leaving frame
     });


}
//to make highscore, create highscore variable, then in create, store all scores in an array before update ends
//then, in update, compare every score to the array elements, if its more, print it !








