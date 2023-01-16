module.exports = (executeCallback) => {
  return (req, res, next) => {
    executeCallback(req, res, next).catch(next);
  };
};
