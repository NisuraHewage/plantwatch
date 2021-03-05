'use strict';

const { Sequelize,Model,DataTypes } = require('sequelize');

// Move to config
const sequelize = new Sequelize('og_test', 'admin', process.env.MYSQL_PASSWORD, {
    host:  process.env.MYSQL_ENDPOINT,
    dialect: 'mysql',
    port: 3306
});

const Devices = require('../models/Devices');
const Device = Devices(sequelize, DataTypes);

const Users = require('../models/Users');
const User = Users(sequelize, DataTypes);

async function deviceCreate(userId, deviceId, event){
  try {
      await sequelize.authenticate();

     // Check if user exists

      const exitingUsers = await User.findAll({
        where:{Id: userId}
      });

      if(exitingUsers.length != 0){
        return {
          statusCode: 400,
          body:{
            message: "User Does Not Exist"
          },
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Authorization'
          }
        }
      }

      const exitingDevices = await Device.findAll({
        where:{DeviceID: deviceId}
      });

      if(exitingDevices.length != 0){
        return {
          statusCode: 400,
          body:{
            message: "Device of this Id is already registered"
          },
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Authorization'
          }
        }
      }



      const newDevice = await Device.create({ DeviceID: deviceId, UserID : userId });

      await sequelize.close();
      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Authorization'
        },
        body: {
          created: newDevice.Id
        }
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

module.exports.addDevice = async (event, context) => {
  const body = JSON.parse(event.body);
  await deviceCreate( body.userId, body.deviceId ,event);
};
