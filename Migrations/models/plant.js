'use strict';
const {
  Model
} = require('sequelize');
const Device = require('./device');

module.exports = (sequelize, DataTypes) => {
  class Plant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Plant.belongsTo(Device);
    }
  };
  Plant.init({
    name: DataTypes.STRING,
    profileId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Plant',
  });
  return Plant;
};