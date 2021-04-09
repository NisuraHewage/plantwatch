'use strict';

const { Sequelize,Model,DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



async function userLogin(email, password, event){
    try {
      console.log("MYSQL PW  " + process.env.MYSQL_PASSWORD);
        let envCopy = {};
      for(let e in process.env){
        envCopy[e] = process.env[e];
      } 
      console.log(envCopy)
        // Move to config
        const sequelize = new Sequelize('og_test', 'admin', process.env.MYSQL_PASSWORD, {
            host:  process.env.MYSQL_ENDPOINT,
            dialect: 'mysql',
            port: 3306
        });

        const Users = require('../models/Users');
        const User = Users(sequelize, DataTypes);
        await sequelize.authenticate();

       // Validate Email, Password (To be moved to Gateway)

        const exitingUser = await User.findOne({
          where:{Email: email}
        });

        if(exitingUser.length != 0){

          const compareResult = bcrypt.compareSync(password, exitingUser.Password)
          if (compareResult) {
            let token = jwt.sign({
              email: exitingUser.Email,
              userId: exitingUser.Id
            }, process.env.JWT_SECRET, {
              expiresIn: '365d'
         });

            return {
              statusCode: 200,
              body: JSON.stringify({
                message: "Successful Login",
                token: token
              }),
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Headers': 'Authorization'
              }
            }
          }else{
            return {
              statusCode: 400,
              body:{
                message: "Invalid  Credentials"
              },
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Headers': 'Authorization'
              }
            }
          }

          
        }else{

          return {
            statusCode: 404,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
              'Access-Control-Allow-Headers': 'Authorization'
            }
          }
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
}

var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.DYNAMO_DB_ACCESSKEY,
  secretAccessKey: process.env.DYNAMO_DB_SECRETKEY
});


var sns = new AWS.SNS({apiVersion: '2010-03-31'});

// For notifications (Check whether this goes in login)
async function registerDevice(token, userId){
  let endpointArn = null;
  var params = {
    PlatformApplicationArn: process.env.SNS_PLATFORM_APPLICATION_ARN, /* required */
    Token: token, 
    CustomUserData: userId
  };
  sns.createPlatformEndpoint(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      return null;
    }// an error occurred
    else {
      if(data == null){
        console.log("Request ended with Error. Failed to Register with SNS" );
      }
       console.log(data.EndpointArn);           // successful response
       endpointArn = data.EndpointArn;
       // Create publish parameters
      var params = {
        Message: 'MESSAGE_TEXT', /* required */
        TopicArn: endpointArn
      };

      // Create promise and SNS service object
      var publishTextPromise = sns.publish(params).promise();

      // Handle promise's fulfilled/rejected states
      publishTextPromise.then(
        function(data) {
          console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
          console.log("MessageID is " + data.MessageId);
        }).catch(
          function(err) {
          console.error(err, err.stack);
        });
    }  
  });

  
}

module.exports.loginUser = async (event, context) => {
  const body = JSON.parse(event.body);
  await registerDevice(body.deviceToken, body.email);
  return await userLogin(body.email, body.password, event);
};
