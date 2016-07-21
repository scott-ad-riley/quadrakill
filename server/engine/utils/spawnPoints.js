var spawnPoints = {
  1: {x: 48, y: 48},
  2: {x: 688, y: 48},
  3: {x: 48, y: 434},
  4: {x: 688, y: 434}
}
module.exports = function (playerNumber) {
  return spawnPoints[playerNumber]
}