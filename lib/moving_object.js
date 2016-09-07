function MovingObject(options){
  this.pos = options.pos;
  this.vel = options.vel;
  this.radius = options.radius;
  this.color = options.color;
  this.game = options.game;
}

MovingObject.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, false);

  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#003300';
  ctx.stroke();
  ctx.closePath();
};

MovingObject.prototype.isWrappable = true;

MovingObject.prototype.move = function () {
  let x = this.pos[0];
  let y = this.pos[1];
  let vx = this.vel[0];
  let vy = this.vel[1];
  this.pos = [x + vx, y + vy];
  if(this.game.isOutOfBounds(this.pos))
  {
    if(this.isWrappable){
      this.pos = this.game.wrap(this.pos, this.radius);
    }else{
      this.remove();
    }
  }

};

MovingObject.prototype.remove = function () {
  this.game.remove(this);
};

MovingObject.prototype.isCollidedWith = function (otherObject) {
  let x1 = this.pos[0];
  let y1 = this.pos[1];
  let x2 = otherObject.pos[0];
  let y2 = otherObject.pos[1];

  let distBetween = Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));
  return distBetween < (this.radius + otherObject.radius);
};

MovingObject.prototype.collideWith = function (otherObject) {
  // this.game.remove(otherObject);
  // this.game.remove(this);
};



module.exports = MovingObject;
