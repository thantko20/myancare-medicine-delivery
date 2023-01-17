function getRandomElementFromArray(array) {
  const length = array.length;
  return array[Math.floor(Math.random() * length)];
}

module.exports = getRandomElementFromArray;
