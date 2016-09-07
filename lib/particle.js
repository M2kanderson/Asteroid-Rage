const Particle = function(){
  this.scale = 1.0;
  this.x = 0;
  this.y = 0;
  this.radius = 20;
  this.color = "#000";
  this.velocityX = 0;
  this.velocityY = 0;
  this.scaleSpeed = 0.5;

  this.update = function(ms = 20){
    this.scale -= this.scaleSpeed * ms/ 1000.0;
    if(this.scale <= 0){
      this.scale = 0;
    }
    this.x += this.velocityX * ms/1000.0;
    this.y += this.velocityY * ms/1000.0;
  };

  this.draw = function(ctx)
  {
    this.update();
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.scale, this.scale);
    ctx.beginPath();
    ctx.arc(0,0,this.radius,0, Math.PI*2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  };
};


module.exports = Particle;
