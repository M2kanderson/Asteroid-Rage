
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
