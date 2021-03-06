const Util = require("./utils.js");
const MovingObject = require("./moving_object.js");
// const Ship = require("./ship.js");


const DEFAULTS = {
  COLOR: "#505050",
  RADIUS: 60,
  SPEED: 2
};

const Asteroid = function(options){
  this.life = 3;
  options.pos = options.pos;
  options.color = DEFAULTS.COLOR;
  options.radius = options.radius || DEFAULTS.RADIUS;
  options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED * options.speedMultiplier || DEFAULTS.SPEED);
  MovingObject.call(this, options);
};

Util.inherits(Asteroid, MovingObject);


// Asteroid.prototype.collideWith = function (otherObject) {
//   if((otherObject) instanceof Ship.constructor){
//     Ship.relocate();
//     return true;
//   }
// };


module.exports = Asteroid;
