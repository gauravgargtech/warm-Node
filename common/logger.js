const winston = require("winston");
const config = require("../config/keys");

const { format } = require("winston");

const { combine, timestamp, json, errors, metadata } = format;

const logger = winston.createLogger({
  level: "info",
  format: combine(errors({ stack: true }), timestamp(), json(), metadata()),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error", format: winston.format.simple(), }),
    new winston.transports.File({ filename: "combined.log", format: winston.format.simple(), }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: "rejections.log", format: winston.format.simple(), }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;

/*
const AWS = require("aws-sdk");

AWS.config.update({
  region: "ap-south-1",
});

winston.add(
  new WinstonCloudWatch({
    cloudWatchLogs: new AWS.CloudWatchLogs(),
    logGroupName: config.awsCloudWatch.groupName,
    logStreamName: config.awsCloudWatch.streamName,
    awsSecretKey: config.awsCloudWatch.awsSecretKey,
    awsAccessKeyId: config.awsCloudWatch.awsAccessKey,
    level: "debug",
  })
);

module.exports = winston;
*/
