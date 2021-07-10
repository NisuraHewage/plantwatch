const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Devices', {
    Id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    DeviceID: {
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
    }
  }, {
    sequelize,
    tableName: 'Devices',
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
        name: "fk_user",
        using: "BTREE",
        fields: [
          { name: "UserID" },
        ]
      },
    ]
  });
};
