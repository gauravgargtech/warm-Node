module.exports = {
  port: 3000,
  mysql: {
    host: "localhost",
    username: "root",
    password: "mysql",
    database: "warm",
    port: 3306,
  },
  mongo: {
    scheme: "",
    host: "",
    username: "",
    password: "",
    database: "",
  },
  googleKeys: {
    clientId: "",
    clientSecret: "",
  },
  cookieKey: "",
  email: {
    host: "",
    username: "",
    password: "",
    from: "",
    port: 587,
  },
  awsCloudWatch: {
    groupName: "",
    streamName: "",
    awsSecretKey: "",
    awsAccessKey: "",
  },
};
