'use strict';
const {
  Model
} = require('sequelize');

const Parameter = require('./parameter')

module.exports = (sequelize, DataTypes) => {
  class PlantProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PlantProfile.hasMany(Parameter);
    }
  };
  PlantProfile.init({
    name: DataTypes.STRING,
    scientificName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PlantProfile',
  });
  return PlantProfile;
};