var MapWeapon = require('../models/MapWeapon');
var MapItem = require('../models/MapItem');

var MapItemFactory = {
  weapon: {
    assault: function (x, y) {
      return new MapWeapon(x, y, 2, 50, 30, 0.5);
    },
    shotgun: function (x, y) {
      return new MapWeapon(x, y, 3, 600, 8, 2);
    }
  },
  item: {
    health: function (x, y) {
      return new MapItem(x, y, 4);
    }, 
    overshield: function (x, y) {
      return new MapItem(x, y, 8);
    }
  }
}

module.exports = MapItemFactory;