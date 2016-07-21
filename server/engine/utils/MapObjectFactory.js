var Wall = require('../models/Wall');
var MapObject = require('../models/MapObject');

var MapObjectFactory = {

  wall: function (x, y) {
    return new Wall(x, y);
  },

  dynamic: {
    ice: function (x, y) {
      return new MapObject(x, y, 0, 1.5)
    },
    lava: function (x, y) {
      return new MapObject(x, y, 10, 0);
    },
    mud: function (x, y) {
      return new MapObject(x, y, 0, 0.5);
    }
    
  }
}
module.exports = MapObjectFactory;