const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const config = require('./config');
const logger = require('./services/logger');
const connectDB = require('./services/database');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});
app.use(limiter);


app.use(express.static(path.join(__dirname, 'public')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));
app.use('/data', require('./routes/data'));


app.use(errorHandler);


const httpsOptions = {
  key: fs.readFileSync(config.sslKeyPath),
  cert: fs.readFileSync(config.sslCertPath)
};


https.createServer(httpsOptions, app).listen(config.httpsPort, () => {
  logger.info(`HTTPS Server running on port ${config.httpsPort}`);
});


app.listen(config.httpPort, () => {
  logger.info(`HTTP Server running on port ${config.httpPort}`);
});

module.exports = app;
