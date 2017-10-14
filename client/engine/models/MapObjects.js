var MapObjects = function (mapWallData, ObjectConstructors) {
  this.rawData = mapWallData;
  this.data = []
  var xPos = 0;
  var yPos = 0;
  for (let i = 0; i < this.rawData.length; i += 1) {
    for (let j = 0; j < this.rawData[i].length; j += 1) {
      if (this.rawData[i][j] !== 0) {
        var newObject = ObjectConstructors[this.rawData[i][j]](xPos, yPos);
        this.data.push(newObject);
      }
      xPos += 16;
    }
    xPos = 0;
    yPos += 16;
  }
  this.collideable = this.data.filter(function (mapObject) {
    return !mapObject.isPassable;
  })
  this.passable = this.data.filter(function (mapObject) {
    return mapObject.isPassable;
  })

}

MapObjects.prototype = {

}

module.exports = MapObjects;
