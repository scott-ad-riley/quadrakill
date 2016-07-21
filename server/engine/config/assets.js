const createPromise = (url) => {
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.src = url;
    image.onload = () => {
      resolve(image)
    };
    image.onerror = reject;
  })
}

module.exports.load = function (spriteUrls, callback) {
  Promise.all(spriteUrls.map(createPromise))
    .then(callback, () => {
      console.log("image load error")
    })
}

module.exports.map = function (assets) {
  return {
    cowboy: assets[0],
    tiles: {
      bullet: assets[1],
      lava: assets[2],
      steps: assets[3]
    }
  }
}