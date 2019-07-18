//labeena's game
// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);
var score = 0;
//for score button
var labelscore;
//to be able to control the body of the bird
var player;
//to control the pipes
var pipes = [];
var blockHeight = 50;
var gapSize = 100;
var gapMargin = 50;
var width = 790;
var height = 400;
var stars = [];
//var highScore = 0
//var scoreEntry;

/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
  //image of bird and pipes, audio of score and flapping noises
  game.load.image("character","../assets/flappy-cropped.png");
  game.load.audio("score", "../assets/point.ogg");
  game.load.image("pipeBlock","../assets/pipe2-body.png");
  game.load.audio("flap","../assets/0128.ogg");
  game.load.image("star","../assets/star.png");
}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    // set the background colour of the scene
    game.stage.setBackgroundColor("#5796b3");
    //to enable the spacebar to control jumps
    game.input
    .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    .onDown.add(playerJump);
    //for the score counter
    labelscore = game.add.text(10, 10, score.toString(),{font:"30px Arial"});
    //for the player image
    player = game.add.sprite(50,50,"character");
    //to generate the pipes for the beginning
    generatePipe();
    //to start off the system with gravity
      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.physics.arcade.enable(player);
      //give bird gravity
      player.body.gravity.y = 200;

    var pipeInterval = 1.75 * Phaser.Timer.SECOND;
    //generates pipes every x seconds
        game.time.events.loop(
         pipeInterval,
         generatePipe,
        );
    //changes the score when bird goes thru the pipes
        game.time.events.loop(
          pipeInterval,
          changeScore,
        );

      var starInterval = 1 * Phaser.Timer.SECOND;
      game.time.events.loop(
        starInterval,
        generateStar
      );
}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
  //to stop the game if a pipe is hit or the bird goes too far up or down
  game.physics.arcade.overlap(player, pipes, gameOver);
  if(player.body.y < 0 || player.body.y > 400){
    gameOver();
  }
}
//restarts the game after the previous function works
function gameOver() {
  location.reload();
  //function registerScore(score) {
  //  if (score > highscore) {
  //    highScore = scoreEntry = "<li>" +name+ ":" + score.toString()+ "</li>";
  //    var name = prompt("what is your name?");
  //  }
  //}
}
//this function makes images appear where you click
//this function is called when the spacebar is played to play a sound

//this will make a score counter
function changeScore() {
  score = score + 1;
//plays sound when bird goes thru pipe
  game.sound.play("score");
  labelscore.setText(score.toString());
}

function generatePipe() {
//to randomize the gap in the pipes
  var gapStart = game.rnd.integerInRange(gapMargin,height-gapSize-gapMargin);
  for(var y = gapStart; y > 0; y-= blockHeight){
    addPipeBlock(width, y-blockHeight);
    }
    for(var y = gapStart + gapSize; y < height; y+= blockHeight) {
      addPipeBlock(width,y)
    }

}

//this makes the pipes move, giving them velocity etc
function addPipeBlock(x,y) {
  var pipeBlock = game.add.sprite(x,y,"pipeBlock");
  pipes.push(pipeBlock);
  game.physics.enable(pipeBlock);
  pipeBlock.body.velocity.x = -200;

}

//gives the bird velocity and the flapping sound
function playerJump(){
  player.body.velocity.y = -100;
  game.sound.play("flap");
}

function generateStar(){
  var star = game.add.sprite(750,20,"star");
  stars.push(star);
  game.physics.enable("star");
  star.body.velocity.x = -80;
  star.body.velocity.y = 20;
}
