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
var sns = new AWS.SNS({apiVersion: '2010-03-31'});

// For notifications (Check whether this goes in login)
async function registerDevice(token, userId){
  var params = {
    PlatformApplicationArn: '',//process.env.SNS_PLATFORM_APPLICATION_ARN, /* required */
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
        return null;
      }
       console.log(data.EndpointArn);           // successful response
       return data.EndpointArn;
    }  
  });
}

module.exports.loginUser = async (event, context) => {
  const body = JSON.parse(event.body);
  return await userLogin(body.email, body.password, event);
};
