module.exports = function (bulletData) {
  if (bulletData.vsp < 0) return "up";
  if (bulletData.vsp > 0) return "down";
  if (bulletData.hsp < 0) return "left";
  if (bulletData.hsp > 0) return "right";
}