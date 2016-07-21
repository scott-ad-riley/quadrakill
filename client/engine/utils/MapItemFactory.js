var MapWeapon = require('../models/MapWeapon');
var MapItem = require('../models/MapItem');

var MapItemFactory = {
  weapon: {
    assault: function (x, y) {
      return new MapWeapon(x, y, 2, 50, 30, 0.5, "sprites/items/gun2.png");
    },
    shotgun: function (x, y) {
      return new MapWeapon(x, y, 3, 600, 8, 2, "sprites/items/gun3.png");
    }
  },
  item: {
    health: function (x, y) {
      return new MapItem(x, y, 4, "sprites/items/health.png");
    }, 
    overshield: function (x, y) {
      return new MapItem(x, y, 8, "sprites/items/overshield.png");
    }
  }
}

module.exports = MapItemFactory;