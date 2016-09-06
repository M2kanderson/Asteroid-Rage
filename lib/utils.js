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
