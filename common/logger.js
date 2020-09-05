const winston = require("winston"),
  WinstonCloudWatch = require("winston-cloudwatch");

const AWS = require("aws-sdk");

AWS.config.update({
  region: "ap-south-1",
});

winston.add(
  new WinstonCloudWatch({
    cloudWatchLogs: new AWS.CloudWatchLogs(),
    logGroupName: "testing",
    logStreamName: "first",
    awsSecretKey: "ILWyzscCzvLF7FvQY2hXYusGP+I4q2aZRf9hVcVT",
    awsAccessKeyId: "AKIAIE6EQ4JM46RVSAKA",
    level: "debug",
  })
);

module.exports = winston;
