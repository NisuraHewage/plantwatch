'use strict';

var AWS = require("aws-sdk");

const { v4: uuidv4 } = require('uuid');

AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.DYNAMO_DB_ACCESSKEY,
    secretAccessKey: process.env.DYNAMO_DB_SECRETKEY
});

console.log(process.env.DYNAMO_DB_ACCESSKEY);

var docClient =  new AWS.DynamoDB.DocumentClient();

 function readingCreate(userId, deviceId, moisture, temperature,  light, humidity, context){

  // Check if device exists in middleware

  var params = {
    TableName:"Readings",
    Item:{
        "ReadingId": uuidv4(),
        "DeviceId": deviceId,
        "UserId": userId,
        "Timestamp": Date.now(),
        "Moisture": moisture,
        "Temperature": temperature,
        "Light": light,
        "Humidity": humidity
    }
};

console.log(params)

docClient.put(params, function(err, data) {
    if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        return {
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Authorization'
          }
        }
    } else {
        console.log("Added item:", JSON.stringify(data, null, 2));
        return {
          statusCode: 201,
          body:{
            message: "Added Reading",
            created: data.ReadingId
          },
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Authorization'
          }
        }
    }
});
}

module.exports.postReadings = async (event, context) => {
  console.log(event.body)
  const body = JSON.parse(event.body);
  readingCreate(body.userId, body.deviceId, body.moisture, body.temperature, body.light, body.humidity, context);
};
