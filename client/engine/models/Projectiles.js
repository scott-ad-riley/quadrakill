var intersects = require('../utils/intersects');
var Projectiles = function (imagePath) {
  this.items = [];
  this.image = new Image();
  this.image.src = imagePath;
}

Projectiles.prototype = {
  render: function (ctx) {
    for(var i=0;i<this.items.length;i++){
      ctx.drawImage(this.image,this.items[i].x,this.items[i].y)
      // console.log("render bullet with",this.items[i].x, this.items[i].y)
    }
  },
  detectWallCollisions: function(wallData) {
    var bulletsToCheck = this.items.slice(0);
    this.items = [];
    var hasCollided;
    for(let i=0;i<bulletsToCheck.length;i++){
      hasCollided = false;
      for(let j=0;j<wallData.length;j++){
      if (intersects(wallData[j], bulletsToCheck[i], {
          left: 8,
          right: 30,
          top: 8,
          bottom: 30 
        })
      ) {
          hasCollided = true;
        }
      }
      if (!hasCollided) {
        this.items.push(bulletsToCheck[i]);
      };
    }
  },
  detectOffCanvas: function (canvasHeight, canvasWidth) {
    var bulletsToCheck = this.items.slice(0);
    this.items = [];
    for(var i=0;i<bulletsToCheck.length;i++){
      if(!(bulletsToCheck[i].x>canvasWidth+60) && !(bulletsToCheck[i].x<-60) && !(bulletsToCheck[i].y>canvasHeight) && !(bulletsToCheck[i].y<0)){
        this.items.push(bulletsToCheck[i]);
      }
    }
  },
  detectPlayerCollisions: function (playersData) {
    var bulletsToCheck = this.items.slice(0);
    this.items = [];
    var hasCollided;
    for(let i=0;i<bulletsToCheck.length;i++){
      hasCollided = false;
      for (let eachPlayer in playersData) {
        let p = playersData[eachPlayer];
        if (bulletsToCheck[i].owner.id !== p.id && !p.invincible) {
          if (intersects(p, bulletsToCheck[i], {
              left: 8,
              right: 30,
              top: 8,
              bottom: 30 
            })
          ) {
              hasCollided = true;
            }
        }
      }
      if (!hasCollided) {
        this.items.push(bulletsToCheck[i]);
      };
        
    }
  }
}

module.exports = Projectiles;