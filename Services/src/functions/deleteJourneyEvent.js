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

async function journeyDelete(id, event){
    try {
        await sequelize.authenticate();

       // Validate Email, Password

        const exitingEvents = await PlantEventJourney.findAll({
          where:{Id: id}
        });

        if(exitingEvents.length == 0){
          return {
            statusCode: 400,
            body:{
              message: "This journey event doesn't Exists"
            },
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
              'Access-Control-Allow-Headers': 'Authorization'
            }
          }
        }

        await exitingEvents[0].destroy();

        return {
          statusCode: 201,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Authorization'
          },
          body: JSON.stringify({
            deleted: id.Id
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


module.exports.deleteJourneyEvent = async (event, context) => {
  const body = JSON.parse(event.body);

  return await journeyDelete(event.queryStringParameters.id, event);
};
