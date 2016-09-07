const MovingObject = require("./moving_object.js");
const Util = require("./utils.js");
const Asteroid = require("./asteroid.js");

const DEFAULTS = {
  COLOR: "#3399ff",
  RADIUS: 15,
};

const Ship = function(options){
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
  console.log("ship colliding!");
  if((otherObject) instanceof Asteroid.constructor){
    this.relocate();
    return true;
  }
};

module.exports = Ship;
