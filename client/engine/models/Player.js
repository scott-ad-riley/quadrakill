var intersects = require('../utils/intersects');
var bulletOffsets = require('../utils/bulletOffsets');
var Bullet = require('./Bullet');

var Player = function (x, y, sprites, onTakeDamage, onDeath, isCurrentPlayer) {
  // Defaults
  this.number;
  this.id;
  this.x = x;
  this.y = y;
  this.defaultMaxSpeed = 5.4;
  this.speedModifier = 1;
  this.accelDefault = 0.4;
  this.fricDefault = 0.5;
  this.spritesLoaded = false;
  this.rotation = "up";
  this.spawned = false;
  if (sprites) this.loadSprites(sprites);
  this.onTakeDamage = onTakeDamage;
  this.onDeath = onDeath;
  this.healthBarMaxWidth = 37;
  this.isCurrentPlayer = isCurrentPlayer;

  // Player State
  this.currentMaxSpeed = this.defaultMaxSpeed;
  this.accel = this.accelDefault;
  this.fric = this.fricDefault;
  this.hsp = 0;
  this.vsp = 0;
  this.health = 4;
  this.maxHealth = 4;
  this.invincible = false;
  this.attackDamage = 1;
  this.weaponNum = 1;
  this.reloadDelay = 300;
  this.bulletCount = 8;
  this.reloadTime = 1200;
  this.reloading = false;
  this.deathCount = 0;
  this.killCount = 0;
  this.movement = {
    up: true,
    down: true,
    left: true,
    right: true
  }
}

