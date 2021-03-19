'use strict';

const { Sequelize,Model,DataTypes } = require('sequelize');
// Move to config
const sequelize = new Sequelize('og_test', 'admin', process.env.MYSQL_PASSWORD, {
  host:  process.env.MYSQL_ENDPOINT,
  dialect: 'mysql',
  port: 3306
});

const Users = require('../models/Users');
const User = Users(sequelize, DataTypes);

const Parameters = require('../models/Parameters');
const Parameter = Parameters(sequelize, DataTypes);

async function parametersGet(profileId, event){
  try {
      await sequelize.authenticate();

      const parameters = await Parameter.findAll({
        where:{PlantProfileID: profileId}
      });

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Authorization'
        },
        body: JSON.stringify({
          result: parameters
        })
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

module.exports.getParameters = async (event, context) => {
  return await parametersGet(event.queryStringParameters.profileId, event);
};
