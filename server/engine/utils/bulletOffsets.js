var bulletOffsets = function (direction, originX, originY) {
  var player = {
    up: {
      x: originX + 16,
      y: originY - 16
    },
    down: {
      x: originX + 20,
      y: originY + 20
    },
    left: {
      x: originX + 20,
      y: originY + 20
    },
    right: {
      x: originX + 20,
      y: originY + 20
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