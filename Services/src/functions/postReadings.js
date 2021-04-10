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

const Users = require('../models/Parameters');
const User = Users(sequelize, DataTypes);


async function verifyParameters(userId, deviceId, moisture, temperature,  light, humidity){
  try {
        // Get last 5 readings for device
        var result = await docClient.scan({TableName:"Readings"}).promise();
       var last5Readings =  result.Items.filter(d => d.DeviceId == deviceId).sort((a,b) => b.Timestamp - a.Timestamp ).slice(0,5);
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

      last5Readings.forEach(reading => {
        for(let j = 0; j < params.length; j++){
          let param = params[j];
          if(reading[param.Name].Value < param.LowerLimit || reading[param.Name].Value > param.UpperLimit){
            param.invalid = true;
          }else{
            param.invalid = false;
          }
        }
      });

      let notificationMessage = "";
      for(let l = 0; l < params.length; l++){
        let param = params[l];
        if(param.invalid){
          notificationMessage += param.Message;
        }
      }
      if(notificationMessage != ""){
        // Send to sns
        var user = await User.findOne({
          Id: userId
        });

        var params = {
          Message: notificationMessage, /* required */
          TargetArn : user.SnSPushDeviceId
        };
  
        // Create promise and SNS service object
        var publishTextPromise = sns.publish(params).promise();
  
        // Handle promise's fulfilled/rejected states
        publishTextPromise.then(
          function(data) {
            console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
            console.log("MessageID is " + data.MessageId);
            return endpointArn;
          }).catch(
            function(err) {
            console.error(err, err.stack);
          });


        return "OK"
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

  let verificationResult = await verifyParameters(userId, deviceId, moisture, temperature, light, humidity);

  if(verificationResult != "OK"){
    return verificationResult;
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
  console.log(event.body)
  const body = JSON.parse(event.body);

  const {userId, deviceId, moisture, temperature, light, humidity} = body;

  return await readingCreate(userId, deviceId, moisture, temperature, light, humidity, context);
};
