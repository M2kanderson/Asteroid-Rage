const Game = require('./game.js');

const GameView = function(game, ctx){
  this.game = game;
  this.ctx = ctx;
};

GameView.prototype.start = function () {
  window.setInterval(()=>{
    this.game.step();
    this.game.draw(this.ctx);
  }, 20);
};

module.exports = GameView;
