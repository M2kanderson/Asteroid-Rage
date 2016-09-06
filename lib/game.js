const Asteroid = require("./asteroid.js");

const Game = function(){
  this.asteroids = [];
  this.addAsteroids();
};

Game.DIM_X = 1200;
Game.DIM_Y = 600;
Game.NUM_ASTEROIDS = 4;

Game.prototype.addAsteroids = function(){
  for(let i = 0; i < Game.NUM_ASTEROIDS; i++){
    let options = {pos : this.randomPosition(), game : this};
    this.asteroids.push( new Asteroid(options));
  }
};

Game.prototype.randomPosition = function () {
  let randx = Math.random() * Game.DIM_X;
  let randy = Math.random() * Game.DIM_Y;
  return [randx, randy];
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  this.asteroids.forEach((asteroid) => {
    asteroid.draw(ctx);
  });
};

Game.prototype.moveObjects = function () {
  this.asteroids.forEach((asteroid) => {
    asteroid.move();
  });
};

Game.prototype.wrap = function(pos, radius){
  let x = pos[0];
  let y = pos[1];
  if(x >= Game.DIM_X + radius){
    x = -radius;
  }
  else if(x <= -radius){
    x = Game.DIM_X + radius;
  }
  if(y >= Game.DIM_Y + radius){
    y = -radius;
  }
  else if(y <= -radius){
    y = Game.DIM_Y + radius;
  }
  return [x,y];
};

Game.prototype.checkCollisions = function () {
  for(let i = 0; i < this.asteroids.length; i++){
    let currentAsteroid = this.asteroids[i];
    for(let j = i + 1; j < this.asteroids.length; j++){
      let otherAsteroid = this.asteroids[j];
      if(currentAsteroid.isCollidedWith(otherAsteroid)){
        currentAsteroid.collideWith(otherAsteroid);
      }
    }
  }
};

Game.prototype.remove = function (asteroid) {
  let index = this.asteroids.indexOf(asteroid);
  this.asteroids.splice(index, 1);
};

Game.prototype.step = function () {
  this.moveObjects();
  this.checkCollisions();
};

module.exports = Game;
