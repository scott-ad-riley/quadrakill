module.exports = function (playersHash) {
  let numbers = [];
  for (eachPlayer in playersHash) {
    let i = playersHash[eachPlayer];
    numbers.push(i.number);
  }
  return numbers.sort((a, b) => a - b);
}