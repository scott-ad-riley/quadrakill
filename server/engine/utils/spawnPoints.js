var spawnPoints = {
  1: {x: 32, y: 24},
  2: {x: 694, y: 24},
  3: {x: 32, y: 450},
  4: {x: 694, y: 450}
}
module.exports = function (playerNumber) {
  return spawnPoints[playerNumber]
}
