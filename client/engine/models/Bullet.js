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
    if(this.x > 766){
      this.x = -26
    }
    if(this.x < -28){
      this.x = 764
    }
  },
}
module.exports = Bullet;