const Particle = require("./particle");
const Sound = require("./sound");
const particles = [];

function randomFloat(min, max){
  return min + Math.random()*(max-min);
}

const createBasicExplosion = function(x,y,color,game){
  this.sound = new Sound("./media/Explosion.mp3",{volume: 0.1});
  this.sound.play();
  this.pos = [x,y];
  this.game = game;
  let minSize = 10;
  let maxSize = 30;
  let count = 10;
  let minSpeed = 40.0;
  let maxSpeed = 150.0;
  let minScaleSpeed = 0.5;
  let maxScaleSpeed = 2.0;
  for(let angle = 0; angle < 360; angle += Math.round(360/count)){
    let particle = new Particle();
    particle.x = x;
    particle.y = y;
    particle.radius = randomFloat(minSize, maxSize);
    particle.color = color;
    particle.scaleSpeed = randomFloat(minScaleSpeed, maxScaleSpeed);
    let speed = randomFloat(minSpeed, maxSpeed);
    particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
    particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);
    // console.log(particle);
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
