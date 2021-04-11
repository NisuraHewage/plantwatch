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
        ":device": parseInt(deviceId),
    }
};

console.log(params);

try{
  // Replace Scan with Query
  var result = await docClient.scan({TableName:"Readings"}).promise();
  console.log("Query succeeded.");
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Authorization'
    },
    body: JSON.stringify({
      readings: result.Items.filter(d => d.DeviceId == deviceId).sort((a,b) => b.Timestamp - a.Timestamp ).slice(0,100)
    })
  };
}catch(err){
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


/* docClient.query(params, function(err, data) {
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
} */

module.exports.viewReadings = async (event, context) => {
  return await readingsView(event.queryStringParameters.deviceId, context);
};
