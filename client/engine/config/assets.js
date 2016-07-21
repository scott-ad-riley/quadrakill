const createSpritePromise = (url) => {
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.src = url;
    image.onload = () => {
      resolve(image)
    };
    image.onerror = reject;
  })
}

const createAudioPromise = (url) => {
  return new Promise((resolve, reject) => {
    let audio = new Audio(url);
    audio.onerror = reject;
    resolve(audio);
  })
}

module.exports.loadSprites = function (spriteUrls, callback) {
  Promise.all(spriteUrls.map(createSpritePromise))
    .then(callback, () => {
      console.log("image load error")
    })
}

module.exports.loadSounds = function (soundUrls, callback) {
  Promise.all(soundUrls.map(createAudioPromise))
    .then(callback, (err) => {
      console.log("sound load error", err)
    })
}

module.exports.mapSprites = function (assets) {
  return {
    player1: {
      up: assets[0],
      down: assets[1],
      left: assets[2],
      right: assets[3]
    },
    player2: {
      up: assets[4],
      down: assets[5],
      left: assets[6],
      right: assets[7]
    },
    player3: {
      up: assets[8],
      down: assets[9],
      left: assets[10],
      right: assets[11]
    },
    player4: {
      up: assets[12],
      down: assets[13],
      left: assets[14],
      right: assets[15]
    },
    weapons: {
      shotgun: assets[16],
      assault: assets[17],
      gun: assets[18]
    },
    items: {
      health: assets[19],
      overshield: assets[20]
    },
    tiles: {
      bullet: assets[21],
      lava: assets[22],
      steps: assets[25],
      ice: assets[26],
      sand: assets[24],
      plat: assets[23]
    }
  }
}

module.exports.mapSounds = function (assets) {
  return {
    item: {
      machinegun: assets[0],
      shotgun: assets[1],
      health: assets[2],
      overshield: assets[3]
    },
    bullet: {
      pistol: assets[4],
      machinegun: assets[5],
      shotgun: assets[6]
    },
    player: {
      hurt: assets[7],
      death: assets[8]
    }
  }
}


