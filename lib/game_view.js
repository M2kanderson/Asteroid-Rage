const Game = require('./game.js');

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

GameView.prototype.bindKeyHandlers = function () {
  const ship = this.ship;

  Object.keys(GameView.MOVES).forEach((k) => {
    let move = GameView.MOVES[k];
    let rotation = GameView.ROTATION[k];
    key(k, function () {
      ship.power(move);
      ship.rotate(rotation);
    });
  });

  key("space", function () { ship.fireBullet() });
};

GameView.prototype.start = function () {
  // this.bindKeyHandlers();
  this.keysPressed = {};
  this.lastFireTime = 0;
  window.addEventListener("keydown", (e)=>{
    this.keysPressed[e.key] = true;
  });
  window.addEventListener("keyup", (e)=>{
    delete this.keysPressed[e.key];
  });

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
