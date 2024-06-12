const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

// Create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function (message) {
    // Use the 'info' log level so the output will be picked up by both
    // transports (file and console)
    logger.info(message.trim());
  },
};

module.exports = logger;
