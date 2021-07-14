'use strict';


const { v4: uuidv4 } = require('uuid');

var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.DYNAMO_DB_ACCESSKEY,
  secretAccessKey: process.env.DYNAMO_DB_SECRETKEY
});

const { Sequelize,Model,DataTypes } = require('sequelize');

const sequelize = new Sequelize('og_test', 'admin', process.env.MYSQL_PASSWORD, {
  host:  process.env.MYSQL_ENDPOINT,
  dialect: 'mysql',
  port: 3306
});

const Users = require('../models/Users');
const User = Users(sequelize, DataTypes);

var sns = new AWS.SNS({apiVersion: '2010-03-31'});

var docClient =  new AWS.DynamoDB.DocumentClient();


var admin = require('firebase-admin');
var serviceAccount = require('../service.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

// For notifications (Check whether this goes in login)
async function notificationSend(message, userId){

  const sequelize = new Sequelize('og_test', 'admin', process.env.MYSQL_PASSWORD, {
    host:  process.env.MYSQL_ENDPOINT,
    dialect: 'mysql',
    port: 3306
});

  const Users = require('../models/Users');
  const User = Users(sequelize, DataTypes);
  await sequelize.authenticate();

 // Validate Email, Password (To be moved to Gateway)

  const existingUser = await User.findAll({
    where:{Id: userId}
  });

  if(existingUser.length != 0){
    var params = {
      Message: message, /* required */
      TargetArn : existingUser[0].SnSPushDeviceId
    };

    try{
      // Create promise and SNS service object
      admin.messaging().sendToDevice(existingUser[0].DeviceToken, {notification: {
            title: 'Plantwatch',
            body: message,
            icon: "https://www.ikea.com/mx/en/images/products/fejka-artificial-potted-plant-in-outdoor-monstera__0614197_pe686822_s5.jpg"
            }
          }
        )
      .then( async (response) => {
        console.log(response);

       var notificationParams = {
        TableName:"Notifications",
        Item:{
            "NotificationId": uuidv4(),
            "UserId": userId,
            "Timestamp": Date.now(),
            "Message": message,
            "IsRead": false
        }
      };
      var result = await docClient.put(notificationParams).promise();
      console.log("Added item:", result);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Notified!",
        }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Authorization'
        }
      }
      })
      
    }catch(error){
      console.error(error, error.stack);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Unfound"
        }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Authorization'
        }
      }
    }
    
   

      

    
  }else{
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "No user"
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Authorization'
      }
    }
  }

     
}

module.exports.sendNotification = async (event, context) => {
  var body =  JSON.parse(event.body);
  return await notificationSend(body.message, body.userId);
};