Player.prototype = {
  calculateMove: function (keysDown) {
    if((keysDown.down - keysDown.up )){
      if(keysDown.up){
        this.vspIncreaseUp();
      }
      if(keysDown.down){
        this.vspIncreaseDown();
      }
    } else {
        this.vspDecrease();
    }

    if((keysDown.left - keysDown.right)){
      if(keysDown.left){
        this.hspIncreaseLeft();
      }
      if(keysDown.right){
        this.hspIncreaseRight();
      }
    } else {
        this.hspDecrease();
    }
  },
  calculateWallCollisions: function (wallData) {
    this.movement.left = true;
    this.movement.right = true;
    this.movement.up = true;
    this.movement.down = true;
    for(let i=0;i<wallData.length;i++){
      if (intersects(this, wallData[i], {
          left: 34+this.hsp,
          right: -25,
          top: 32+this.vsp,
          bottom: 32+this.vsp 
        })) {
          this.movement.left = false;
        }
      if (intersects(this, wallData[i], {
          left: -25,
          right: 34+this.hsp,
          top: 32+this.vsp,
          bottom: 32+this.vsp 
        })) {
          this.movement.right = false;
        }
      if (intersects(this, wallData[i], {
          left: 25+this.hsp,
          right: 30+this.hsp,
          top: 38+this.vsp,
          bottom: -28 
        })) {
          this.movement.up = false;
        }
      if (intersects(this, wallData[i], {
          left: 28+this.hsp,
          right: 28+this.hsp,
          top: -28,
          bottom: 34+this.vsp 
        })) {
          this.movement.down = false;
        }
    }
    if (!this.movement.left) {
      if(this.hsp < 0){
        this.hsp = 0;
      }
    }
    if (!this.movement.right) {
      if(this.hsp>0){
        this.hsp = 0;
      }
    }
    if (!this.movement.up) {
      if(this.vsp<0){
        this.vsp = 0;
      }
    }
    if (!this.movement.down) {
      if(this.vsp>0){
        this.vsp = 0;
      }
    }
  },
  calculateObjectCollisions: function(objectData){
    var hasCollided = false;
    var tempSpeed;
    var tempFric;
    var tempAccel;
    for(let i=0;i<objectData.length;i++){
      if (intersects(this, objectData[i], {
          left: 28,
          right: 28,
          top: 28,
          bottom: 28 
        })) {
          if (objectData[i].damage !== 0) {
            this.takeDamage(objectData[i].damage);
            this.invincible = true;
          }
          if (objectData[i].speedModifier !== 0) {
            hasCollided = true
            tempSpeed = objectData[i].speedModifier;
            tempFric = objectData[i].fricModifier;
            tempAccel = objectData[i].accelModifier;
          }
        }
    }
    if (hasCollided == true){
      this.speedModifier = tempSpeed;
      this.fric = tempFric;
      this.accel = tempAccel;
    } else {
      this.speedModifier = 1;
      this.fric = this.fricDefault;
      this.accel = this.accelDefault;
    }
  },
  move: function () {
    if (this.health > 0) {
      this.y += this.vsp*this.speedModifier;
      this.x += this.hsp*this.speedModifier;
      if(this.x > 766){
        this.x = -26
        this.y = 240
      }
      if(this.x < -28){
        this.x = 764
        this.y = 240
      }
    }
  },
  vspIncreaseUp: function () {
    this.vsp -= this.accel
    if (this.vsp < -this.currentMaxSpeed){
      this.vsp = -this.currentMaxSpeed;
    }
  },
  vspIncreaseDown: function(){
    this.vsp += this.accel
    if (this.vsp > this.currentMaxSpeed){
      this.vsp = this.currentMaxSpeed;
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
    if (this.hsp < -this.currentMaxSpeed){
      this.hsp = -this.currentMaxSpeed;
    }
  },
  hspIncreaseRight: function(){
    this.hsp += this.accel
    if (this.hsp > this.currentMaxSpeed){
      this.hsp = this.currentMaxSpeed;
    }
  },
  hspDecrease: function(){
    if(this.hsp > 0){
      this.hsp -= this.fric
      if(this.hsp < 0.02){
        this.hsp = 0
      }
    }
    if(this.hsp < 0){
      this.hsp += this.fric
      if(this.hsp > -0.02){
        this.hsp = 0
      }
    }
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
          if(this.health < itemData[i].health){
            this.health = itemData[i].health;
          }
          itemData[i].active = false;
          itemData[i].restock();
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
          this.weaponNum = weaponData[i].weaponNum;
          this.reloadDelay = weaponData[i].reloadDelay;
          this.bulletCount = weaponData[i].bulletCount;
          this.attackDamage = weaponData[i].damage;
          this.reloading = false;
          weaponData[i].active = false;
          weaponData[i].restock();
          weaponData[i].id = i; // this is so that other clients can identify it without weapons.findwith(x, y)
          return weaponData[i]; // assuming you can't pick up more than 1 weapon at the exact same time
        }
      }
    }
    return false; // when you picked up nothing
  },
  canFire: function () {
    if (!this.justShot && !this.reloading && this.bulletCount > 0 && this.health > 0 && this.spawned) {
      return true;
    } else {
      return false;
    }
  },
  fireBullet: function (direction) {
    this.justShot = true;
    setTimeout(() => {this.justShot = false}, this.reloadDelay);
    this.bulletCount -= 1;
    this.setOrientation(direction);
    return new Bullet(bulletOffsets(direction, this.x, this.y), this, this.attackDamage);
  },
  updateWeaponState: function (data) {
    this.weaponNum = data.weaponNum;
    this.reloadDelay = data.reloadDelay;
    this.attackDamage = data.attackDamage;
    this.bulletCount = data.bulletCount;
    // this.reloading = false;
  },
  bulletImpact: function(bulletData){
    for(let i=0;i<bulletData.length;i++){
      var collidedBullet = null;
      if (bulletData[i].owner !== this) {
        if (
            this.x <= (bulletData[i].x + 8)
            && bulletData[i].x <= (this.x + 30)
            && this.y <= (bulletData[i].y + 8)
            && bulletData[i].y <= (this.y + 30)
        ) {
            if(!this.invincible) {
              this.takeDamage(bulletData[i].damage, bulletData[i].owner)
              collidedBullet = bulletData[i];
            }
          }
      }
    }
    return collidedBullet;
  },
  takeDamage: function(damageValue, enemy){
    if (!this.invincible) {
      if(this.health - damageValue <= 0){
        this.health = 0;
        this.playerDeath(enemy);
        // if (enemy) {
        //   enemy.killCount += 1;
        // }
      } else {
        this.health -= damageValue;
        if (this.onTakeDamage) this.onTakeDamage(damageValue);
        this.invincible = true;      
        setTimeout(() => {this.invincible = false}, 2000)
      }
    }
  },
  setOrientation: function (direction) {
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
  },
  loadSprites: function (assets) {
    this.imageUp = assets.up;
    this.imageDown = assets.down;
    this.imageRight = assets.right;
    this.imageLeft = assets.left;
    this.activeImage = assets[this.rotation];
    this.spritesLoaded = true;
  },
  playerDeath: function(enemy){
    let enemyString;
    if (!enemy) {
      enemyString = "lava";
    } else {
      enemyString = enemy.number;
    }
    this.health = 0;
    this.deathCount += 1;
    if (this.onDeath) this.onDeath(enemy);
  },
  setPosition: function (data) {
    this.x = data.x;
    this.y = data.y;
    this.spawned = true;
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
  respawn: function (x, y) {
    this.health = 4;
    this.attackDamage = 1;
    this.weaponNum = 1;
    this.reloadDelay = 300;
    this.bulletCount = 8;
    this.reloadTime = 1200;
    this.reloading = false;
    this.invincible = true;
    setTimeout(() => {this.invincible = false;}, 2000)
    this.setPosition({x: x, y: y});
  },
  healthBarWidth: function () {
    return this.health / this.maxHealth * this.healthBarMaxWidth;
  },
  healthBarColor: function () {
    if (this.health <= 1.5) return "#FF0000"; // red
    if (this.health <= 2.5) return "#FFA500"; // orange
    return "#00FF00"; // green
  },
  render: function (ctx) {
    if (!this.hurt && this.spritesLoaded && this.spawned) {
      ctx.drawImage(this.activeImage, this.x, this.y);
      if (this.isCurrentPlayer) {
        ctx.fillStyle = (this.health <= 0) ? "#FF0000" :  "#FFFFFF"
        ctx.fillRect(this.x - 3, this.y - 11, this.healthBarMaxWidth + 2, 7)
      }
      ctx.fillStyle = "#000000"
      ctx.fillRect(this.x - 2, this.y - 10, this.healthBarMaxWidth, 5)
      ctx.fillStyle = this.healthBarColor()
      ctx.fillRect(this.x - 2, this.y - 10, this.healthBarWidth(), 5)
    }
  }
}

module.exports = Player;