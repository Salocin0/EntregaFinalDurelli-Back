import winston from 'winston';

const loggerDev = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.colorize({ all: true }),
    }),
  ],
});

const loggerProd = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.colorize({ all: true }),
    }),
    new winston.transports.File({
      filename: './errors.log',
      level: 'error',
      format: winston.format.simple(),
    }),
  ],
});

let selectedLogger;

export const addLogger = (req, res, next) => {
  if (process.env.NODE_ENV === 'prod') {
    req.logger = loggerProd;
    selectedLogger = loggerProd;
  } else {
    req.logger = loggerDev;
    selectedLogger = loggerDev;
  }
  next();
};

export {selectedLogger}

