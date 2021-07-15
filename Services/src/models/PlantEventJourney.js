const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PlantEventJourney', {
    Id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Title: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    Description: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    GifUrl: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    CareInstructions: {
      type: DataTypes.STRING(6000),
      allowNull: true
    },
    WeeksAfterBirth: {
      type: DataTypes.INT,
      allowNull: true
    },
    PlantProfileId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'PlantProfiles',
        key: 'Id'
      }
    }
  }, {
    sequelize,
    tableName: 'PlantEventJourney',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id" },
        ]
      },
      {
        name: "fk_plantprofile_event",
        using: "BTREE",
        fields: [
          { name: "PlantProfileId" },
        ]
      },
    ]
  });
};
