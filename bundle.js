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
	
	const Game = function(){
	  this.asteroids = [];
	  this.addAsteroids();
	};
	
	Game.DIM_X = 1200;
	Game.DIM_Y = 600;
	Game.NUM_ASTEROIDS = 4;
	
	Game.prototype.addAsteroids = function(){
	  for(let i = 0; i < Game.NUM_ASTEROIDS; i++){
	    let options = {pos : this.randomPosition(), game : this};
	    this.asteroids.push( new Asteroid(options));
	  }
	};
	
	Game.prototype.randomPosition = function () {
	  let randx = Math.random() * Game.DIM_X;
	  let randy = Math.random() * Game.DIM_Y;
	  return [randx, randy];
	};
	
	Game.prototype.draw = function (ctx) {
	  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	  this.asteroids.forEach((asteroid) => {
	    asteroid.draw(ctx);
	  });
	};
	
	Game.prototype.moveObjects = function () {
	  this.asteroids.forEach((asteroid) => {
	    asteroid.move();
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
	  for(let i = 0; i < this.asteroids.length; i++){
	    let currentAsteroid = this.asteroids[i];
	    for(let j = i + 1; j < this.asteroids.length; j++){
	      let otherAsteroid = this.asteroids[j];
	      if(currentAsteroid.isCollidedWith(otherAsteroid)){
	        currentAsteroid.collideWith(otherAsteroid);
	      }
	    }
	  }
	};
	
	Game.prototype.remove = function (asteroid) {
	  let index = this.asteroids.indexOf(asteroid);
	  this.asteroids.splice(index, 1);
	};
	
	Game.prototype.step = function () {
	  this.moveObjects();
	  this.checkCollisions();
	};
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const MovingObject = __webpack_require__(4);
	
	const DEFAULTS = {
	  COLOR: "#505050",
	  RADIUS: 25,
	  SPEED: 4
	};
	
	const Asteroid = function(options){
	  options.pos = options.pos;
	  options.color = DEFAULTS.COLOR;
	  options.radius = DEFAULTS.RADIUS;
	  options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);
	  MovingObject.call(this, options);
	};
	
	Util.inherits(Asteroid, MovingObject);
	
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
	  ctx.strokeStyle = '#003300';
	  ctx.stroke();
	  ctx.closePath();
	};
	
	MovingObject.prototype.move = function () {
	  let x = this.pos[0];
	  let y = this.pos[1];
	  let vx = this.vel[0];
	  let vy = this.vel[1];
	  this.pos = this.game.wrap([x + vx, y + vy], this.radius);
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
	  this.game.remove(otherObject);
	  this.game.remove(this);
	};
	
	module.exports = MovingObject;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	
	const GameView = function(game, ctx){
	  this.game = game;
	  this.ctx = ctx;
	};
	
	GameView.prototype.start = function () {
	  window.setInterval(()=>{
	    this.game.step();
	    this.game.draw(this.ctx);
	  }, 20);
	};
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map