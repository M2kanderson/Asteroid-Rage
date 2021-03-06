/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const GameView = __webpack_require__(11);
	
	document.addEventListener("DOMContentLoaded", () =>{
	  let el = document.getElementById("game-canvas");
	  el.width = Game.DIM_X;
	  el.height = Game.DIM_Y;
	  const ctx = el.getContext("2d");
	
	  let game = new Game();
	  let view = new GameView(game, ctx);
	  $(".start-game").click(() =>{
	    view.start();
	    $(".start-menu").removeClass('active');
	  });
	  $(".try-again").click(() =>{
	    game.gameOver = false;
	    game.asteroids = [];
	    game.explosions = [];
	    game.bullets = [];
	    game.speedMultiplier = 1;
	    game.level = 1;
	    game.addAsteroids();
	    game.ship.lives = 5;
	    game.ship.invulnerableTime = 2000;
	    game.ship.relocate();
	    $(".game-over").removeClass('active');
	    view.start({restart: true});
	  });
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Asteroid = __webpack_require__(2);
	const Ship = __webpack_require__(5);
	const Bullet = __webpack_require__(6);
	const Explosion = __webpack_require__(7);
	
	
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
	  if(this.asteroids.length <= 0){
	    this.level += 1;
	    $(".lives-number").text(this.lives);
	    this.speedMultiplier = this.level * 0.75;
	    this.levelIncrementPause = true;
	    $(".level-number").text(this.level);
	    $(".level").addClass('level-active');
	    window.setTimeout(() => {
	      $(".level").removeClass('level-active');
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const MovingObject = __webpack_require__(4);
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


/***/ },
/* 3 */
/***/ function(module, exports) {

	const Util = {
	  inherits(childClass, parentClass){
	    function Surrogate() { this.constructor = childClass;}
	    Surrogate.prototype = parentClass.prototype;
	    childClass.prototype = new Surrogate();
	  },
	  randomVec(length){
	
	    let xDir = Math.random() < 0.5 ? -1 : 1;
	    let yDir = Math.random() < 0.5 ? -1 : 1;
	
	    let randx = xDir*Math.random() * length;
	    let randy = yDir*Math.sqrt(Math.pow(length, 2) - Math.pow(randx, 2));
	    return [randx, randy];
	  }
	};
	
	module.exports = Util;


/***/ },
/* 4 */
/***/ function(module, exports) {

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
	  ctx.strokeStyle = '#fff';
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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const MovingObject = __webpack_require__(4);
	const Asteroid = __webpack_require__(2);
	const Bullet = __webpack_require__(6);
	// const Explosion = require("./explosion.js");
	const Explosion2 = __webpack_require__(10);
	
	const DEFAULTS = {
	  COLOR: "#3399ff",
	  RADIUS: 15,
	};
	
	const Ship = function(options){
	  this.invulnerableTime = 2000;
	  this.drawBooster = false;
	  this.lives = 5;
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
	      $(".lives-number").text(this.lives);
	      this.game.explosions.push(new Explosion2(this.pos[0], this.pos[1], "#525252", this.game));
	      this.game.explosions.push(new Explosion2(this.pos[0], this.pos[1], "#FFA318", this.game));
	      if(this.lives < 0){
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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const MovingObject = __webpack_require__(4);
	const Asteroid = __webpack_require__(2);
	const Explosion = __webpack_require__(7);
	const Sound = __webpack_require__(9);
	
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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const Particle = __webpack_require__(8);
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


/***/ },
/* 8 */
/***/ function(module, exports) {

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


/***/ },
/* 9 */
/***/ function(module, exports) {

	
	function sound(src, options = {}) {
	    this.sound = document.createElement("audio");
	    this.sound.src = src;
	    this.sound.setAttribute("preload", "auto");
	    this.sound.setAttribute("controls", "none");
	    this.sound.style.display = "none";
	    this.sound.volume = options.volume || 1;
	    this.repeat = options.repeat || false;
	    document.body.appendChild(this.sound);
	    if(this.repeat){
	      this.sound.addEventListener('ended', function() {
	        this.currentTime = 0;
	        this.play();
	      }, false);
	    }
	
	    this.play = function(){
	        this.sound.play();
	    };
	    this.stop = function(){
	        this.sound.pause();
	    };
	}
	
	module.exports = sound;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	const Particle = __webpack_require__(8);
	const Sound = __webpack_require__(9);
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


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const Sound = __webpack_require__(9);
	
	const GameView = function(game, ctx){
	  this.pause = false;
	  this.game = game;
	  this.ctx = ctx;
	  this.ship = this.game.addShip();
	};
	
	GameView.MOVES = {
	  "w": [ 0, -0.5],
	  // "a": [-1,  0],
	  "s": [ 0,  0.5],
	  // "d": [ 1,  0],
	};
	
	GameView.ROTATION = {
	  "a": -10,
	  "d": 10
	};
	
	GameView.SOUND_CONTROLS ={
	  "m": "mute"
	};
	
	GameView.prototype.muteUnmute = function () {
	  let muteButton = $('.mute-button');
	  if(muteButton.text() === "Mute"){
	    this.bgMusic.stop();
	    this.game.muteSounds = true;
	    muteButton.text("Play Music");
	  }else{
	    this.bgMusic.play();
	    this.game.muteSounds = false;
	    muteButton.text("Mute");
	  }
	};
	GameView.prototype.addEventListeners = function(){
	  window.addEventListener("keydown", (e)=>{
	    // e.preventDefault();
	    if(GameView.SOUND_CONTROLS[e.key]){
	      if(GameView.SOUND_CONTROLS[e.key] === "mute"){
	        this.muteUnmute();
	      }
	    }else if(e.key == "p"){
	      if(this.pause){
	        $(".pause-menu").removeClass('active');
	        this.pause = false;
	      }else{
	        $(".pause-menu").addClass('active');
	        this.pause = true;
	      }
	    }
	    this.keysPressed[e.key] = true;
	  });
	  window.addEventListener("keyup", (e)=>{
	    // e.preventDefault();
	    delete this.keysPressed[e.key];
	  });
	
	  $('.mute-button').click( (e) =>{
	    e.preventDefault();
	    this.muteUnmute();
	
	  });
	};
	
	GameView.prototype.checkKeys = function(){
	  this.ship.drawBooster = false;
	  if(this.game.gameOver){
	    window.clearInterval(this.gameInterval);
	    $(".game-over").addClass('active');
	  }
	  Object.keys(this.keysPressed).forEach((key) =>{
	    let move = GameView.MOVES[key];
	    let rotation = GameView.ROTATION[key];
	    if(move){
	      this.ship.power(move);
	      this.ship.drawBooster = true;
	    }
	    if(rotation){
	      this.ship.rotate(rotation);
	    }
	
	    if(key === " " && new Date - this.lastFireTime >= 200){
	      this.lastFireTime = new Date();
	      this.ship.fireBullet();
	    }
	
	  });
	};
	
	
	GameView.prototype.start = function (options = {}) {
	  $(".lives-number").text(this.ship.lives);
	  $(".lives").addClass('active');
	  if(!options.restart){
	    this.addEventListeners();
	    this.bgMusic = new Sound("./media/QziF-toby fox - UNDERTALE Soundtrack - 100 MEGALOVANIA longer.mp3", {repeat: true});
	
	    this.bgMusic.play();
	    this.keysPressed = {};
	    this.lastFireTime = 0;
	  }
	
	  this.gameInterval = window.setInterval(()=>{
	    if(!this.pause){
	
	      this.checkKeys();
	      this.game.step();
	      this.game.draw(this.ctx);
	    }
	
	  }, 20);
	};
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map