'use strict';


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

      await sequelize.close();
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
  return await profilesGet(event,queryStringParameters.plantName, event);
};
