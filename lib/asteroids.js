const Game = require("./game.js");
const GameView = require("./game_view.js");

document.addEventListener("DOMContentLoaded", () =>{
  let el = document.getElementById("game-canvas");
  el.width = Game.DIM_X;
  el.height = Game.DIM_Y;
  const ctx = el.getContext("2d");

  let game = new Game();
  let view = new GameView(game, ctx);
  $(".start-game").click(() =>{
    view.start();
    $(".start-menu").removeClass('active');
  });
  $(".try-again").click(() =>{
    game.gameOver = false;
    game.asteroids = [];
    game.explosions = [];
    game.bullets = [];
    game.speedMultiplier = 1;
    game.level = 1;
    game.addAsteroids();
    game.ship.lives = 5;
    game.ship.invulnerableTime = 2000;
    game.ship.relocate();
    $(".game-over").removeClass('active');
    view.start({restart: true});
  });
});
