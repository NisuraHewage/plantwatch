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
    ]
  });
};
