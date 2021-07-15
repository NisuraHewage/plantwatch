'use strict';


const { Sequelize,Model,DataTypes } = require('sequelize');

// Move to config
const sequelize = new Sequelize('og_test', 'admin', process.env.MYSQL_PASSWORD, {
    host:  process.env.MYSQL_ENDPOINT,
    dialect: 'mysql',
    port: 3306
});

const PlantEventJourneys = require('../models/PlantEventJourney');
const PlantEventJourney = PlantEventJourneys(sequelize, DataTypes);


async function getEventsForUser(userId, event){
  try {
      await sequelize.authenticate();

    // Get Plants for user, then get journeys for each plant profile. Filter out the ones that are within the next 2 months
      const exitingEvents = await PlantEventJourney.findAll({
        where:{PlantProfileId: profileId}
      });


      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Authorization'
        },
        body: JSON.stringify({
          result: exitingEvents
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

async function getEventsForProfile(profileId, event){
    try {
        await sequelize.authenticate();


        const exitingEvents = await PlantEventJourney.findAll({
          where:{PlantProfileId: profileId}
        });


        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Authorization'
          },
          body: JSON.stringify({
            result: exitingEvents
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




module.exports.getJourneyEvents = async (event, context) => {

  const userId = event.queryStringParameters.userId;
  
  /* if(userId){
    return await getEventsForUser(userId, event);
  } */


  const profileId = event.queryStringParameters.profileId;
  if(profileId){
    return await getEventsForProfile(profileId, event);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };
};
