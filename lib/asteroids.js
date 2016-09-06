const Game = require("./game.js");
const GameView = require("./game_view.js");

document.addEventListener("DOMContentLoaded", () =>{
  let el = document.getElementById("game-canvas");
  el.width = Game.DIM_X;
  el.height = Game.DIM_Y;
  const ctx = el.getContext("2d");
  const game = new Game();
  new GameView(game, ctx).start();
});
