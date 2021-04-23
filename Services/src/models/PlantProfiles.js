const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PlantProfiles', {
    Id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Name: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    ScientificName: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    ImageUrl: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    PlantDescription: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    Watering: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    Temperature: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    Sunlight: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    Soil: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    Pests: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    Diseases: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    Fertilizer: {
      type: DataTypes.STRING(1000),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'PlantProfiles',
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
    ]
  });
};
