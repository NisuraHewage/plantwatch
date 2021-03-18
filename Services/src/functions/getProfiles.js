'use strict';

const { Sequelize,Model,DataTypes } = require('sequelize');
const sequelize = new Sequelize('og_test', 'admin', process.env.MYSQL_PASSWORD, {
  host:  process.env.MYSQL_ENDPOINT,
  dialect: 'mysql',
  port: 3306
});

const PlantProfiles = require('../models/PlantProfiles');
const PlantProfile = PlantProfiles(sequelize, DataTypes);

async function profilesGet(name, event){
  try {
      await sequelize.authenticate();

      const plantProfiles = await PlantProfile.findAll({
      });

      let result = null;
      if(name != "" || undefined){
        result = plantProfiles.filter(pp => pp.Name.includes(name))
      }else{
        result = plantProfiles;
      }

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Authorization'
        },
        body: JSON.stringify({
          result
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

module.exports.getProfiles = async (event, context) => {
  return await profilesGet(event.queryStringParameters.plantName, event);
};
