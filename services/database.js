const mongoose = require('mongoose');
const config = require('../config');
const logger = require('./logger');

const connectDB = async () => {
  try {
    await mongoose.connect(config.databaseUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    logger.info('MongoDB Connected...');
  } catch (err) {
    logger.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
