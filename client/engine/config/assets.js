const createSpritePromise = url => {
  return new Promise((resolve, reject) => {
    let image = new Image()
    image.src = url
    image.onload = () => {
      resolve(image)
    }
    image.onerror = reject
  })
}

export const loadSprites = function(spriteUrls: Array<string>, callback: function) {
  Promise.all(spriteUrls.map(createSpritePromise)).then(callback, () => {
    console.log('image load error')
  })
}

export const mapSprites = function(assets) {
  return {
    player1: {
      up: assets[0],
      down: assets[1],
      left: assets[2],
      right: assets[3],
    },
    player2: {
      up: assets[4],
      down: assets[5],
      left: assets[6],
      right: assets[7],
    },
    player3: {
      up: assets[8],
      down: assets[9],
      left: assets[10],
      right: assets[11],
    },
    player4: {
      up: assets[12],
      down: assets[13],
      left: assets[14],
      right: assets[15],
    },
    weapons: {
      shotgun: assets[16],
      assault: assets[17],
      gun: assets[18],
    },
    items: {
      health: assets[19],
      overshield: assets[20],
    },
    tiles: {
      bullet: assets[21],
      lava: assets[22],
      steps: assets[25],
      ice: assets[26],
      sand: assets[24],
      plat: assets[23],
    },
  }
}
