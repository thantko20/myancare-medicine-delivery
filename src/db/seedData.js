// Model -> Mongoose Model
// Schema -> a function that returns a single doc
// size -> number of docs
async function seedData({ model, schema, size }) {
  const docs = await model.insertMany(
    Array(size)
      .fill()
      .map(() => schema())
  );
  return docs;
}

module.exports = seedData;
