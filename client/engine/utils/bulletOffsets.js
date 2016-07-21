var bulletOffsets = function (direction, originX, originY) {
  var player = {
    up: {
      x: originX + 12,
      y: originY
    },
    down: {
      x: originX + 12,
      y: originY + 16
    },
    left: {
      x: originX,
      y: originY + 16
    },
    right: {
      x: originX + 22,
      y: originY + 16
    }
  }
  var speed = {
    up: {
      hsp: 0,
      vsp: -10
    },
    down: {
      hsp: 0,
      vsp: 10
    },
    left: {
      hsp: -10,
      vsp: 0
    },
    right: {
      hsp: 10,
      vsp: 0
    }
  }
  return {
    player: player[direction],
    speed: speed[direction]
  }
}
module.exports = bulletOffsets;