'use strict';

var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.DYNAMO_DB_ACCESSKEY,
    secretAccessKey: process.env.DYNAMO_DB_SECRETKEY
});

console.log(process.env.DYNAMO_DB_SECRETKEY);

var docClient =  new AWS.DynamoDB.DocumentClient();

async function readingsView(deviceId, context){
  var params = {
    TableName : "Readings",
    KeyConditionExpression: "#dId = :device",
    ExpressionAttributeNames:{
        "#dId": "DeviceId"
    },
    ExpressionAttributeValues: {
        ":device": deviceId
    }
};

console.log(params);

docClient.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        return {
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Authorization'
          }
        };
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log(" -", item);
        });
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Authorization'
          },
          body: {
            readings: data.Items
          }
        };
    }
});
}

module.exports.viewReadings = async (event, context) => {
  console.log(event.queryStringParameters);
  await readingsView(event.queryStringParameters.deviceId, context);
};
