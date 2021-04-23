'use strict';

var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.DYNAMO_DB_ACCESSKEY,
    secretAccessKey: process.env.DYNAMO_DB_SECRETKEY
});


var docClient =  new AWS.DynamoDB.DocumentClient();

 async function diseaseIdentificationResultsView(userId, context){
  var params = {
    TableName : "DiseaseIdentificationResult",
    KeyConditionExpression: "#dId = :device",
    ExpressionAttributeNames:{
        "#dId": "DeviceId"
    },
    ExpressionAttributeValues: {
        ":device": parseInt(deviceId),
    }
};


try{
  // Replace Scan with Query
  var result = await docClient.scan({TableName:"DiseaseIdentificationResult"}).promise();
  console.log("Query succeeded.");
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Authorization'
    },
    body: JSON.stringify({
      results: result.Items.filter(d => d.UserId == userId).sort((a,b) => b.Timestamp - a.Timestamp).slice(0,100)
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

module.exports.viewDiseaseResults = async (event, context) => {
  return await diseaseIdentificationResultsView(event.queryStringParameters.userId, context);
};
