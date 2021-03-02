var DataTypes = require("sequelize").DataTypes;
var _Devices = require("./Devices");
var _Parameters = require("./Parameters");
var _PlantProfiles = require("./PlantProfiles");
var _Plants = require("./Plants");
var _Users = require("./Users");

function initModels(sequelize) {
  var Devices = _Devices(sequelize, DataTypes);
  var Parameters = _Parameters(sequelize, DataTypes);
  var PlantProfiles = _PlantProfiles(sequelize, DataTypes);
  var Plants = _Plants(sequelize, DataTypes);
  var Users = _Users(sequelize, DataTypes);

  Plants.belongsTo(Devices, { as: "Device", foreignKey: "DeviceID"});
  Devices.hasMany(Plants, { as: "Plants", foreignKey: "DeviceID"});
  Parameters.belongsTo(PlantProfiles, { as: "PlantProfile", foreignKey: "PlantProfileID"});
  PlantProfiles.hasMany(Parameters, { as: "Parameters", foreignKey: "PlantProfileID"});
  Devices.belongsTo(Users, { as: "User", foreignKey: "UserID"});
  Users.hasMany(Devices, { as: "Devices", foreignKey: "UserID"});
  Plants.belongsTo(Users, { as: "User", foreignKey: "UserID"});
  Users.hasMany(Plants, { as: "Plants", foreignKey: "UserID"});

  return {
    Devices,
    Parameters,
    PlantProfiles,
    Plants,
    Users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
