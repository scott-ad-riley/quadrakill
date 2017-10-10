const findInMapData = function (mapData, target)  {
  let cellX, cellY;
  mapData.forEach(function (row, rowNumber) {
    row.forEach(function (cell, cellNumber) {
      if (cell === target) {
        cellX = cellNumber
        cellY = rowNumber
      }
    })
  })
  return [cellX, cellY]
}

export default function (mapData, target) {
  const [x, y] = findInMapData(mapData, target)
  return { x: x * 32, y: y * 32 }
}
