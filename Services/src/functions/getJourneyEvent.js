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


async function getEventById(eventId, event){
  try {
      await sequelize.authenticate();


      const exitingEvents = await PlantEventJourney.findAll({
        where:{Id: eventId}
      });


      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Authorization'
        },
        body: JSON.stringify({
          result: exitingEvents[0]
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

const eventId = event.queryStringParameters.id;
if(eventId){
  return await getEventById(eventId, event);
}

return {
  statusCode: 200,
  body: JSON.stringify({
    message: 'Go Serverless v1.0! Your function executed successfully!',
    input: event,
  }),
};
};

