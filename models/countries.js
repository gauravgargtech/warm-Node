const { DataTypes } = require("sequelize");
//const sequelize = require("../adapters/mysql");

module.exports = (sequelize) => {
  const attributes = {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "id",
    },
    short_name: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "short_name",
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "name",
    },
    phone_code: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "phone_code",
    },
  };
  const options = {
    tableName: "countries",
    comment: "",
    indexes: [],
    timestamps: false
  };
  const CountriesModel = sequelize.define(
    "countries_model",
    attributes,
    options
  );
  return CountriesModel;
};
