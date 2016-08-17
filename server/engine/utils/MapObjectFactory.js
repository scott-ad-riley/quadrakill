var Wall = require('../models/Wall');
var MapObject = require('../models/MapObject');

var MapObjectFactory = {

  wall: function (x, y) {
    return new Wall(x, y);
  },

  dynamic: {
    ice: function (x, y) {
      return new MapObject(x, y, 1.5, 0.025, 0.025, 0)
    },
    lava: function (x, y) {
      return new MapObject(x, y, 0, 0, 0, 2);
    },
    mud: function (x, y) {
      return new MapObject(x, y, 0.25, 1, 0.25, 0);
    }

  }
}
module.exports = MapObjectFactory;
