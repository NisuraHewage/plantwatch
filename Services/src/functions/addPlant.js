'use strict';

const { Sequelize,Model,DataTypes } = require('sequelize');

// Move to config
const sequelize = new Sequelize('og_test', 'admin', process.env.MYSQL_PASSWORD, {
    host:  process.env.MYSQL_ENDPOINT,
    dialect: 'mysql',
    port: 3306
});

const PlantProfiles = require('../models/PlantProfiles');
const PlantProfile = PlantProfiles(sequelize, DataTypes);

const Plants = require('../models/Plants');
const Plant = Plants(sequelize, DataTypes);

const Devices = require('../models/Devices');
const Device = Devices(sequelize, DataTypes);

async function plantCreate(plantName, plantProfileId, userId, deviceId, event){
  try {
      await sequelize.authenticate();

     // Check if device exists

     const exitingDevices = await Device.findAll({
      where:{DeviceID: deviceId}
    });

    if(exitingDevices.length == 0){
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "This device does not exists"
        }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Authorization'
        }
      }
    }

      const exitingProfiles = await PlantProfile.findAll({
        where:{Id: plantProfileId}
      });

      if(exitingProfiles.length == 0){
        return {
          statusCode: 400,
          body:JSON.stringify({
            message: "Plant Profile Does Not Exist"
          }),
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Authorization'
          }
        }
      }

      const newPlant = await Plant.create({ Name: plantName, PlantProfileID: plantProfileId, DeviceID: deviceId, UserID : userId });

      await sequelize.close();
      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Authorization'
        },
        body: JSON.stringify({
          created: newPlant.Id
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

module.exports.addPlant = async (event, context) => {
  const body = JSON.parse(event.body);
  return await plantCreate( body.plantName, body.plantProfileId, body.userId, body.deviceId ,event);
};
