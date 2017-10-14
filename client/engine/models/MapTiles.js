var mapNum = require('../config/defaults').mapNum;
var MapTiles = function (mapData, tiles) {
  this.data = mapData;
  this.tileImages = {
    0: tiles.steps,
    11: tiles.plat,
    22: tiles.lava,
    33: tiles.sand,
    44: tiles.ice
  }
}


MapTiles.prototype = {
  render: function (xPos, yPos, ctx) {
    for (let i = 0; i < this.data.length; i += 1) {
      for (let j = 0; j < this.data[i].length; j += 1) {
        ctx.drawImage(this.tileImages[this.data[i][j]], xPos, yPos);
        xPos += 16;
      }
      xPos = 0;
      yPos += 16;
    }
  }
}

module.exports = MapTiles;
