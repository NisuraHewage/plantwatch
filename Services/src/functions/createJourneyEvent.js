


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

async function journeyCreate(title,plantProfileId, description, careInstructions, weeksAfterBirth, gifUrl , event){
    try {
        await sequelize.authenticate();

       // Validate Email, Password

        const exitingEvents = await PlantEventJourney.findAll({
          where:{Title: title}
        });

        if(exitingEvents.length != 0){
          return {
            statusCode: 400,
            body:{
              message: "This journey event Already Exists"
            },
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
              'Access-Control-Allow-Headers': 'Authorization'
            }
          }
        }

        const newEvent = await PlantEventJourney.create(
          { Title: title,
             PlantProfileId : plantProfileId,
            Description: description,
            CareInstructions: careInstructions,
            WeeksAfterBirth: weeksAfterBirth,
            GifUrl: gifUrl
             });

        return {
          statusCode: 201,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Authorization'
          },
          body: JSON.stringify({
            created: newEvent.Id
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

module.exports.createJourneyEvent = async (event, context) => {
  const body = JSON.parse(event.body);

  const {title,plantProfileId, description, careInstructions, weeksAfterBirth, gifUrl} = body;

  return await journeyCreate(title,plantProfileId, description, careInstructions, weeksAfterBirth, gifUrl, event);
};