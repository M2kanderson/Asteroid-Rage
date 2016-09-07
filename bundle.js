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
	const GameView = __webpack_require__(5);
	
	document.addEventListener("DOMContentLoaded", () =>{
	  let el = document.getElementById("game-canvas");
	  el.width = Game.DIM_X;
	  el.height = Game.DIM_Y;
	  const ctx = el.getContext("2d");
	  const game = new Game();
	  new GameView(game, ctx).start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Asteroid = __webpack_require__(2);
	const Ship = __webpack_require__(6);
	const Bullet = __webpack_require__(7);
	
	
	const Game = function(){
	  this.gameOver = false;
	  this.asteroids = [];
	  this.bullets = [];
	  this.addAsteroids();
	};
	
	Game.DIM_X = 1200;
	Game.DIM_Y = 600;
	Game.NUM_ASTEROIDS = 6;
	
	Game.prototype.addAsteroids = function(){
	  for(let i = 0; i < Game.NUM_ASTEROIDS; i++){
	    let options = {pos : this.randomPosition(), game : this};
	    this.asteroids.push( new Asteroid(options));
	  }
	};
	
	Game.prototype.addShip = function () {
	  let options = {pos : this.randomPosition(), game : this};
	  this.ship = new Ship(options);
	  return this.ship;
	};
	
	Game.prototype.randomPosition = function () {
	  let randx = Math.random() * Game.DIM_X;
	  let randy = Math.random() * Game.DIM_Y;
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
	      }
	    }
	  }
	};
	
	Game.prototype.remove = function (object) {
	  if (object instanceof Bullet) {
	    this.bullets.splice(this.bullets.indexOf(object), 1);
	  } else if (object instanceof Asteroid) {
	    this.asteroids.splice(this.asteroids.indexOf(object), 1);
	  } else if (object instanceof Ship) {
	    this.ships.splice(this.ships.indexOf(object), 1);
	  }
	};
	
	Game.prototype.step = function () {
	  this.moveObjects();
	  this.checkCollisions();
	};
	
	Game.prototype.allObjects = function () {
	  let objects = [this.ship].concat(this.bullets);
	  this.asteroids.forEach((asteroid) => {
	    objects.push(asteroid);
	  });
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
	  RADIUS: 40,
	  SPEED: 2
	};
	
	const Asteroid = function(options){
	  this.life = 3;
	  options.pos = options.pos;
	  options.color = DEFAULTS.COLOR;
	  options.radius = options.radius || DEFAULTS.RADIUS;
	  options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);
	  MovingObject.call(this, options);
	};
	
	Util.inherits(Asteroid, MovingObject);
	
	
	// Asteroid.prototype.collideWith = function (otherObject) {
	//   if((otherObject) instanceof Ship.constructor){
	//     Ship.relocate();
	//     return true;
	//   }
	// };
	
	Asteroid.prototype.hello = function(){
	  console.log("hello");
	};
	
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

	const Game = __webpack_require__(1);
	
	const GameView = function(game, ctx){
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
	
	GameView.prototype.bindKeyHandlers = function () {
	  const ship = this.ship;
	
	  Object.keys(GameView.MOVES).forEach((k) => {
	    let move = GameView.MOVES[k];
	    let rotation = GameView.ROTATION[k];
	    key(k, function () {
	      ship.power(move);
	      ship.rotate(rotation);
	    });
	  });
	
	  key("space", function () { ship.fireBullet() });
	};
	
	GameView.prototype.start = function () {
	  // this.bindKeyHandlers();
	  this.keysPressed = {};
	  this.lastFireTime = 0;
	  window.addEventListener("keydown", (e)=>{
	    this.keysPressed[e.key] = true;
	  });
	  window.addEventListener("keyup", (e)=>{
	    delete this.keysPressed[e.key];
	  });
	
	  this.gameInterval = window.setInterval(()=>{
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
	
	      if(key === " " && new Date - this.lastFireTime >= 300){
	        this.lastFireTime = new Date();
	        this.ship.fireBullet();
	      }
	    });
	    this.game.step();
	    this.game.draw(this.ctx);
	  }, 20);
	};
	
	module.exports = GameView;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const MovingObject = __webpack_require__(4);
	const Asteroid = __webpack_require__(2);
	const Bullet = __webpack_require__(7);
	
	const DEFAULTS = {
	  COLOR: "#3399ff",
	  RADIUS: 15,
	};
	
	const Ship = function(options){
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
	  ctx.translate(this.pos[0], this.pos[1]);
	  ctx.rotate(this.rotation * Math.PI/180);
	  // ctx.fillStyle = this.color;
	  // ctx.beginPath();
	  // ctx.arc(0, 0, this.radius, 0, 2 * Math.PI, false);
	  //
	  // ctx.fill();
	  // ctx.closePath();
	
	  ctx.fillStyle = '#99ff33';
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
	  // if(shipSpeed > 0){
	  //   let velxRatio = this.vel[0]/shipSpeed;
	  //   let velyRatio = this.vel[1]/shipSpeed;
	  //   velx = this.vel[0] + 10*velxRatio;
	  //   vely = this.vel[1] + 10*velyRatio;
	  // }
	
	
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const MovingObject = __webpack_require__(4);
	const Asteroid = __webpack_require__(2);
	
	const DEFAULTS = {
	  COLOR: "#ffffff",
	  RADIUS: 2,
	  SPEED: 10
	};
	
	const Bullet = function(options){
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
	      if(otherObject.radius > 10){
	        for(let i = 0; i < 2; i++){
	          let options = {pos : otherObject.pos, game : this.game, radius : otherObject.radius/2};
	          this.game.asteroids.push( new Asteroid(options));
	        }
	      }
	      this.game.remove(otherObject);
	    }
	    this.game.remove(this);
	  }
	};
	
	module.exports = Bullet;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map