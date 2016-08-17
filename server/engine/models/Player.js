var intersects = require('../utils/intersects');
var bulletOffsets = require('../utils/bulletOffsets');
var Bullet = require('./Bullet');

var Player = function (x, y, id, number) {
  //CANVAS VARIABLES
  this.x = x;
  this.y = y;
  this.id = id;
  this.number = number;
  this.maxSpeed = 2.4;
  this.speedModifier = 1;
  this.accel =  0.1;
  this.fric =  0.1;
  this.hsp =  0;
  this.vsp =  0;
  this.dirH =  0;
  this.dirV =  0;
  this.health = 4;
  this.reloadDelay = 300;
  this.weaponNum = 1;
  this.bulletCount = 8;
  this.deathCount = 0;
  this.killCount = 0;
  this.attackDamage = 1;
  this.invincible = false;
  this.reloadTime = 1200;
  this.reloading = false;
  this.rotation = "up";
}

Player.prototype = {
  calculateMove: function (movement) {
    if((movement.down - movement.up )){
      if(movement.up){
        this.vspIncreaseUp();
      }
      if(movement.down){
        this.vspIncreaseDown();
      }
    } else {
        this.vspDecrease();
    }

    if((movement.left - movement.right)){
      if(movement.left){
        this.hspIncreaseLeft();
      }
      if(movement.right){
        this.hspIncreaseRight();
      }
    } else {
        this.hspDecrease();
    }
  },
  calculateWallCollisions: function (wallData) {
    var canMoveLeft = true, canMoveRight = true, canMoveUp = true, canMoveDown = true;
    for(let i=0;i<wallData.length;i++){
      if (intersects(this, wallData[i], {
          left: 34+this.hsp,
          right: -25,
          top: 32+this.vsp,
          bottom: 32+this.vsp
        })) {
          canMoveLeft = false;
        }
      if (intersects(this, wallData[i], {
          left: -25,
          right: 34+this.hsp,
          top: 32+this.vsp,
          bottom: 32+this.vsp
        })) {
          canMoveRight = false;
        }
      if (intersects(this, wallData[i], {
          left: 25+this.hsp,
          right: 30+this.hsp,
          top: 38+this.vsp,
          bottom: -28
        })) {
          canMoveUp = false;
        }
      if (intersects(this, wallData[i], {
          left: 28+this.hsp,
          right: 28+this.hsp,
          top: -28,
          bottom: 34+this.vsp
        })) {
          canMoveDown = false;
        }
    }
    if (canMoveLeft) {
      this.maxSpeed = 2.4;
    } else {
      this.maxSpeed = 0;
      if(this.hsp<0){
        this.hsp = 0;
      }
    }
    if (canMoveRight) {
      this.maxSpeed = 2.4;
    } else {
      this.maxSpeed = 0;
      if(this.hsp>0){
        this.hsp = 0;
      }
    }
    if (canMoveUp) {
      this.maxSpeed = 2.4;
    } else {
      this.maxSpeed = 0;
      if(this.vsp<0){
        this.vsp = 0;
      }
    }
    if (canMoveDown) {
      this.maxSpeed = 2.4;
    } else {
      this.maxSpeed = 0;
      if(this.vsp>0){
        this.vsp = 0;
      }
    }
  },
  calculateObjectCollisions: function(objectData){
    var hasCollided = false;
    var tempSpeed;
    var tempDamage;
    for(let i=0;i<objectData.length;i++){
      if (intersects(this, objectData[i], {
          left: 28,
          right: 28,
          top: 28,
          bottom: 28
        })) {
          hasCollided = true
          tempSpeed = objectData[i].speedModifier;
          tempDamage = objectData[i].healthModifier;
        }
    }
    if (hasCollided == true){
      this.speedModifier = tempSpeed;
      this.takeDamage(tempDamage);
    } else {
      this.speedModifier = 1;
    }
  },
  move: function () {
    this.y += this.vsp*this.speedModifier;
    this.x += this.hsp*this.speedModifier;
  },
  vspIncreaseUp: function () {
    this.vsp -= this.accel
    if (this.vsp < -this.maxSpeed){
      this.vsp = -this.maxSpeed;
    }
  },
  vspIncreaseDown: function(){
    this.vsp += this.accel
    if (this.vsp > this.maxSpeed){
      this.vsp = this.maxSpeed;
    }
  },
  vspDecrease: function(){
    if(this.vsp > 0){
      this.vsp -= this.fric
      if(this.vsp < 0.2){
        this.vsp = 0
      }
    }
    if(this.vsp < 0){
      this.vsp += this.fric
      if(this.vsp > -0.2){
        this.vsp = 0
      }
    }
  },
  hspIncreaseLeft: function(){
    this.hsp -= this.accel
    if (this.hsp < -this.maxSpeed){
      this.hsp = -this.maxSpeed;
    }
  },
  hspIncreaseRight: function(){
    this.hsp += this.accel
    if (this.hsp > this.maxSpeed){
      this.hsp = this.maxSpeed;
    }
  },
  hspDecrease: function(){
    // if (this.maxSpeed != 0){
      if(this.hsp > 0){
        this.hsp -= this.fric
        if(this.hsp < 0.2){
          this.hsp = 0
        }
      }
    // } else {
    //   this.hsp = 0
    // }
    // if(this.maxSpeed != 0){
      if(this.hsp < 0){
        this.hsp += this.fric
        if(this.hsp > -0.2){
          this.hsp = 0
        }
      }
    // }else {
    //   this.hsp = 0
    // }
  },
  itemPickUp: function (itemData) {
    for (let i=0; i<itemData.length; i++) {
      if (
        this.x <= (itemData[i].x + 26)
        && itemData[i].x <= (this.x + 26)
        && this.y <= (itemData[i].y + 26)
        && itemData[i].y <= (this.y + 26)
        ) {
        if (itemData[i].active === true) {
          this.giveItem(itemData[i]);
          // itemData[i].active = false;
          // itemData[i].restock();
          itemData[i].id = i; // this is so that other clients can identify it without items.findwith(x, y)
          return itemData[i]
        }
      }
    }
    return false;
  },
  weaponPickUp: function (weaponData) {
    for (let i=0; i<weaponData.length; i++) {
      if (
        this.x <= (weaponData[i].x + 26)
        && weaponData[i].x <= (this.x + 26)
        && this.y <= (weaponData[i].y + 26)
        && weaponData[i].y <= (this.y + 26)
        ) {
        if (weaponData[i].active === true) {
          this.giveWeapon(weaponData[i]);
          // weaponData[i].active = false;
          // weaponData[i].restock();
          weaponData[i].id = i; // this is so that other clients can identify it without weapons.findwith(x, y)
          return weaponData[i]; // assuming you can't pick up more than 1 weapon at the exact same time
        }
      }
    }
    return false; // when you picked up nothing
  },
  giveWeapon: function (weaponData) {
    this.weaponNum = weaponData.weaponNum;
    this.reloadDelay = weaponData.reloadDelay;
    this.bulletCount = weaponData.bulletCount;
    this.attackDamage = weaponData.damage;
    this.reloading = false;
  },
  giveItem: function (itemData) {
    if(this.health < itemData.health){
      this.health = itemData.health;
    }
  },
  canFire: function () {
    if (!this.justShot && !this.reloading && this.bulletCount > 0) {
      return true;
    } else if (this.bulletCount <= 0 && this.reloading === false) {
      this.startReload();
      return false;
    } else {
      return false;
    }
  },
  fireBullet: function (direction) {
    this.justShot = true;
    setTimeout(() => {this.justShot = false}, this.reloadDelay);
    this.bulletCount -= 1;
    if (direction === "up") {
      this.activeImage = this.imageUp;
    }
    if (direction === "down") {
      this.activeImage = this.imageDown;
    }
    if (direction === "left") {
      this.activeImage = this.imageLeft;
    }
    if (direction === "right") {
      this.activeImage = this.imageRight;
    }
    this.rotation = direction;
    return new Bullet(bulletOffsets(direction, this.x, this.y), this, this.attackDamage);
  },
  startReload: function () {
    this.reloading = true;
    this.weaponNum = 1;
    this.reloadDelay = 300;
    this.attackDamage = 1;
    this.bulletCount = 8;
  },
  finishReload: function () {
    this.reloading = false;
  },
  bulletImpact: function(bulletData){
    for(let i=0;i<bulletData.length;i++){
      if (bulletData[i].owner !== this) {
        if (
            player.x <= (bulletData[i].x + 8)
            && bulletData[i].x <= (player.x + 30)
            && player.y <= (bulletData[i].y + 8)
            && bulletData[i].y <= (player.y + 30)
        ) {
            this.takeDamage(bulletData[i].damage)
          }
      }
    }
  },
  takeDamage: function(damageValue){
    if (!this.invincible) {
      if(this.health - damageValue <= 0){
        this.playerDeath();
      } else {
        this.health -= damageValue;
        setTimeout(() => {this.invincible = false}, 2000)
      }
    }
  },
  status: function () {
    if (this.invincible) {
      if (this.hurt) {
        setTimeout(() => {this.hurt = false}, 50);
      } else {
        setTimeout(() => {this.hurt = true}, 50);
      }
    } else {
      this.hurt = false;
    }
  },
  playerDeath: function(enemy, players){
    this.health = 0;
    this.deathCount += 1;
    if (enemy && enemy !== "lava") {
      players[enemy.id].killCount += 1;
    }
  }
}

module.exports = Player;
