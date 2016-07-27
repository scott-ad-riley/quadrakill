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
    //x,y,health,armour,effect,respawnTime,image
    health: function (x, y) {
      return new MapItem(x, y, 4, 0, 1, 10000);
    }, 
    overshield: function (x, y) {
      return new MapItem(x, y, 0, 4, 1, 10000);
    },
    speedBoost: function (x, y) {
      return new MapItem(x, y, 0, 0, 2, 10000);
    },
    cloak: function (x, y) {
      return new MapItem(x, y, 0, 0, 3, 10000);
    }
  }
}

module.exports = MapItemFactory;