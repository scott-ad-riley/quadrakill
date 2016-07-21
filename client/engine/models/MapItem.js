var MapItem = function (x, y, health, image) {
  this.x = x;
  this.y = y;
  this.health = health;
  this.isItem = true;
  this.active = true;
  this.image = image;
  this.id = null;
}

MapItem.prototype = {
  restock: function () {
    setTimeout(() => {this.active = true}, 10000);
  }
}

module.exports = MapItem;