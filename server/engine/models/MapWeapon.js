export class MapItem {
  x: number
  y: number
  constructor(x: number, y: number): void {
    this.x = x
    this.y = y
  }
}

class MapWeapon extends MapItem {
  weaponNum: number
  reloadDelay: number
  bulletCount: number
  damage: number
  active: boolean
  id: any
  constructor(
    x: number,
    y: number,
    weaponNum: number,
    reloadDelay: number,
    bulletCount: number,
    damage: number,
  ) {
    super(x, y)
    this.weaponNum = weaponNum
    this.reloadDelay = reloadDelay
    this.bulletCount = bulletCount
    this.damage = damage
    // this.isWeapon = true
    this.active = true
    this.id = null
  }

  static respawnTimer: number = 10000
  restock() {
    setTimeout(() => {
      this.active = true
    }, MapWeapon.respawnTimer)
  }
}

export default MapWeapon
