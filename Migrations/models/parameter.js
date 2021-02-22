'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Parameter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Parameter.init({
    name: DataTypes.STRING,
    value: DataTypes.DOUBLE,
    notificationAlert: DataTypes.STRING,
    actionMessage: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Parameter',
  });
  return Parameter;
};