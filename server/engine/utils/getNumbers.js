module.exports = function (playersHash) {
  let numbers = [];
  for (let eachPlayer in playersHash) {
    let i = playersHash[eachPlayer];
    numbers.push(i.number);
  }
  return numbers.sort((a, b) => a - b);
}
