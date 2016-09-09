const Asteroid = require("./asteroid.js");
const Ship = require("./ship.js");
const Bullet = require("./bullet.js");
const Explosion = require("./explosion.js");


const Game = function(){
  this.level = 1;
  this.speedMultiplier = 1;
  this.levelIncrementPause = false;
  this.muteSounds = false;
  this.gameOver = false;
  this.asteroids = [];
  this.bullets = [];
  this.explosions = [];
  this.addAsteroids();
};

Game.DIM_X = 1200;
Game.DIM_Y = 600;
Game.NUM_ASTEROIDS = 6;

Game.prototype.addAsteroids = function(){
  let options;
  for(let i = 0; i < Game.NUM_ASTEROIDS; i++){
    options = {pos : this.randomPosition(), game : this, speedMultiplier: this.speedMultiplier};
    this.asteroids.push( new Asteroid(options));
  }
};

Game.prototype.addShip = function () {
  let options = {pos : this.randomPosition(), game : this};
  this.ship = new Ship(options);
  return this.ship;
};

Game.prototype.randomPosition = function () {
  let min = 100;
  let randx = min + (Math.random() * (Game.DIM_X-2*min));
  let randy = min + (Math.random() * (Game.DIM_Y-min));
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
        break;
      }
    }
  }
};

Game.prototype.remove = function (object) {
  if (object instanceof Bullet) {
    this.bullets.splice(this.bullets.indexOf(object), 1);
  } else if (object instanceof Asteroid) {
    this.asteroids.splice(this.asteroids.indexOf(object), 1);
  // } else if (object instanceof Ship) {
  //   this.ships.splice(this.ships.indexOf(object), 1);
  } else if(object instanceof Explosion){
    this.explosions.splice(this.explosions.indexOf(object), 1);
  }
};

Game.prototype.checkNewLevel = function () {
  // console.log(this.asteroids.length);
  if(this.asteroids.length <= 0){
    this.level += 1;
    $(".lives-number").text(this.lives);
    this.speedMultiplier = this.level * 0.75;
    this.levelIncrementPause = true;
    $(".level-number").text(this.level);
    $(".level").addClass('active');
    window.setTimeout(() => {
      $(".level").removeClass('active');
      this.addAsteroids();
      this.ship.invulnerableTime = 2000;
      this.ship.lives += 1;
      this.levelIncrementPause = false;
    }, 5000);
  }
};

Game.prototype.step = function () {
  if(!this.levelIncrementPause)
  {
    this.checkNewLevel();
  }
  this.moveObjects();
  this.checkCollisions();
};

Game.prototype.allObjects = function () {
  let objects = [this.ship].concat(this.bullets).concat(this.asteroids).concat(this.explosions);
  return objects;
};

Game.prototype.isOutOfBounds = function (pos) {
    let x = pos[0];
    let y = pos[1];
    return x < 0 || x > Game.DIM_X || y < 0 || y > Game.DIM_Y;
};

module.exports = Game;
