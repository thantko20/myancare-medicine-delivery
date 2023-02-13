const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');

const router = require('./routes');
const errorHandler = require('./controllers/error.controller');
const { NODE_ENV } = require('./constants');
const ApiError = require('./utils/apiError');

const app = express();

// Usage: `app.options("<route-you-want-to-restrict>", cors(/* Cors Options */))`
// Example: `app.options("/api/v1/examples/:id", cors({origin: 'https://example.com'}))`
app.use(cors());

if (NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', router);
app.use('*', (req, res, next) => {
  next(ApiError.notFound());
});

app.use(errorHandler);

module.exports = app;
