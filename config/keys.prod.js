module.exports = {
  domain: process.env.domain,
  port: process.env.PORT,
  mysql: {
    host: process.env.mysql_host,
    username: process.env.mysql_username,
    password: process.env.mysql_password,
    database: process.env.mysql_database,
    port: process.env.mysql_port,
  },
  mongo: {
    scheme: process.env.mongo_scheme,
    username: process.env.mongo_username,
    host: process.env.mongo_host,
    password: process.env.mongo_password,
    database: process.env.mongo_database,
  },
  googleKeys: {
    clientId: process.env.google_client_id,
    clientSecret: process.env.google_secret_id,
  },
  cookieKey: process.env.cookie_key,
  email: {
    host: process.env.email_host,
    username: process.env.email_username,
    password: process.env.email_password,
    from: process.env.email_from,
    port: process.env.email_port,
  },
  awsCloudWatch: {
    groupName: process.env.cloudwatch_groupname,
    streamName: process.env.cloudwatch_streamname,
    awsSecretKey: process.env.cloudwatch_secretkey,
    awsAccessKey: process.env.cloudwatch_accesskey,
  },
  googleKeys: {
    clientId: process.env.googleKey_clientID,
    clientSecret: process.env.googleKey_clientSecret,
  },
  twitterKeys: {
    consumerKey: process.env.twitterKey_consumerKey,
    consumerSecret: process.env.twitterKey_consumerSecret,
  },
  facebookKeys: {
    clientId: process.env.facebookKey_clientID,
    clientSecret: process.env.facebookKey_clientSecret,
  },
};
