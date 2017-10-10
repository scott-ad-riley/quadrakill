import spawns from './../../../data/spawns'
import XYFromMapData from '../../../server/XYFromMapData'

const spawnPoints = {
  1: XYFromMapData(spawns, 1),
  2: XYFromMapData(spawns, 2),
  3: XYFromMapData(spawns, 3),
  4: XYFromMapData(spawns, 4)
}

export default function (playerNumber) {
  return spawnPoints[playerNumber]
}
