'use strict';
const {
  Model
} = require('sequelize');
const PlantProfile = require('./plantprofile');
module.exports = (sequelize, DataTypes) => {
  class Parameter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Parameter.belongsTo(PlantProfile);
    }
  };
  Parameter.init({
    name: DataTypes.STRING,
    value: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Parameter',
  });
  return Parameter;
};