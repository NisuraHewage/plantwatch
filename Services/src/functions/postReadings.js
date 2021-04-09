'use strict';

var AWS = require("aws-sdk");

const { v4: uuidv4 } = require('uuid');

AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.DYNAMO_DB_ACCESSKEY,
    secretAccessKey: process.env.DYNAMO_DB_SECRETKEY
});


var docClient =  new AWS.DynamoDB.DocumentClient();

const sequelize = new Sequelize('og_test', 'admin', process.env.MYSQL_PASSWORD, {
  host:  process.env.MYSQL_ENDPOINT,
  dialect: 'mysql',
  port: 3306
});

const Devices = require('../models/Devices');
const Device = Devices(sequelize, DataTypes);

const Plants = require('../models/Plants');
const Plant = Plants(sequelize, DataTypes);

const Parameters = require('../models/Parameters');
const Parameter = Parameters(sequelize, DataTypes);


async function verifyParameters(userId, deviceId, moisture, temperature,  light, humidity){
  try {
    await sequelize.authenticate();

    const devices = await Device.findAll({
      DeviceID : deviceId
      }
    );

    if(devices.length != 0){
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "This device doesn't exist"
        }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Authorization'
        }
      }
    };

    const plants = await Plant.findAll({
      DeviceID : devices[0].Id
      }
    );

    for(let i = 0; i < plants.length; i++){
      let plant = plants[i];
      const params = await Parameter.findAll({
        PlantProfileID : plant.PlantProfileID
        }
      );
      
    }

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
  // Foreach plantIds associated to device

    // Get plant profile

      // Get parameters

      // Foreach parameter
        // Verify that the last n readings are in condition state for each parameter.
        // If it is in condition state 
          // Create Notification Record
          // Push notification to socket 

}

async function readingCreate(userId, deviceId, moisture, temperature,  light, humidity, context){

  // Check if device exists in middleware

  var params = {
    TableName:"Readings",
    Item:{
        "ReadingId": uuidv4(),
        "DeviceId": parseInt(deviceId),
        "UserId": userId,
        "Timestamp": Date.now(),
        "Moisture": moisture,
        "Temperature": temperature,
        "Light": light,
        "Humidity": humidity
    }
};

console.log(params)
try{
  var result = await docClient.put(params).promise();
  console.log("Added item:", result);
  return {
    statusCode: 201,
    body:JSON.stringify({
      message: "Added Reading",
      created: result.ReadingId
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Authorization'
    }
  }
}catch(err){
  console.error("Unable to add item. Error JSON:", err);
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

module.exports.postReadings = async (event, context) => {
  console.log(event.body)
  const body = JSON.parse(event.body);

  const {userId, deviceId, moisture, temperature, light, humidity} = body;

  return await readingCreate(userId, deviceId, moisture, temperature, light, humidity, context);
};
