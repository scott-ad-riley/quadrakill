var MapObject = function(x,y, speedModifier, fricModifier, accelModifier, damage){
  this.x = x;
  this.y = y;
  this.speedModifier = speedModifier;
  this.fricModifier = fricModifier;
  this.accelModifier = accelModifier;
  this.damage = damage;
  this.isPassable = true;
}

module.exports = MapObject;