'use strict';
const {
  Model
} = require('sequelize');
const User = require('./user');
const Plant = require('./plant');
module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Device.belongsTo(User);
      Device.hasMany(Plant);
    }
  };
  Device.init({
    deviceID: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Device',
  });
  return Device;
};