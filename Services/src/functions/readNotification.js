'use strict';


var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.DYNAMO_DB_ACCESSKEY,
  secretAccessKey: process.env.DYNAMO_DB_SECRETKEY
});

var docClient =  new AWS.DynamoDB.DocumentClient();

async function notificationRead(notificationIds){

  // Check if device exists in middleware

  
  try{
    for(let i = 0; i < notificationIds.length; i++){
      var params = {
        TableName:"Notifications",
        Item:{
          "IsRead": true,
          "ProfileId": notificationIds[i]
        }
    };
      
    var result = await docClient.put(params).promise();

    }
  console.log("Updated item:", result);

  return {
    statusCode: 201,
    body:JSON.stringify({
      message: "Read Notifications"
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


module.exports.readNotification = async (event, context) => {
  const body = JSON.parse(event.body);
  return await notificationRead(body.notifications);
};
