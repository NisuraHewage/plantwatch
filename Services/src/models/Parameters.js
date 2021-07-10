const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Parameters', {
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
    Value: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    UpperLimit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LowerLimit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PlantProfileID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'PlantProfiles',
        key: 'Id'
      }
    },
    Message: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    Action: {
      type: DataTypes.STRING(1000),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Parameters',
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
        name: "fk_plant_profiles",
        using: "BTREE",
        fields: [
          { name: "PlantProfileID" },
        ]
      },
    ]
  });
};
