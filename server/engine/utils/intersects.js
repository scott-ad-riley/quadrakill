var intersects = function (obj1, obj2, offsets) {
  return obj1.x <= (obj2.x + offsets.left)
  && obj2.x <= (obj1.x + offsets.right)
  && obj1.y <= (obj2.y + offsets.top)
  && obj2.y <= (obj1.y + offsets.bottom)
}
module.exports = intersects;