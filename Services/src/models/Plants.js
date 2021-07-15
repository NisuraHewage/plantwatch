const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Plants', {
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
    Birthdate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'Id'
      }
    },
    DeviceID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Devices',
        key: 'Id'
      }
    },
    PlantProfileID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'PlantProfiles',
        key: 'Id'
      }
    }
  }, {
    sequelize,
    tableName: 'Plants',
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
        name: "fk_plant_user",
        using: "BTREE",
        fields: [
          { name: "UserID" },
        ]
      },
      {
        name: "fk_plant_device",
        using: "BTREE",
        fields: [
          { name: "DeviceID" },
        ]
      },
      {
        name: "fk_plant_profile",
        using: "BTREE",
        fields: [
          { name: "PlantProfileID" },
        ]
      },
    ]
  });
};
