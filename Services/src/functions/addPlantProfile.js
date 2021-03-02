'use strict';

const { Sequelize,Model,DataTypes } = require('sequelize');

// Move to config
const sequelize = new Sequelize('og_test', 'admin', process.env.MYSQL_PASSWORD, {
    host:  process.env.MYSQL_ENDPOINT,
    dialect: 'mysql',
    port: 3306
});

const PlantProfiles = require('../models/PlantProfiles');
const PlantProfile = PlantProfiles(sequelize, DataTypes);

async function profileCreate(plantName, scientificName, imageUrl){
  try {
      await sequelize.authenticate();

     // Check if profile exists

      const exitingProfiles = await PlantProfile.findAll({
        where:{Id: plantName}
      });

      if(exitingProfiles.length != 0){
        return {
          statusCode: 400,
          body:{
            message: "Plant profile of same name already exists"
          },
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Authorization'
          }
        }
      }

      const newProfile = await PlantProfile.create({ Name: plantName, ScientificName: scientificName });

      await sequelize.close();
      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Authorization'
        },
        body: {
          created: newProfile.Id
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

async function uploadToS3(){
  return "URL";
}


module.exports.addPlantProfile = async (event, context) => {
  const body = JSON.parse(event.body);
  const createdImageUrl = await uploadToS3();
  await profileCreate( body.name, body.scientificName, createdImageUrl ,event);
};
