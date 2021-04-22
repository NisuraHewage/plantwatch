'use strict';

var AWS = require("aws-sdk");

const { v4: uuidv4 } = require('uuid');

AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.DYNAMO_DB_ACCESSKEY,
    secretAccessKey: process.env.DYNAMO_DB_SECRETKEY
});


var docClient =  new AWS.DynamoDB.DocumentClient();
const { Sequelize,Model,DataTypes } = require('sequelize');
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

const Users = require('../models/Parameters');
const User = Users(sequelize, DataTypes);

const READING_COUNT = 3;

function getNotificationMessage(last5Readings, params){
      let today = new Date();
      // Ensure we only consider readings as old as one day
      last5Readings = last5Readings.filter(r => r.Timestamp >= new Date(today.getTime() - 8.64e+7));
      last5Readings.forEach(reading => {

        for(let j = 0; j < params.length; j++){
          let param = params[j];

          if(reading[param.Name] < param.LowerLimit){
            param.short = true;
          }else{
            param.short = false;
          }
          if(reading[param.Name] > param.UpperLimit){
            param.long = true;
          }else{
            param.long = false;
          }
        }
      });

      let notificationMessage = "";
      for(let l = 0; l < params.length; l++){
        let param = params[l];
        if(param.long){
          notificationMessage += " " + param.Action + " | ";
        }
        if(param.short){
          notificationMessage += " " + param.Message + " | ";
        }
      }
      return notificationMessage;
}

async function verifyParameters(userId, deviceId, moisture, temperature,  light, humidity){
  try {
        // Get last 5 readings for device
        var result = await docClient.scan({TableName:"Readings"}).promise();
        // This is sorted to ensure even if latest readings are not valid that the if the last n windows have been valid it doesn't notify
       var last5Readings =  result.Items.filter(d => d.DeviceId == deviceId).sort((a,b) => a.Timestamp - b.Timestamp ).slice(0,READING_COUNT);
    await sequelize.authenticate();

    let devices = await Device.findAll({
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

    let plants = await Plant.findAll({
      DeviceID : devices[0].Id
      }
    );

    for(let i = 0; i < plants.length; i++){
      let plant = plants[i];
      let params = await Parameter.findAll({
        PlantProfileID : plant.PlantProfileID
        }
      );
      let notificationMessage = getNotificationMessage(last5Readings, params);

/*  // Replaced with testable unit function
      last5Readings.forEach(reading => {
        for(let j = 0; j < params.length; j++){
          let param = params[j];
          if(reading[param.Name].Value < param.LowerLimit){
            param.short = true;
          }else{
            param.short = false;
          }
          if(reading[param.Name].Value > param.UpperLimit){
            param.long = true;
          }else{
            param.long = false;
          }
        }
      });

      let notificationMessage = "";
      for(let l = 0; l < params.length; l++){
        let param = params[l];
        if(param.long){
          notificationMessage += " " + param.Action + " | ";
        }
        if(param.short){
          notificationMessage += " " + param.Message + " | ";
        }
      } */
      if(notificationMessage != ""){
        // Send to sns
        var user = await User.findOne({
          Id: userId
        });
        
        var messageParams = {
          Message: notificationMessage, /* required */
          TargetArn : user.SnSPushDeviceId
        };
  
        try{

          // Create promise and SNS service object
          var publishTextPromise = await sns.publish(messageParams).promise();
          // create notification in dynamo
          var notificationParams = {
            TableName:"Notifications",
            Item:{
                "NotificationId": uuidv4(),
                "UserId": userId,
                "Timestamp": Date.now(),
                "Message": notificationMessage,
                "IsRead": false
            }
          }
            var result = await docClient.put(notificationParams).promise();
              console.log("Added item:", result);
              return "OK";
        
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
      }else{
        return "OK";
      }
    }

  } catch (error) {
    console.error('Error verifying readings:', error);
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

async function readingCreate(userId, deviceId, moisture, temperature,  light, humidity, batteryLevel, context){

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
        "Humidity": humidity,
        "BatteryLevel": batteryLevel
    }
};

try{
  var result = await docClient.put(params).promise();

  let verificationResult = await verifyParameters(userId, deviceId, moisture, temperature, light, humidity);

  if(verificationResult != "OK"){
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Authorization'
      }
    }
  }

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
  const body = JSON.parse(event.body);

  const {userId, deviceId, moisture, temperature, light, humidity, batteryLevel} = body;

  return await readingCreate(userId, deviceId, moisture, temperature, light, humidity, batteryLevel, context);
};

module.exports.getNotificationMessage = getNotificationMessage;