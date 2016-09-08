const Game = require('./game.js');
const Sound = require('./sound.js');

const GameView = function(game, ctx){
  this.pause = false;
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

GameView.SOUND_CONTROLS ={
  "m": "mute"
};

GameView.prototype.muteUnmute = function () {
  let muteButton = $('.mute-button');
  if(muteButton.text() === "Mute"){
    this.bgMusic.stop();
    this.game.muteSounds = true;
    muteButton.text("Play Music");
  }else{
    this.bgMusic.play();
    this.game.muteSounds = false;
    muteButton.text("Mute");
  }
};
GameView.prototype.addEventListeners = function(){
  window.addEventListener("keydown", (e)=>{
    // e.preventDefault();
    if(GameView.SOUND_CONTROLS[e.key]){
      if(GameView.SOUND_CONTROLS[e.key] === "mute"){
        this.muteUnmute();
      }
    }else if(e.key == "p"){
      if(this.pause){
        $(".pause-menu").removeClass('active');
        this.pause = false;
      }else{
        $(".pause-menu").addClass('active');
        this.pause = true;
      }
    }
    this.keysPressed[e.key] = true;
  });
  window.addEventListener("keyup", (e)=>{
    // e.preventDefault();
    delete this.keysPressed[e.key];
  });

  $('.mute-button').click( (e) =>{
    e.preventDefault();
    this.muteUnmute();

  });
};

GameView.prototype.checkKeys = function(){
  this.ship.drawBooster = false;
  if(this.game.gameOver){
    window.clearInterval(this.gameInterval);
    $(".game-over").addClass('active');
    $(".try-again").addClass('active');
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
};


GameView.prototype.start = function (options = {}) {
  if(!options.restart){
    this.addEventListeners();
    this.bgMusic = new Sound("./media/QziF-toby fox - UNDERTALE Soundtrack - 100 MEGALOVANIA longer.mp3", {repeat: true});

    this.bgMusic.play();
    this.keysPressed = {};
    this.lastFireTime = 0;
  }

  this.gameInterval = window.setInterval(()=>{
    if(!this.pause){

      this.checkKeys();
      this.game.step();
      this.game.draw(this.ctx);
    }

  }, 20);
};

module.exports = GameView;
