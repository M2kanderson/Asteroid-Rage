const Game = require('./game.js');
const Sound = require('./sound.js');

const GameView = function(game, ctx){
  this.game = game;
  this.ctx = ctx;
  this.ship = this.game.addShip();
};

GameView.MOVES = {
  "w": [ 0, -0.5],
  // "a": [-1,  0],
  "s": [ 0,  0.5],
  // "d": [ 1,  0],
};

GameView.ROTATION = {
  "a": -10,
  "d": 10
};
GameView.prototype.addEventListeners = function(){
  window.addEventListener("keydown", (e)=>{
    e.preventDefault();
    this.keysPressed[e.key] = true;
  });
  window.addEventListener("keyup", (e)=>{
    // e.preventDefault();
    delete this.keysPressed[e.key];
  });
  let muteButton = $('.mute-button');
  muteButton.click( (e) =>{
    // e.preventDefault();
    if(muteButton.text() === "Mute"){
      this.bgMusic.stop();
      this.game.muteSounds = true;
      muteButton.text("Play Music");
    }else{
      this.bgMusic.play();
      this.game.muteSounds = false;
      muteButton.text("Mute");
    }

  });
};


GameView.prototype.start = function () {
  this.addEventListeners();
  this.bgMusic = new Sound("./media/QziF-toby fox - UNDERTALE Soundtrack - 100 MEGALOVANIA longer.mp3");

  this.bgMusic.play();
  this.keysPressed = {};
  this.lastFireTime = 0;


  this.gameInterval = window.setInterval(()=>{
    this.ship.drawBooster = false;
    if(this.game.gameOver){
      window.clearInterval(this.gameInterval);
      $(".game-over").addClass('active');
    }
    Object.keys(this.keysPressed).forEach((key) =>{
      let move = GameView.MOVES[key];
      let rotation = GameView.ROTATION[key];
      if(move){
        this.ship.power(move);
        this.ship.drawBooster = true;
      }
      if(rotation){
        this.ship.rotate(rotation);
      }

      if(key === " " && new Date - this.lastFireTime >= 300){
        this.lastFireTime = new Date();
        this.ship.fireBullet();
      }
    });
    this.game.step();
    this.game.draw(this.ctx);
  }, 20);
};

module.exports = GameView;
