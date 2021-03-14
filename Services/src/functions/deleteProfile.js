'use strict';

const sequelize = new Sequelize('og_test', 'admin', process.env.MYSQL_PASSWORD, {
  host:  process.env.MYSQL_ENDPOINT,
  dialect: 'mysql',
  port: 3306
});

const PlantProfiles = require('../models/PlantProfiles');
const PlantProfile = PlantProfiles(sequelize, DataTypes);

async function profileDelete(profileId, event){
  try {
      await sequelize.authenticate();

      const plantProfiles = await PlantProfile.findAll({
        Id: profileId
      });

      await plantProfiles[0].destroy();

      await sequelize.close();
      return {
        statusCode: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Authorization'
        },
        body: JSON.stringify({
          message: "Successfully deleted"
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

module.exports.deleteProfile = async (event, context) => {
  const body = JSON.parse(event.body);
  return await profileDelete(body.profileId, event);
};
