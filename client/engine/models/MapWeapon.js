var MapWeapon = function (x, y, weaponNum, reloadDelay, bulletCount, damage, image) {
  this.x = x;
  this.y = y;
  this.weaponNum = weaponNum;
  this.reloadDelay = reloadDelay;
  this.bulletCount = bulletCount;
  this.damage = damage;
  this.isWeapon = true;
  this.active = true;
  this.image = image;
  this.id = null;
}

MapWeapon.prototype = {
  restock: function () {
    setTimeout(() => {this.active = true}, 10000);
  }
}

module.exports = MapWeapon;