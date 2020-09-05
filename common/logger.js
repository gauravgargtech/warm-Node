const winston = require("winston"),
  WinstonCloudWatch = require("winston-cloudwatch");
const config = require("../config/keys");

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
