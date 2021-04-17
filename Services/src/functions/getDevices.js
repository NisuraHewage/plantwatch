'use strict';

const { Sequelize,Model,DataTypes } = require('sequelize');
// Move to config
const sequelize = new Sequelize('og_test', 'admin', process.env.MYSQL_PASSWORD, {
  host:  process.env.MYSQL_ENDPOINT,
  dialect: 'mysql',
  port: 3306
});

const Users = require('../models/Users');
const User = Users(sequelize, DataTypes);

const Devices = require('../models/Devices');
const Device = Parameters(sequelize, DataTypes);

const Plants = require('../models/Plants');
const Plant = Parameters(sequelize, DataTypes);

async function devicesGet(userId, event){
  try {
      await sequelize.authenticate();

      const devices = await Device.findAll({
        where:{UserID: userId}
      });

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Authorization'
        },
        body: JSON.stringify({
          result: devices
        })
      };
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Authorization'
        }
      }
    }
}

module.exports.getDevices = async (event, context) => {
  return await devicesGet(event.queryStringParameters.userId, event)
};
