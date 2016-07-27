var MapItem = function (x, y, health, armour, effect, respawnTime, image) {
  this.x = x;
  this.y = y;
  this.health = health;
  this.armour = armour;
  this.effect = effect;
  this.respawnTime = respawnTime;
  this.isItem = true;
  this.active = true;
  this.image = image;
  this.id = null;
}

MapItem.prototype = {
  restock: function (respawnTime) {
    setTimeout(() => {this.active = true}, respawnTime);
  }
}

module.exports = MapItem;