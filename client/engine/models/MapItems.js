var MapItems = function(mapItemData, ItemConstructors) {
  this.rawData = mapItemData
  this.data = []
  var xPos = 0
  var yPos = 0
  for (let i = 0; i < this.rawData.length; i += 1) {
    for (let j = 0; j < this.rawData[i].length; j += 1) {
      if (this.rawData[i][j] !== 0) {
        var newObject = ItemConstructors[this.rawData[i][j]](xPos + 16, yPos + 16)
        this.data.push(newObject)
      }
      xPos += 32
    }
    xPos = 0
    yPos += 32
  }
  this.weapons = this.data.filter(function(mapObject) {
    return mapObject.isWeapon
  })
  this.items = this.data.filter(function(mapObject) {
    return mapObject.isItem
  })
}

MapItems.prototype = {
  render: function(ctx) {
    for (var i = 0; i < this.data.length; i++) {
      this.image = new Image()
      this.image.src = this.data[i].image
      if (this.data[i].active) {
        ctx.drawImage(this.image, this.data[i].x, this.data[i].y)
      }
    }
  },
}

module.exports = MapItems
