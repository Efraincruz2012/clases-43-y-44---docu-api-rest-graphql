const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: './logger/logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: './logger/warn/warn.log', level: 'warning' }),
    new winston.transports.File({ filename: './logger/combined/combined.log' }),
    new winston.transports.Console({ level: 'info' }),
    new winston.transports.Console({ level: 'warn' }),
    new winston.transports.Console({ level: 'error' }),
  ],
});

const loggerBase = req => {
  const { originalUrl, method } = req;
  logger.info(`Route: ${originalUrl} Method: ${method}`);
}

const loggerError = error => {
  logger.error(`Error: ${error}`);
}

const loggerWarning = warning => {
  logger.warn(`${warning}`);
}

const withLogger = (req, _res, next) => {
  req.logger = logger;
  req.loggerBase = loggerBase;
  req.loggerError = loggerError;
  req.loggerWarning = loggerWarning;
  next();
}

module.exports = {
  loggerBase,
  loggerError,
  loggerWarning,
  withLogger
}