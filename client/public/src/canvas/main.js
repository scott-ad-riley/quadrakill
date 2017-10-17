import { setup, createHandler, engine, loadAssets } from '../../../engine/index.js'
import { setupListeners, clearListeners } from './socket.js'

//CROSS-BROWSER SUPPORT
const requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  window.mozRequestAnimationFrame

const spriteUrls = [
  //Player 1
  '/sprites/characters/player1Up.png',
  '/sprites/characters/player1Down.png',
  '/sprites/characters/player1Left.png',
  '/sprites/characters/player1Right.png',
  //Player 2
  '/sprites/characters/player2Up.png',
  '/sprites/characters/player2Down.png',
  '/sprites/characters/player2Left.png',
  '/sprites/characters/player2Right.png',
  //Player 3
  '/sprites/characters/player3Up.png',
  '/sprites/characters/player3Down.png',
  '/sprites/characters/player3Left.png',
  '/sprites/characters/player3Right.png',
  //Player 4
  '/sprites/characters/player4Up.png',
  '/sprites/characters/player4Down.png',
  '/sprites/characters/player4Left.png',
  '/sprites/characters/player4Right.png',
  //Weapon PickUps
  '/sprites/items/gun1.png',
  '/sprites/items/gun2.png',
  '/sprites/items/gun3.png',
  //Item Pickups
  '/sprites/items/item1.png',
  '/sprites/items/item2.png',
  //Bullet
  '/sprites/tiles/bullet.png',
  //Tiles
  '/sprites/tiles/lava1.png',
  '/sprites/tiles/plat1.png',
  '/sprites/tiles/mud.png',
  '/sprites/tiles/steps1.png',
  '/sprites/tiles/ice.png',
]
const soundUrls = [
  //Items
  '/sounds/itemMachineGun.mp3',
  '/sounds/itemShotgun.mp3',
  '/sounds/itemHealth.wav',
  '/sounds/itemOvershield.wav',
  //Bullets
  '/sounds/bulletPistol.wav',
  '/sounds/bulletMachinegun.wav',
  '/sounds/bulletShotgun.wav',
  //Player
  '/sounds/playerHurt.wav',
  '/sounds/playerDeath.wav',
  '/sounds/playerReload.aiff',
]

export function setupAssets() {
  loadAssets(spriteUrls, soundUrls)
}

export function leave(socket) {
  engine.incoming.quitGame()
  clearListeners(engine, socket)
}

export default function run(ctx, canvasWidth, canvasHeight, socket) {
  setup(canvasWidth, canvasHeight, requestAnimationFrame, ctx, setupListeners(engine, socket))
}
