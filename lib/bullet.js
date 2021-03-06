const Util = require("./utils.js");
const MovingObject = require("./moving_object.js");
const Asteroid = require("./asteroid.js");
const Explosion = require("./explosion.js");
const Sound = require("./sound");

const DEFAULTS = {
  COLOR: "#ffffff",
  RADIUS: 2,
  SPEED: 10
};

const Bullet = function(options){
  if(!options.game.muteSounds){
    this.sound = new Sound("./media/Laser_Blast.mp3",{volume: 0.1});
    this.sound.play();
  }
  options.pos = options.pos;
  options.color = DEFAULTS.COLOR;
  options.radius = DEFAULTS.RADIUS;
  options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);
  MovingObject.call(this, options);
};

Util.inherits(Bullet, MovingObject);

Bullet.prototype.isWrappable = false;

Bullet.prototype.collideWith = function (otherObject) {
  if((otherObject) instanceof Asteroid){
    otherObject.life -= 1;
    if(otherObject.life <=0){
      this.game.explosions.push(new Explosion(otherObject.pos[0], otherObject.pos[1], this.game));
      if(otherObject.radius > 15){
        for(let i = 0; i < 2; i++){
          let options = {pos : otherObject.pos, game : this.game, radius : otherObject.radius/2, speedMultiplier : this.game.speedMultiplier};
          this.game.asteroids.push( new Asteroid(options));
        }
      }
      this.game.remove(otherObject);
    }
    this.game.remove(this);
  }
};

module.exports = Bullet;
