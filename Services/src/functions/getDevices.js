'use strict';

const { Sequelize,Model,DataTypes } = require('sequelize');

const sequelize = new Sequelize('og_test', 'admin', process.env.MYSQL_PASSWORD, {
  host:  process.env.MYSQL_ENDPOINT,
  dialect: 'mysql',
  port: 3306
});

const Users = require('../models/Users');
const User = Users(sequelize, DataTypes);

const Devices = require('../models/Devices');
const Device = Devices(sequelize, DataTypes);

const Plants = require('../models/Plants');
const Plant = Plants(sequelize, DataTypes);

const PlantProfiles = require('../models/PlantProfiles');
const PlantProfile = PlantProfiles(sequelize, DataTypes);

var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.DYNAMO_DB_ACCESSKEY,
    secretAccessKey: process.env.DYNAMO_DB_SECRETKEY
});


var docClient =  new AWS.DynamoDB.DocumentClient();

async function devicesGet(userId, event){
  try {
      await sequelize.authenticate();

      const devices = await Device.findAll({
        where:{UserID: userId}
      });
      // Replace Scan with Query
     /*  var result = await docClient.scan({TableName:"Readings"}).promise();
      console.log("Query succeeded.");

      let readings = result.Items;
 */
      devices.forEach(d => {
        // Show as active if it is within a certain range
        /* if(readings.filter((a) => a.Timestamp > (Date.now() - parseInt(process.env.PUSH_FREQUENCY_MILLI_SECONDS)[0])).length > 0){
          d.Active = true;
        } */
        let plants = await Plant.findAll({
          where:{DeviceID: d.Id},
          include: PlantProfile
        });
        d.plants = plants;
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
