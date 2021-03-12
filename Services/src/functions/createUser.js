'use strict';

const bcrypt = require('bcryptjs');
const { Sequelize,Model,DataTypes } = require('sequelize');

// Move to config
const sequelize = new Sequelize('og_test', 'admin', process.env.MYSQL_PASSWORD, {
    host:  process.env.MYSQL_ENDPOINT,
    dialect: 'mysql',
    port: 3306
});

const Users = require('../models/Users');
const User = Users(sequelize, DataTypes);

async function userCreate(email, password, event){
    try {
        await sequelize.authenticate();

       // Validate Email, Password

        const exitingUsers = await User.findAll({
          where:{Email: email}
        });

        if(exitingUsers.length != 0){
          return {
            statusCode: 400,
            body:{
              message: "Email Already Exists"
            },
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
              'Access-Control-Allow-Headers': 'Authorization'
            }
          }
        }

        const newUser = await User.create({ Email, Password : bcrypt.hashSync(password, 10) });
        // Return login token
         // Send the token from the request and use that to register for SnS notifications
        /* let snsPlatformEndpointArn = await registerDevice(body.deviceToken, newUser.userId)
        newUser.SnSPushDeviceId = snsPlatformEndpointArn;
        await newUser.save(); */

        await sequelize.close();
        return {
          statusCode: 201,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Authorization'
          },
          body: {
            created: newUser.Id
          }
        };
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

var sns = new AWS.SNS({apiVersion: '2010-03-31'});

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

module.exports.createUser = async (event, context) => {
  const body = JSON.parse(event.body);

  await userCreate(body.email, body.password, event);

  return ;
};
