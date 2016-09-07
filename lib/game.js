const Asteroid = require("./asteroid.js");
const Ship = require("./ship.js");

const Game = function(){
  this.asteroids = [];
  this.ship = this.addShip();
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

Game.prototype.addShip = function () {
  let options = {pos : this.randomPosition(), game : this};
  return new Ship(options);
};

Game.prototype.randomPosition = function () {
  let randx = Math.random() * Game.DIM_X;
  let randy = Math.random() * Game.DIM_Y;
  return [randx, randy];
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  this.allObjects().forEach((object) => {
    object.draw(ctx);
  });
};

Game.prototype.moveObjects = function () {
  this.allObjects().forEach((object) => {
    object.move();
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
  let objects = this.allObjects();
  for(let i = 0; i < objects.length; i++){
    let currentObject = objects[i];
    for(let j = i + 1; j < objects.length; j++){
      let otherObject = objects[j];
      if(currentObject.isCollidedWith(otherObject)){
        currentObject.collideWith(otherObject);
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

Game.prototype.allObjects = function () {
  let objects = [this.ship];
  this.asteroids.forEach((asteroid) => {
    objects.push(asteroid);
  });
  return objects;
};

module.exports = Game;
