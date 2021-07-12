'use strict';

const { Sequelize,Model,DataTypes } = require('sequelize');

const sequelize = new Sequelize('og_test', 'admin', process.env.MYSQL_PASSWORD, {
  host:  process.env.MYSQL_ENDPOINT,
  dialect: 'mysql',
  port: 3306
});


const Plants = require('../models/Plants');
const Plant = Plants(sequelize, DataTypes);

async function plantsGet(deviceId, event){
  try {
      await sequelize.authenticate();

      const plants = await Plant.findAll({
        where:{DeviceID: deviceId}
      });

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Authorization'
        },
        body: JSON.stringify({
          result: plants
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


module.exports.getPlants = async (event, context) => {
  return await plantsGet(event.queryStringParameters.deviceId, event)
};
