const Sequelize = require("sequelize");

const sequelize = new Sequelize("wish", "root", "mysql", {
  dialect: "mysql",
  host: "localhost",
  query: {
    raw: true,
  },
});

module.exports = sequelize;
