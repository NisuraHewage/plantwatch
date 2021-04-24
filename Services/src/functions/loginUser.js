'use strict';

const { Sequelize,Model,DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.DYNAMO_DB_ACCESSKEY,
  secretAccessKey: process.env.DYNAMO_DB_SECRETKEY
});


var sns = new AWS.SNS({apiVersion: '2010-03-31'});

async function registerDevice(token, userId){
  try{
  let endpointArn = null;
  var params = {
    PlatformApplicationArn: process.env.SNS_PLATFORM_APPLICATION_ARN, /* required */
    Token: token, 
    CustomUserData: userId.toString()
  };
  let endpointArnResponse = await sns.createPlatformEndpoint(params).promise();
  console.log(endpointArnResponse);
  endpointArn = endpointArnResponse.EndpointArn;
  params = {
    Message: 'You logged in!', /* required */
    TargetArn : endpointArn
  };

  // Create promise and SNS service object
  var publishTextPromise = await sns.publish(params).promise();
  console.log(publishTextPromise);
  return endpointArn;
}catch(e){
  return "";
}
  /* sns.createPlatformEndpoint(params, function(err, data) {
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
      
      return endpointArn;

    }  
  }); */
}

async function userLogin(email, password, deviceToken, event){
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

        if(exitingUser != null){

          const compareResult = bcrypt.compareSync(password, exitingUser.Password)
          if (compareResult) {
            let token = jwt.sign({
              email: exitingUser.Email,
              userId: exitingUser.Id
            }, process.env.JWT_SECRET, {
              expiresIn: '365d'
         });


         if(true){
           var applicationArn = await registerDevice(deviceToken, exitingUser.Id.toString());
           exitingUser.SnSPushDeviceId = applicationArn;
           await exitingUser.save();
         }

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


module.exports.loginUser = async (event, context) => {
  const body = JSON.parse(event.body);
  return await userLogin(body.email, body.password, body.deviceToken, event);
};
