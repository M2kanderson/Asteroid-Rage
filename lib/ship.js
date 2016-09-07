const Util = require("./utils.js");
const MovingObject = require("./moving_object.js");
const Asteroid = require("./asteroid.js");
const Bullet = require("./bullet.js");

const DEFAULTS = {
  COLOR: "#3399ff",
  RADIUS: 15,
};

const Ship = function(options){
  this.lives = 3;
  options.vel = [0,0];
  options.color = DEFAULTS.COLOR;
  options.radius = DEFAULTS.RADIUS;
  MovingObject.call(this, options);
};


Util.inherits(Ship, MovingObject);

Ship.prototype.relocate = function () {
  this.pos = this.game.randomPosition();
  this.vel = [0,0];
};

Ship.prototype.collideWith = function (otherObject) {
  if( otherObject instanceof Asteroid ){
    this.lives -= 1;
    if(this.lives <= 0){
      this.game.gameOver = true;
    }else{
      this.relocate();
    }
    return true;
  }
};

Ship.prototype.power = function (move) {
  let x = this.vel[0] + move[0] < 20 ? this.vel[0] + move[0] : this.vel[0];
  let y = this.vel[1] + move[1] < 20 ? this.vel[1] + move[1] : this.vel[1];
  this.vel = [x, y];
};

Ship.prototype.fireBullet = function () {
  let shipSpeed = Math.sqrt(Math.pow(this.vel[0], 2) + Math.pow(this.vel[1], 2));
  let velx = 0;
  let vely = -10;
  if(shipSpeed > 0){
    let velxRatio = this.vel[0]/shipSpeed;
    let velyRatio = this.vel[1]/shipSpeed;
    velx = this.vel[0] + 10*velxRatio;
    vely = this.vel[1] + 10*velyRatio;
  }


  let options = {pos : this.pos, vel : [velx, vely], game : this.game};
  let bullet = new Bullet(options);
  this.game.bullets.push(bullet);
};

module.exports = Ship;
