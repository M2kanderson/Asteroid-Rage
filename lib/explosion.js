const Particle = require("./particle");
const particles = [];

const createBasicExplosion = function(x,y,game){
  this.pos = [x,y];
  this.game = game;
  for(let angle = 0; angle < 360; angle += 90){
    let particle = new Particle();

    particle.x = x;
    particle.y = y;

    particle.color = "#FF0000";

    let speed = 50.0;

    particle.velocityX = speed * Math.cos(angle * Math.PI/ 180);
    particle.velocityY = speed * Math.sin(angle * Math.PI/180);
    particles.push(particle);
  }
  window.setTimeout(() => {
    this.game.remove(this);
  }, 3000);
};

createBasicExplosion.prototype.move = function () {

};

createBasicExplosion.prototype.draw = function(ctx){
  particles.forEach((particle) =>{
    particle.draw(ctx);
  });
};

createBasicExplosion.prototype.isCollidedWith = function(otherObject){
  return false;
};

module.exports = createBasicExplosion;
