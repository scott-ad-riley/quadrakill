var intersects = require('../utils/intersects');
var bulletOffsets = require('../utils/bulletOffsets');
var Bullet = require('./Bullet');

var Player = function (x, y, sprites, onTakeDamage, onDeath, isCurrentPlayer) {
  // Defaults
  this.number;
  this.id;
  this.x = x;
  this.y = y;
  this.maxSpeed = 2.4;

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
  this.dirV = 0;
  this.dirH = 0;
  this.accel = this.accelDefault;
  this.fric = this.fricDefault;
  this.hsp = 0;
  this.vsp = 0;
  this.health = 4;
  this.maxHealth = 4;
  this.armour = 0;
  this.maxArmour = 4;
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
  //WALL COLLISIONS AND MOVEMENT
  calculateDirection: function (movement) {
    if((movement.down - movement.up)){
      if(movement.up){
        this.dirV = -1;
      }
      if(movement.down){
        this.dirV = 1;
      }
    } else {
        this.dirV = 0;
    }
    if((movement.left - movement.right)){
      if(movement.left){
        this.dirH = -1
      }
      if(movement.right){
        this.dirH = 1
      }
    } else {
        this.dirH = 0;
    }
  },
  calculateVsp: function () {
    if (this.dirV !== 0){
      this.vsp += this.accel*this.speedModifier*this.dirV
      if (this.vsp < -this.maxSpeed){
        this.vsp = -this.maxSpeed;
      }
      if (this.vsp > this.maxSpeed){
        this.vsp = this.maxSpeed;
      }
    } else {
      if (this.vsp > 0.2){
        this.vsp -= this.fric
      } else if (this.vsp < -0.2){
        this.vsp += this.fric
      } else {
        this.vsp = 0;
      }
    }
  },
  calculateHsp: function () {
    if (this.dirH !== 0){
      this.hsp += this.accel*this.speedModifier*this.dirH
      if (this.hsp < -this.maxSpeed){
        this.hsp = -this.maxSpeed;
      }
      if (this.hsp > this.maxSpeed){
        this.hsp = this.maxSpeed;
      }
    } else {
      if (this.hsp > 0.4){
        this.hsp -= this.fric
      } else if (this.hsp < -0.4){
        this.hsp += this.fric
      } else {
        this.hsp = 0;
      }
    }
  },
  calculateWallCollisionsVertical: function (wallData) {
    var playerX = (this.x+16);
    var playerY = (this.y+16);
    for(let i=0;i<wallData.length;i++){
      let wallY = wallData[i].y +8;
      let wallX = wallData[i].x +8;

      if(
        ((playerY + 16 + this.vsp) >= wallY - 6)
        &&((playerX - 16) <= (wallX + 6))
        &&((playerX + 16) >= (wallX - 6))
        &&((playerY - 16) <= (wallY -36))
      ){
        if(this.vsp>0){
          this.vsp = 0;
        }
        console.log("down")
      }
      if(
        ((playerY - 16 + this.vsp) <= wallY +6)
        &&((playerX - 16) <= (wallX + 6))
        &&((playerX + 16) >= (wallX - 6))
        &&((playerY + 16) >= (wallY +36))
      ){
        if(this.vsp<0){
          this.vsp = 0;
        }
        console.log("up")
      }
    }
  },
  calculateWallCollisionsHorizontal: function (wallData) {
    var playerX = (this.x+16);
    var playerY = (this.y+16);
    for(let i=0;i<wallData.length;i++){
      let wallY = wallData[i].y +8;
      let wallX = wallData[i].x +8;
      if(
        ((playerX - 16 + this.hsp) <= wallX +6)
        &&((playerY - 16) <= (wallY + 6))
        &&((playerY + 16) >= (wallY - 6))
        &&((playerX + 16) >= (wallX +36))
      ){
        if(this.hsp<0){
          this.hsp = 0;
        }
        console.log("left")
      }
      if(
        ((playerX + 16 + this.hsp) >= wallX - 6)
        &&((playerY - 16) <= (wallY + 6))
        &&((playerY + 16) >= (wallY - 6))
        &&((playerX - 16) <= (wallX -36))
      ){
        if(this.hsp>0){
          this.hsp = 0;
        }
        console.log("right")
      }
    }
  },
  moveY: function () {
    this.y += this.vsp;
  },
  moveX: function () {
    this.x += this.hsp;
  },

  //OBJECT / ITEM COLLISIONS && PICKUPS
  calculateObjectCollisions: function(objectData){
    var hasCollided = false;
    var tempSpeed;
    var tempFric;
    var tempAccel;
    var playerX = (this.x+16);
    var playerY = (this.y+16);
    for(let i=0;i<objectData.length;i++){
      let objY = objectData[i].y +8;
      let objX = objectData[i].x +8;
      if(
          ((playerX - 16) <= (objX + 6))
        &&((playerY - 16) <= (objY + 6))
        &&((playerY + 16) >= (objY - 6))
        &&((playerX + 16) >= (objX - 6))
      ){
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
  itemPickUp: function (itemData) {
    var playerX = (this.x+16);
    var playerY = (this.y+16);
    for (let i=0; i<itemData.length; i++) {
      let objY = itemData[i].y +8;
      let objX = itemData[i].x +8;
      if(
          ((playerX - 16) <= (objX + 10))
        &&((playerY - 16) <= (objY + 10))
        &&((playerY + 16) >= (objY - 10))
        &&((playerX + 16) >= (objX - 10))
      ){
        if (itemData[i].active === true) {
          if (itemData[i].effect === 1){
            if(this.health + itemData[i].health >= this.maxHealth){
              this.health = this.maxHealth;
            } else {
              this.health += itemData[i].health;
            }
            if(this.armour + itemData[i].armour >= this.maxArmour){
              this.armour = this.maxArmour;
            } else {
              this.armour += itemData[i].armour;
            }
          }
          if (itemData[i].effect === 2){
            //modify speed
          }
          if (itemData[i].effect === 3){
            //go invisable
          }
          itemData[i].active = false;
          itemData[i].restock(itemData[i].respawnTime);
          itemData[i].id = i; // this is so that other clients can identify it without items.findwith(x, y)
          return itemData[i]
        }
      }
    }
    return false;
  },
  weaponPickUp: function (weaponData) {
    if(this.weaponNum == 1){
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
            weaponData[i].x = this.x;
            weaponData[i].y = this.y;
            // weaponData[i].active = false;
            // weaponData[i].restock();
            weaponData[i].id = i; // this is so that other clients can identify it without weapons.findwith(x, y)
            return weaponData[i]; // assuming you can't pick up more than 1 weapon at the exact same time
          }
        }
      }
    }
    return false; // when you picked up nothing
  },
  weaponDrop: function(){
    if(this.weaponNum == 2){
      //
    }
  },
  // WEAPONS SYSTEMS
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
  // DAMAGE
  takeDamage: function(damageValue, enemy){
    if (!this.invincible) {
      if(this.armour > 0){
        if(this.armour - damageValue <= 0){
          this.armour = 0;
        } else {
          this.armour -= damageValue;
        }
        if (this.onTakeDamage) this.onTakeDamage(damageValue);
        this.invincible = true;
        setTimeout(() => {this.invincible = false}, 2000)
      } else {
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
    }
  },
  //ANIMATIONS
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
  // MISC
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
    if (this.armour > 0){
      return this.armour / this.maxArmour * this.healthBarMaxWidth;
    } else {
      return this.health / this.maxHealth * this.healthBarMaxWidth;
    }
  },
  healthBarColor: function () {
    if (this.armour > 0){
      return "#555555";
    } else {
    if (this.health <= 1.5) return "#FF0000"; // red
    if (this.health <= 2.5) return "#FFA500"; // orange
    return "#00FF00"; // green
    }
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
