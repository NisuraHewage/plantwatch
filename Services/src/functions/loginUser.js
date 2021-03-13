'use strict';

const { Sequelize,Model,DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Move to config
const sequelize = new Sequelize('og_test', 'admin', process.env.MYSQL_PASSWORD, {
    host:  process.env.MYSQL_ENDPOINT,
    dialect: 'mysql',
    port: 3306
});

const Users = require('../models/Users');
const User = Users(sequelize, DataTypes);

async function userLogin(email, password, event){
    try {
        await sequelize.authenticate();

       // Validate Email, Password (To be moved to Gateway)

        const exitingUser = await User.findOne({
          where:{Email: email}
        });

        if(exitingUser.length != 0){

          const compareResult = bcrypt.compareSync(password, exitingUser.password)
          if (compareResult) {
            let token = jwt.sign({
              email: exitingUser.email
            }, process.env.JWT_SECRET, {
              expiresIn: '365d'
         });

            return {
              statusCode: 200,
              body:JSON.stringify({
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
                message: "Invalid Credentials"
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
  return await userLogin(body.email, body.password, event);
};
