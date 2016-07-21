var mapNum = require('../config/defaults').mapNum;
var MapTiles = function (mapData) {
  this.data = mapData;
  this.tile0 = new Image();
  this.tile0.src = "sprites/tiles/steps1.png";
  this.tile11 = new Image();
  this.tile11.src = "sprites/tiles/lava1.png";
}


MapTiles.prototype = {
  render: function (xPos, yPos, ctx) {
    for(let i=0 ; i < this.data[mapNum].length; i+=1){
      for(let j=0 ; j < this.data[mapNum][i].length; j+=1){
        if(this.data[mapNum][i][j] == 0){
          ctx.drawImage(this.tile0,xPos,yPos);
        }
        if(this.data[mapNum][i][j] == 11){
          ctx.drawImage(this.tile11,xPos,yPos);
        }
        xPos += 32;
      }
      xPos = 0;
      yPos+=32;
    }
  }
}

module.exports = MapTiles;