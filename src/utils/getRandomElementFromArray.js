function getRandomElementFromArray(array) {
  const length = array.length;
  return Math.floor(Math.random() * length);
}

module.exports = getRandomElementFromArray;
