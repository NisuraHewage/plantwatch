'use strict';

const { Sequelize,Model,DataTypes } = require('sequelize');

const sequelize = new Sequelize('og_test', 'admin', process.env.MYSQL_PASSWORD, {
  host:  process.env.MYSQL_ENDPOINT,
  dialect: 'mysql',
  port: 3306
});

const Users = require('../models/Users');
const User = Users(sequelize, DataTypes);

const PlantProfiles = require('../models/PlantProfiles');
const PlantProfile = PlantProfiles(sequelize, DataTypes);

async function profileGet(profileId, event){
  try {
      await sequelize.authenticate();

      const plantProfile = await PlantProfile.findAll({
        where:{Id: profileId}
      });

      if(plantProfile.length == 0){
        return {
          statusCode: 400,
          body:{
            message: "Plant Profile doesn't exist"
          },
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Authorization'
          }
        }
      }

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Authorization'
        },
        body: JSON.stringify({
          result: plantProfile
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

module.exports.getProfile = async (event, context) => {
  const body = JSON.parse(event.body);
  return await profileGet(event.queryStringParameters.profileId, event);
};
