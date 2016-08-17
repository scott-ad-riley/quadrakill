var MapWeapon = require('../models/MapWeapon');
var MapItem = require('../models/MapItem');

var MapItemFactory = {
  weapon: {
    //x,y,weaponNum,reloadDelay,bulletCount,damage,image
    assault: function (x, y) {
      return new MapWeapon(x, y, 2, 50, 30, 0.5, "sprites/items/gun2.png");
    },
    shotgun: function (x, y) {
      return new MapWeapon(x, y, 3, 600, 8, 2, "sprites/items/gun3.png");
    }
  },
  item: {
    //x,y,health,armour,effect,respawnTime,image
    health: function (x, y) {
      return new MapItem(x, y, 4, 0, 1, 4000, "sprites/items/health.png");
    },
    overshield: function (x, y) {
      return new MapItem(x, y, 0, 4, 1, 7000, "sprites/items/overshield.png");
    },
    speedBoost: function (x, y) {
      return new MapItem(x, y, 0, 0, 2, 10000, "sprites/items/overshield.png");
    },
    cloak: function (x, y) {
      return new MapItem(x, y, 0, 0, 3, 10000, "sprites/items/overshield.png");
    }
  }
}

module.exports = MapItemFactory;
