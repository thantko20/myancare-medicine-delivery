// generateDoc -> function for generating a single doc. Eg: new UserModel({name: 'John'})
// size -> number of docs
async function seedData({ generateDoc, size }) {
  const docs = await Promise.all(
    Array(size)
      .fill()
      .map(() => {
        const doc = generateDoc();
        return doc.save();
      })
  );
  return docs;
}

module.exports = seedData;
