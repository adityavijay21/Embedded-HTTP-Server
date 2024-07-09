const logger = require('../services/logger');

module.exports = (err, req, res, next) => {
  logger.error(err.stack);

  res.status(500).json({
    error: 'An unexpected error occurred',
    message: process.env.NODE_ENV === 'production' ? null : err.message
  });
};
