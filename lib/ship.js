const Util = require("./utils.js");
const MovingObject = require("./moving_object.js");
const Asteroid = require("./asteroid.js");
const Bullet = require("./bullet.js");
// const Explosion = require("./explosion.js");
const Explosion2 = require("./explosion2.js");

const DEFAULTS = {
  COLOR: "#3399ff",
  RADIUS: 15,
};

const Ship = function(options){
  this.invulnerableTime = 2000;
  this.drawBooster = false;
  this.lives = 3;
  this.rotation = 0;
  options.vel = [0,0];
  options.color = DEFAULTS.COLOR;
  options.radius = DEFAULTS.RADIUS;
  MovingObject.call(this, options);
};


Util.inherits(Ship, MovingObject);

Ship.prototype.draw = function (ctx) {
  ctx.save();
  if(this.invulnerableTime > 0){
    this.invulnerableTime -= 20;
    ctx.fillStyle = 'rgba(200,255,51,0.6)';
  }else{
    ctx.fillStyle = '#99ff33';
  }

  ctx.translate(this.pos[0], this.pos[1]);
  ctx.rotate(this.rotation * Math.PI/180);
  ctx.beginPath();
  ctx.moveTo(0 + this.radius,0 + this.radius);
  ctx.lineTo(0 - this.radius,0 + this.radius);
  ctx.lineTo(0, 0 - this.radius);
  ctx.fill();
  ctx.closePath();
  if(this.drawBooster){
    ctx.fillStyle = 'red';
    ctx.fillRect(-this.radius/4,this.radius,this.radius/2,this.radius);
  }

  ctx.restore();
};

Ship.prototype.relocate = function () {
  this.pos = this.game.randomPosition();
  this.vel = [0,0];
};

Ship.prototype.collideWith = function (otherObject) {
  if( otherObject instanceof Asteroid ){
    if(this.invulnerableTime <= 0){
      this.lives -= 1;
      this.game.explosions.push(new Explosion2(this.pos[0], this.pos[1], "#525252", this.game));
      this.game.explosions.push(new Explosion2(this.pos[0], this.pos[1], "#FFA318", this.game));
      if(this.lives <= 0){
        this.game.gameOver = true;
      }else{
        this.invulnerableTime = 2000;
        this.relocate();
      }
      return true;
    }
  }
};

Ship.prototype.power = function (move) {
  let yMove = move[1] * Math.cos(this.rotation * Math.PI/180);
  let xMove = -move[1] * Math.sin(this.rotation * Math.PI/180);
  let x = Math.abs(this.vel[0] + xMove) < 20 ? this.vel[0] + xMove: this.vel[0];
  let y = Math.abs(this.vel[1] + yMove) < 20 ? this.vel[1] + yMove: this.vel[1];
  this.vel = [x, y];
};

Ship.prototype.fireBullet = function () {
  let shipSpeed = Math.sqrt(Math.pow(this.vel[0], 2) + Math.pow(this.vel[1], 2));

  let velx = 10 * Math.sin(this.rotation * Math.PI/180) + this.vel[0];
  let vely = -10 * Math.cos(this.rotation * Math.PI/180) + this.vel[1];


  let options = {pos : this.pos, vel : [velx, vely], game : this.game};
  let bullet = new Bullet(options);
  this.game.bullets.push(bullet);
};

Ship.prototype.rotate = function(rotation){
  this.rotation += rotation;
};

Ship.prototype.drawBooster = function (ctx) {
  ctx.save();
  ctx.translate(this.pos[0], this.pos[1]);
  ctx.rotate(this.rotation * Math.PI/180);
  ctx.fillStyle = 'red';
  // ctx.beginPath();
  ctx.moveTo(0 + this.radius/2,0 + this.radius);
  // console.log([0 + this.radius/2,0 + this.radius]);
  ctx.lineTo(0 - this.radius/2,0 + this.radius);
  // console.log([0 - this.radius/2,0 + this.radius]);
  ctx.lineTo(0 - this.radius/2,3 + this.radius);
  // console.log([0 - this.radius/2,3 + this.radius]);
  // ctx.lineTo(0 + this.radius/2,3 + this.radius);
  // console.log([0 + this.radius/2,3 + this.radius]);
  ctx.fill();
  ctx.closePath();
  ctx.fillRect(0,0,100,100);
  ctx.restore();
};

module.exports = Ship;
