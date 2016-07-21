var Bullet = function(values, owner, damage){
  this.x = values.player.x;
  this.y = values.player.y;
  this.hsp = values.speed.hsp;
  this.vsp = values.speed.vsp;
  this.owner = owner;
  this.damage = damage;
}

Bullet.prototype = {
  move: function(){
    this.x += this.hsp;
    this.y += this.vsp;
  },
}
module.exports = Bullet;