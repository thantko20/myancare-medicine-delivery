const { PAGE_LIMIT, DEFAULT_SORTING } = require('../constants');
require('dotenv').config();

exports.firstAllMedicines = (req, res, next) => {
  req.query.limit = req.query.limit || PAGE_LIMIT;
  req.query.sort = req.query.sort_by || DEFAULT_SORTING;
  next();
};
